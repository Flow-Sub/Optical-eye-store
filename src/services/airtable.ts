import Airtable from 'airtable';
import { Product } from '../types';

// Initialize Airtable
const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

const PRODUCTS_TABLE = import.meta.env.VITE_AIRTABLE_PRODUCTS_TABLE || 'Products';

// Helper function to map Airtable record to Product type
const mapAirtableToProduct = (record: any): Product => {
  const fields = record.fields;
  
  // ✅ Parse images from Image field (URLs as JSON string)
  let images: string[] = ['https://via.placeholder.com/500'];
  
  if (fields['Image']) {
    try {
      // If Image field contains JSON array of URLs
      if (typeof fields['Image'] === 'string' && fields['Image'].startsWith('[')) {
        images = JSON.parse(fields['Image']);
      }
      // If Image field is already an array
      else if (Array.isArray(fields['Image'])) {
        images = fields['Image'];
      }
      // If it's a single URL string
      else if (typeof fields['Image'] === 'string' && fields['Image'].startsWith('http')) {
        images = [fields['Image']];
      }
    } catch (e) {
      console.warn('Failed to parse Image field, trying Photos field');
      // Fallback to Photos field
      if (fields['Photos']) {
        images = fields['Photos'].map((photo: any) => photo.url);
      }
    }
  }
  // Fallback to Photos field if Image is not present
  else if (fields['Photos']) {
    images = fields['Photos'].map((photo: any) => photo.url);
  }
  
  return {
    id: record.id,
    name: fields['Product Name'] || '',
    brand: fields['Brand'] || '',
    category: fields['Category']?.toLowerCase() || 'frames',
    price: parseFloat(fields['Price']) || 0,
    description: fields['Description'] || '',
    images,
    stock: parseInt(fields['Stock Quantity']) || 0,
    isActive: fields['Active Status'] !== false,
    features: fields['Features'] 
      ? (Array.isArray(fields['Features']) 
          ? fields['Features'] 
          : (typeof fields['Features'] === 'string' 
              ? JSON.parse(fields['Features']) 
              : []))
      : [],
    lensCompatible: fields['Lens Compatible'] || false,
  };
};

// Fetch all products from Airtable
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const records = await base(PRODUCTS_TABLE)
      .select({
        view: 'Grid view',
      })
      .all();

    return records.map(mapAirtableToProduct);
  } catch (error) {
    console.error('Error fetching products from Airtable:', error);
    throw new Error('Failed to fetch products');
  }
};

// Fetch single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const record = await base(PRODUCTS_TABLE).find(id);
    return mapAirtableToProduct(record);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Create new product (for admin)
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    console.log('Creating product with data:', productData);

    const record = await base(PRODUCTS_TABLE).create(
      {
        'Product Name': productData.name,
        'Brand': productData.brand,
        'Category': productData.category,
        'Price': productData.price,
        'Description': productData.description || '',
        'Stock Quantity': productData.stock || 0,
        'Lens Compatible': productData.lensCompatible || false,
        'Features': JSON.stringify(productData.features || []),
        'Image': JSON.stringify(productData.images || []), // ✅ Store URLs as JSON
        'Active Status': true,
      },
      { typecast: true }
    );

    console.log('Product created successfully:', record);
    return mapAirtableToProduct(record);
  } catch (error: any) {
    console.error('Error creating product:', error);
    console.error('Error details:', error.message);
    console.error('Error response:', error.error);
    throw new Error(error.message || 'Failed to create product');
  }
};

// Update product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const fields: any = {};
    
    if (updates.name) fields['Product Name'] = updates.name;
    if (updates.brand) fields['Brand'] = updates.brand;
    if (updates.category) fields['Category'] = updates.category;
    if (updates.price !== undefined) fields['Price'] = updates.price;
    if (updates.description) fields['Description'] = updates.description;
    if (updates.stock !== undefined) fields['Stock Quantity'] = updates.stock;
    if (updates.lensCompatible !== undefined) fields['Lens Compatible'] = updates.lensCompatible;
    if (updates.features) fields['Features'] = JSON.stringify(updates.features);
    if (updates.images) fields['Image'] = JSON.stringify(updates.images); // ✅ Update image URLs
    if (updates.isActive !== undefined) fields['Active Status'] = updates.isActive;

    const record = await base(PRODUCTS_TABLE).update(
      id,
      fields,
      { typecast: true }
    );

    return mapAirtableToProduct(record);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await base(PRODUCTS_TABLE).destroy(id);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// ============= APPOINTMENTS =============

const APPOINTMENTS_TABLE = import.meta.env.VITE_AIRTABLE_APPOINTMENTS_TABLE || 'Appointments';

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  storeLocation: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  calendlyEventUri?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  notes?: string;
  createdAt: string;
}

const mapAirtableToAppointment = (record: any): Appointment => {
  const fields = record.fields;
  return {
    id: record.id,
    customerName: fields['Customer Name'] || '',
    customerEmail: fields['Customer Email'] || '',
    customerPhone: fields['Customer Phone'] || '',
    storeLocation: fields['Store Location'] || '',
    serviceType: fields['Service Type'] || '',
    appointmentDate: fields['Appointment Date'] || '',
    appointmentTime: fields['Appointment Time'] || '',
    calendlyEventUri: fields['Calendly Event URI'] || '',
    status: fields['Status'] || 'Scheduled',
    notes: fields['Notes'] || '',
    createdAt: fields['Created At'] || new Date().toISOString(),
  };
};

// Create appointment
export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
  try {
    const record = await base(APPOINTMENTS_TABLE).create(
      {
        'Customer Name': appointmentData.customerName,
        'Customer Email': appointmentData.customerEmail,
        'Customer Phone': appointmentData.customerPhone || '',
        'Store Location': appointmentData.storeLocation,
        'Service Type': appointmentData.serviceType,
        'Appointment Date': appointmentData.appointmentDate,
        'Appointment Time': appointmentData.appointmentTime,
        'Calendly Event URI': appointmentData.calendlyEventUri || '',
        'Status': appointmentData.status || 'Scheduled',
        'Notes': appointmentData.notes || '',
      },
      { typecast: true }
    );

    return mapAirtableToAppointment(record);
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment');
  }
};

// Fetch all appointments
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const records = await base(APPOINTMENTS_TABLE)
      .select({
        sort: [{ field: 'Appointment Date', direction: 'desc' }],
      })
      .all();

    return records.map(mapAirtableToAppointment);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  id: string,
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show'
): Promise<Appointment> => {
  try {
    const record = await base(APPOINTMENTS_TABLE).update(
      id,
      { Status: status },
      { typecast: true }
    );
    return mapAirtableToAppointment(record);
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Failed to update appointment');
  }
};

// ============= ORDERS =============

const ORDERS_TABLE = import.meta.env.VITE_AIRTABLE_ORDERS_TABLE || 'Orders';

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  orderItems: string; // JSON string
  subtotal: number;
  shippingCost: number;
  tax: number;
  orderTotal: number;
  numberOfItems: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
}

const mapAirtableToOrder = (record: any): Order => {
  const fields = record.fields;
  return {
    id: record.id,
    orderId: fields['Order ID'] || '',
    customerName: fields['Customer Name'] || '',
    customerEmail: fields['Customer Email'] || '',
    customerPhone: fields['Customer Phone'] || '',
    shippingAddress: fields['Shipping Address'] || '',
    orderItems: fields['Order Items'] || '[]',
    subtotal: parseFloat(fields['Subtotal']) || 0,
    shippingCost: parseFloat(fields['Shipping Cost']) || 0,
    tax: parseFloat(fields['Tax']) || 0,
    orderTotal: parseFloat(fields['Order Total']) || 0,
    numberOfItems: parseInt(fields['Number of Items']) || 0,
    orderStatus: fields['Order Status'] || 'pending',
    orderDate: fields['Order Date'] || new Date().toISOString(),
  };
};

// Create order
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const record = await base(ORDERS_TABLE).create(
      {
        'Order ID': orderData.orderId,
        'Customer Name': orderData.customerName,
        'Customer Email': orderData.customerEmail,
        'Customer Phone': orderData.customerPhone,
        'Shipping Address': orderData.shippingAddress,
        'Order Items': orderData.orderItems,
        'Subtotal': orderData.subtotal,
        'Shipping Cost': orderData.shippingCost,
        'Tax': orderData.tax,
        'Order Total': orderData.orderTotal,
        'Number of Items': orderData.numberOfItems,
        'Order Status': orderData.orderStatus,
        'Order Date': orderData.orderDate,
      },
      { typecast: true }
    );

    return mapAirtableToOrder(record);
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

// Fetch all orders
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const records = await base(ORDERS_TABLE)
      .select({
        sort: [{ field: 'Order Date', direction: 'desc' }],
      })
      .all();

    return records.map(mapAirtableToOrder);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<Order> => {
  try {
    const record = await base(ORDERS_TABLE).update(
      id,
      { 'Order Status': status },
      { typecast: true }
    );
    return mapAirtableToOrder(record);
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
};

// Update product stock
// Update product stock
export const updateProductStock = async (productId: string, quantitySold: number): Promise<void> => {
  try {
    const product = await base(PRODUCTS_TABLE).find(productId);
    const currentStock = parseInt(String(product.fields['Stock Quantity'] || 0)) || 0;  // ← FIXED LINE
    const newStock = Math.max(0, currentStock - quantitySold);
    
    await base(PRODUCTS_TABLE).update(
      productId,
      { 'Stock Quantity': newStock },
      { typecast: true }
    );
  } catch (error) {
    console.error('Error updating stock:', error);
  }
};