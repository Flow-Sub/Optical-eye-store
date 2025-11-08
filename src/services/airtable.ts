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
        images = fields['Photos'].map((photo: { url: string }) => photo.url); // Fixed: Typed photo
      }
    }
  }
  // Fallback to Photos field if Image is not present
  else if (fields['Photos']) {
    images = fields['Photos'].map((photo: { url: string }) => photo.url); // Fixed: Typed photo
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
    allowedLensOptions: fields['Allowed Lens Options'] || [],  // Array of record IDs
    allowedCoatingOptions: fields['Allowed Coating Options'] || [],
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
        'Allowed Lens Options': productData.allowedLensOptions || [],
        'Allowed Coating Options': productData.allowedCoatingOptions || [],
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

// NEW: Batch create function for CSV import (Fixed: let for successCount)
export const batchCreateProducts = async (products: Partial<Product>[]): Promise<{ success: number; errors: string[] }> => {
  let successCount = 0; // Fixed: let instead of const
  const errors: string[] = [];
  let delay = 0; // For rate limiting

  for (const product of products) {
    try {
      // Delay between requests (200ms) to respect Airtable limits
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = 200;

      await createProduct(product);
      successCount++; // Now works with let
    } catch (error: any) {
      errors.push(`Failed to create "${product.name || 'Unnamed'}": ${error.message}`);
    }
  }

  return { success: successCount, errors };
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
export const updateProductStock = async (productId: string, quantitySold: number): Promise<void> => {
  try {
    const product = await base(PRODUCTS_TABLE).find(productId);
    const currentStock = parseInt(String(product.fields['Stock Quantity'] || 0)) || 0;
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

// ============= USERS =============
const USERS_TABLE = import.meta.env.VITE_AIRTABLE_USERS_TABLE || 'Users';

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  isAdmin: boolean;
  profilePhoto?: string;
  accountCreated: string;
  orderCount?: number;
  totalOrderValue?: string;
  lastOrderDate?: string;
}

const mapAirtableToUser = (record: any): UserProfile => {
  const fields = record.fields;
  return {
    id: record.id,
    userId: fields['User ID'] || '',
    fullName: fields['Full Name'] || '',
    email: fields['Email Address'] || '',
    phoneNumber: fields['Phone Number'] || '',
    isAdmin: fields['Admin Status'] || false,
    profilePhoto: fields['Profile Photo']?.[0]?.url || '',
    accountCreated: fields['Account Created'] || new Date().toISOString(),
    orderCount: fields['Order Count'] || 0,
    totalOrderValue: fields['Total Order Value'] || '0',
    lastOrderDate: fields['Last Order Date'] || '',
  };
};

// Fetch user by email
export const fetchUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const records = await base(USERS_TABLE)
      .select({
        filterByFormula: `{Email Address} = '${email}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;
    return mapAirtableToUser(records[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  id: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const fields: any = {};
    
    if (updates.fullName) fields['Full Name'] = updates.fullName;
    if (updates.phoneNumber !== undefined) fields['Phone Number'] = updates.phoneNumber;
    if (updates.profilePhoto) fields['Profile Photo'] = [{ url: updates.profilePhoto }];

    const record = await base(USERS_TABLE).update(id, fields, { typecast: true });
    return mapAirtableToUser(record);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update profile');
  }
};

export const createUser = async (userData: { email: string; fullName: string; phoneNumber?: string; isAdmin?: boolean }): Promise<UserProfile> => {
  try {
    const record = await base(USERS_TABLE).create(
      {
        'User ID': `user-${Date.now()}`, // Simple unique ID
        'Full Name': userData.fullName,
        'Email Address': userData.email,
        'Phone Number': userData.phoneNumber || '',
        'Admin Status': userData.isAdmin || false,
        'Account Created': new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
      { typecast: true }
    );

    return mapAirtableToUser(record);
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

// Fetch orders by customer email
export const fetchOrdersByEmail = async (email: string): Promise<Order[]> => {
  try {
    const records = await base(ORDERS_TABLE)
      .select({
        filterByFormula: `{Customer Email} = '${email}'`,
        sort: [{ field: 'Order Date', direction: 'desc' }],
      })
      .all();

    return records.map(mapAirtableToOrder);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// ============= LENS OPTIONS =============
const LENS_OPTIONS_TABLE = import.meta.env.VITE_AIRTABLE_LENS_OPTIONS_TABLE || 'Lens Options';

export interface LensOption {
  id: string;
  name: string;
  type: 'single-vision' | 'bifocal' | 'progressive';
  price: number;
  description: string;
  isActive: boolean;
}

const mapAirtableToLensOption = (record: any): LensOption => {
  const fields = record.fields;
  return {
    id: record.id,
    name: fields['Name'] || '',
    type: fields['Type'] || 'single-vision',
    price: parseFloat(fields['Price']) || 0,
    description: fields['Description'] || '',
    isActive: fields['IsActive'] !== false,
  };
};

// Fetch all active lens options
export const fetchLensOptions = async (): Promise<LensOption[]> => {
  try {
    const records = await base(LENS_OPTIONS_TABLE)
      .select({
        filterByFormula: '{IsActive} = TRUE()',
        sort: [{ field: 'Price', direction: 'asc' }],
      })
      .all();

    return records.map(mapAirtableToLensOption);
  } catch (error) {
    console.error('Error fetching lens options:', error);
    throw new Error('Failed to fetch lens options');
  }
};

// Create lens option (admin)
export const createLensOption = async (data: Partial<LensOption>): Promise<LensOption> => {
  try {
    const record = await base(LENS_OPTIONS_TABLE).create(
      {
        'Name': data.name,
        'Type': data.type,
        'Price': data.price,
        'Description': data.description,
        'IsActive': data.isActive !== false,
      },
      { typecast: true }
    );
    return mapAirtableToLensOption(record);
  } catch (error) {
    console.error('Error creating lens option:', error);
    throw new Error('Failed to create lens option');
  }
};

// Update lens option
export const updateLensOption = async (id: string, updates: Partial<LensOption>): Promise<LensOption> => {
  try {
    const fields: any = {};
    if (updates.name) fields['Name'] = updates.name;
    if (updates.type) fields['Type'] = updates.type;
    if (updates.price !== undefined) fields['Price'] = updates.price;
    if (updates.description) fields['Description'] = updates.description;
    if (updates.isActive !== undefined) fields['IsActive'] = updates.isActive;

    const record = await base(LENS_OPTIONS_TABLE).update(id, fields, { typecast: true });
    return mapAirtableToLensOption(record);
  } catch (error) {
    console.error('Error updating lens option:', error);
    throw new Error('Failed to update lens option');
  }
};

// Delete lens option
export const deleteLensOption = async (id: string): Promise<void> => {
  try {
    await base(LENS_OPTIONS_TABLE).destroy(id);
  } catch (error) {
    console.error('Error deleting lens option:', error);
    throw new Error('Failed to delete lens option');
  }
};

// ============= COATING OPTIONS =============
const COATING_OPTIONS_TABLE = import.meta.env.VITE_AIRTABLE_COATING_OPTIONS_TABLE || 'Coating Options';

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
}

const mapAirtableToCoatingOption = (record: any): LensCoating => {
  const fields = record.fields;
  return {
    id: record.id,
    name: fields['Name'] || '',
    price: parseFloat(fields['Price']) || 0,
    description: fields['Description'] || '',
    isActive: fields['IsActive'] !== false,
  };
};

// Fetch all active coating options
export const fetchCoatingOptions = async (): Promise<LensCoating[]> => {
  try {
    const records = await base(COATING_OPTIONS_TABLE)
      .select({
        filterByFormula: '{IsActive} = TRUE()',
        sort: [{ field: 'Price', direction: 'asc' }],
      })
      .all();

    return records.map(mapAirtableToCoatingOption);
  } catch (error) {
    console.error('Error fetching coating options:', error);
    throw new Error('Failed to fetch coating options');
  }
};

// Create coating option (admin)
export const createCoatingOption = async (data: Partial<LensCoating>): Promise<LensCoating> => {
  try {
    const record = await base(COATING_OPTIONS_TABLE).create(
      {
        'Name': data.name,
        'Price': data.price,
        'Description': data.description,
        'IsActive': data.isActive !== false,
      },
      { typecast: true }
    );
    return mapAirtableToCoatingOption(record);
  } catch (error) {
    console.error('Error creating coating option:', error);
    throw new Error('Failed to create coating option');
  }
};

// Update coating option
export const updateCoatingOption = async (id: string, updates: Partial<LensCoating>): Promise<LensCoating> => {
  try {
    const fields: any = {};
    if (updates.name) fields['Name'] = updates.name;
    if (updates.price !== undefined) fields['Price'] = updates.price;
    if (updates.description) fields['Description'] = updates.description;
    if (updates.isActive !== undefined) fields['IsActive'] = updates.isActive;

    const record = await base(COATING_OPTIONS_TABLE).update(id, fields, { typecast: true });
    return mapAirtableToCoatingOption(record);
  } catch (error) {
    console.error('Error updating coating option:', error);
    throw new Error('Failed to update coating option');
  }
};

// Delete coating option
export const deleteCoatingOption = async (id: string): Promise<void> => {
  try {
    await base(COATING_OPTIONS_TABLE).destroy(id);
  } catch (error) {
    console.error('Error deleting coating option:', error);
    throw new Error('Failed to delete coating option');
  }
};

// ============= STORE LOCATIONS =============
const STORE_LOCATIONS_TABLE = import.meta.env.VITE_AIRTABLE_STORE_LOCATIONS_TABLE || 'Store Locations';

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  calendlyUrl: string;
  isActive: boolean;
  createdBy?: string;
}

const mapAirtableToStoreLocation = (record: any): StoreLocation => {
  const fields = record.fields;
  return {
    id: record.id,
    name: fields['Name'] || '',
    address: fields['Address'] || '',
    phone: fields['Phone'] || '',
    hours: fields['Hours'] || '',
    image: fields['Image URL'] || '',
    calendlyUrl: fields['Calendly URL'] || '',
    isActive: fields['IsActive'] !== false,
    createdBy: fields['Created By']?.email || fields['Created By'] || '', // Handle collaborator as email/string
  };
};

// Fetch all active store locations
export const fetchStoreLocations = async (): Promise<StoreLocation[]> => {
  try {
    const records = await base(STORE_LOCATIONS_TABLE)
      .select({
        filterByFormula: '{IsActive} = TRUE()', // Only active locations
        sort: [{ field: 'Name', direction: 'asc' }],
      })
      .all();

    return records.map(mapAirtableToStoreLocation);
  } catch (error) {
    console.error('Error fetching store locations:', error);
    throw new Error('Failed to fetch store locations');
  }
};

// Create store location (admin) - Auto-sets Created By to user email
export const createStoreLocation = async (data: Partial<StoreLocation>): Promise<StoreLocation> => {
  try {
    const record = await base(STORE_LOCATIONS_TABLE).create(
      {
        'Name': data.name,
        'Address': data.address,
        'Phone': data.phone,
        'Hours': data.hours,
        'Image URL': data.image,
        'Calendly URL': data.calendlyUrl,
        'IsActive': data.isActive !== false,
        'Created By': 'eyeoptical007@gmail.com',
      },
      { typecast: true }
    );
    return mapAirtableToStoreLocation(record);
  } catch (error) {
    console.error('Error creating store location:', error);
    throw new Error('Failed to create store location');
  }
};

// Update store location
export const updateStoreLocation = async (id: string, updates: Partial<StoreLocation>): Promise<StoreLocation> => {
  try {
    const fields: any = {};
    if (updates.name) fields['Name'] = updates.name;
    if (updates.address) fields['Address'] = updates.address;
    if (updates.phone) fields['Phone'] = updates.phone;
    if (updates.hours) fields['Hours'] = updates.hours;
    if (updates.image) fields['Image URL'] = updates.image;
    if (updates.calendlyUrl) fields['Calendly URL'] = updates.calendlyUrl;
    if (updates.isActive !== undefined) fields['IsActive'] = updates.isActive;

    const record = await base(STORE_LOCATIONS_TABLE).update(id, fields, { typecast: true });
    return mapAirtableToStoreLocation(record);
  } catch (error) {
    console.error('Error updating store location:', error);
    throw new Error('Failed to update store location');
  }
};

// Delete store location
export const deleteStoreLocation = async (id: string): Promise<void> => {
  try {
    await base(STORE_LOCATIONS_TABLE).destroy(id);
  } catch (error) {
    console.error('Error deleting store location:', error);
    throw new Error('Failed to delete store location');
  }
};