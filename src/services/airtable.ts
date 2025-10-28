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