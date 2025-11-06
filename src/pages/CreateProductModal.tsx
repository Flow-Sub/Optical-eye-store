import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  X, 
  Plus, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  RefreshCw,
  Package,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Hash,
  CheckSquare,
  Square,
  Sparkles // Added for features label
} from 'lucide-react';
import { Product } from '../types';
import { createProduct, batchCreateProducts } from '../services/airtable';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);

  // Separate state for form inputs (comma-separated strings)
  const [featuresInput, setFeaturesInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');

  // Single Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'frames',
    price: 0,
    description: '',
    stock: 0,
    lensCompatible: false,
    features: [],
    images: ['https://via.placeholder.com/500'],
    isActive: true
  });

  // Bulk Import State
  const [step, setStep] = useState<'upload' | 'review' | 'importing' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<{ valid: Partial<Product>[]; invalid: { row: Partial<Product>; error: string }[] }>({
    valid: [],
    invalid: []
  });
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] }>({ success: 0, errors: [] });
  const [uploading, setUploading] = useState(false);

  // Single Product: Handle Form Submit
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || (formData.price ?? 0) <= 0) { // Fixed: ?? for undefined
      alert('Please fill required fields (Name, Brand, Price).');
      return;
    }
    setLoading(true);
    try {
      // Parse features from comma-separated input
      const features = featuresInput ? featuresInput.split(',').map((f: string) => f.trim()).filter(Boolean) : [];
      // Parse images from comma-separated input
      const images = imagesInput ? imagesInput.split(',').map((url: string) => url.trim()).filter(Boolean) : ['https://via.placeholder.com/500'];
      
      await createProduct({ ...formData, features, images });
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Single: Update Form Data Helper
  const updateFormData = <K extends keyof Partial<Product>>(key: K, value: Partial<Product>[K]) => { // Fixed: Generic for better typing
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Bulk: Download Template
  const downloadTemplate = () => {
    const csvContent = `Product Name,Brand,Category,Price,Description,Stock Quantity,Lens Compatible,Features,Images
Classic Black Frame,Ray-Ban,frames,89.99,A timeless design for everyday wear,50,Yes,Lightweight,UV Protection,Anti-Scratch,https://example.com/black-frame1.jpg,https://example.com/black-frame2.jpg
Aviator Sunglasses,Prada,sunglasses,129.99,Iconic pilot style with polarized lenses,25,No,Polarized,Metal Frame,https://example.com/aviator1.jpg`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Bulk: Handle File Upload & Parse
  const handleFileUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);

    Papa.parse(selectedFile, {
      header: true, // Skips row 1 (headers)
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const dataRows = results.data;
        const valid: Partial<Product>[] = [];
        const invalid: { row: Partial<Product>; error: string }[] = [];

        dataRows.forEach((row: Record<string, string>, index: number) => { // Fixed: Typed row & index
          const rowNum = index + 2;
          const product: Partial<Product> = {
            name: row['Product Name']?.trim() || '',
            brand: row['Brand']?.trim() || '',
            category: (row['Category']?.trim()?.toLowerCase() === 'sunglasses' || row['Category']?.trim()?.toLowerCase() === 'accessories' ? row['Category']?.trim()?.toLowerCase() : 'frames') as 'frames' | 'sunglasses' | 'accessories',
            price: parseFloat(row['Price'] ?? '0') || 0, // Fixed: ?? for undefined
            description: row['Description']?.trim() || '',
            stock: parseInt(row['Stock Quantity'] ?? '0') || 0, // Fixed: ?? for undefined
            lensCompatible: row['Lens Compatible']?.trim().toLowerCase() === 'yes',
            features: row['Features'] 
              ? row['Features'].split(',').map((f: string) => f.trim()).filter(Boolean) // Fixed: Typed param
              : [],
            images: row['Images'] 
              ? row['Images'].split(',').map((url: string) => url.trim()).filter(Boolean) // Fixed: Typed param
              : ['https://via.placeholder.com/500'],
            isActive: true
          };

          const errors: string[] = [];
          if (!product.name) errors.push('Missing Product Name');
          if (!product.brand) errors.push('Missing Brand');
          if (!product.category) errors.push('Missing Category');
          if ((product.price ?? 0) <= 0) errors.push('Invalid Price'); // Fixed: ?? 
          if ((product.stock ?? 0) < 0) errors.push('Invalid Stock Quantity'); // Fixed: ??
          if (!product.images || product.images.length === 0 || !(product.images[0]?.startsWith('http'))) { // Fixed: ?.
            errors.push('Missing or invalid Images (comma-separated URLs required)');
          }

          if (errors.length > 0) {
            invalid.push({ row: product, error: `Row ${rowNum}: ${errors.join(', ')}` });
          } else {
            valid.push(product);
          }
        });

        setParsedData({ valid, invalid });
        setStep('review');
        setUploading(false);
      },
      error: () => {
        alert('Failed to parse CSV. Please check the file format.');
        setUploading(false);
      }
    });
  };

  // Bulk: Handle Import
  const handleBulkImport = async () => {
    if (parsedData.valid.length === 0) return;

    setStep('importing');
    setUploading(true);

    try {
      const result = await batchCreateProducts(parsedData.valid);
      setImportResult(result);
      setStep('complete');
      onSuccess(); // Refetch
    } catch (error) {
      setImportResult({ success: 0, errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`] });
      setStep('complete');
    } finally {
      setUploading(false);
    }
  };

  // Bulk: Reset
  const resetBulk = () => {
    setFile(null);
    setParsedData({ valid: [], invalid: [] });
    setImportResult({ success: 0, errors: [] });
    setStep('upload');
  };

  // Close & Reset
  const handleClose = () => {
    resetBulk();
    setFormData({
      name: '',
      brand: '',
      category: 'frames',
      price: 0,
      description: '',
      stock: 0,
      lensCompatible: false,
      features: [],
      images: ['https://via.placeholder.com/500'],
      isActive: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add Products</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 px-6 -mb-px">
            <button
              onClick={() => setActiveTab('single')}
              className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'single'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Single Product
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'bulk'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bulk Import (CSV)
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'single' && (
            // Full Single Product Form
            <form onSubmit={handleSingleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4" />
                  <span>Product Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name ?? ''} // Fixed: ?? default
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., Classic Black Frame"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4" />
                  <span>Brand</span>
                </label>
                <input
                  type="text"
                  value={formData.brand ?? ''} // Fixed: ?? default
                  onChange={(e) => updateFormData('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., Ray-Ban"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4" />
                  <span>Category</span>
                </label>
                <select
                  value={formData.category ?? 'frames'} // Fixed: ?? default
                  onChange={(e) => updateFormData('category', e.target.value as 'frames' | 'sunglasses' | 'accessories')} // Fixed: Type assertion
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                >
                  <option value="frames">Frames</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price ?? 0} // Fixed: ?? default
                  onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., 89.99"
                  min="0"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description ?? ''} // Fixed: ?? default
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4" />
                  <span>Stock Quantity</span>
                </label>
                <input
                  type="number"
                  value={formData.stock ?? 0} // Fixed: ?? default
                  onChange={(e) => updateFormData('stock', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., 50"
                  min="0"
                />
              </div>

              {/* Lens Compatible */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <CheckSquare className={`h-4 w-4 ${(formData.lensCompatible ?? false) ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>Lens Compatible</span>
                </label>
                <input
                  type="checkbox"
                  checked={formData.lensCompatible ?? false} // Fixed: ?? default
                  onChange={(e) => updateFormData('lensCompatible', e.target.checked)}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
              </div>

              {/* Features */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Features (comma-separated)</span>
                </label>
                <textarea
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., Lightweight, UV Protection, Anti-Scratch"
                  rows={2}
                />
              </div>

              {/* Images */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Images (comma-separated URLs)</span>
                </label>
                <input
                  type="text"
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">First URL is the primary image. Fallback to placeholder if empty.</p>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <CheckSquare className={`h-4 w-4 ${(formData.isActive ?? true) ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>Active</span>
                </label>
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true} // Fixed: ?? default
                  onChange={(e) => updateFormData('isActive', e.target.checked)}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-light disabled:opacity-50 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{loading ? 'Creating...' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-6">
              {step === 'upload' && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Your CSV File</h4>
                    <p className="text-gray-600 font-light">Prepare your products in the required format and upload below.</p>
                  </div>
                  <div className="flex flex-col items-center space-y-3">
                    <label className="flex items-center justify-center w-full max-w-md px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mr-2" />
                      <span className="text-sm font-light text-gray-600">
                        {file ? file.name : 'Click to select CSV file or drag & drop'}
                      </span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files![0])} // Fixed: Non-null assertion for safety
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-light border border-gray-300 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Template</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <p>Required columns: Product Name, Brand, Category, Price, Stock Quantity, Images (comma-separated URLs)</p>
                    <p>Optional: Description, Lens Compatible (Yes/No), Features (comma-separated)</p>
                  </div>
                </div>
              )}

              {step === 'review' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Preview Data</h4>
                    <div className="text-sm text-gray-600">
                      {parsedData.valid.length} valid | {parsedData.invalid.length} errors
                    </div>
                  </div>
                  {/* Valid Table */}
                  {parsedData.valid.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 mb-2 flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Valid Products ({parsedData.valid.length})</span>
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-green-100">
                            <tr>
                              <th className="px-3 py-2 text-left">Name</th>
                              <th className="px-3 py-2 text-left">Brand</th>
                              <th className="px-3 py-2 text-left">Price</th>
                              <th className="px-3 py-2 text-left">Stock</th>
                              <th className="px-3 py-2 text-left">Images</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.valid.slice(0, 5).map((product: Partial<Product>, i: number) => ( // Fixed: Typed params
                              <tr key={i} className="border-t border-green-200">
                                <td className="px-3 py-2">{product.name ?? 'Unnamed'}</td> {/* Fixed: ?? */}
                                <td className="px-3 py-2">{product.brand ?? 'No Brand'}</td> {/* Fixed: ?? */}
                                <td className="px-3 py-2">${(product.price ?? 0).toFixed(2)}</td> {/* Fixed: ?? & toFixed */}
                                <td className="px-3 py-2">{product.stock ?? 0}</td> {/* Fixed: ?? */}
                                <td className="px-3 py-2">
                                  <Eye className="h-3 w-3 inline mr-1" />
                                  {product.images?.length ?? 0} images {/* Fixed: ?. & ?? */}
                                </td>
                              </tr>
                            ))}
                            {parsedData.valid.length > 5 && (
                              <tr>
                                <td colSpan={5} className="px-3 py-2 text-center text-sm text-green-600">
                                  ... and {parsedData.valid.length - 5} more
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Invalid List */}
                  {parsedData.invalid.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <h5 className="font-medium text-red-800 mb-2 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Errors ({parsedData.invalid.length})</span>
                      </h5>
                      <div className="space-y-2">
                        {parsedData.invalid.map((item: { row: Partial<Product>; error: string }, i: number) => ( // Fixed: Typed params
                          <div key={i} className="flex items-start space-x-2 p-2 bg-red-100 rounded">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium">{item.row.name ?? 'Unnamed'}</p> {/* Fixed: ?? */}
                              <p className="text-red-700">{item.error}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setStep('upload')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-light"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBulkImport}
                      disabled={parsedData.valid.length === 0 || uploading}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-light disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Import {parsedData.valid.length} Products</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 'importing' && (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span>Importing {parsedData.valid.length} products...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              )}

              {step === 'complete' && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Import Complete!</h4>
                    <p className="text-gray-600 font-light">
                      Successfully imported {importResult.success} products.
                      {importResult.errors.length > 0 && ` ${importResult.errors.length} errors occurred.`}
                    </p>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 text-sm text-red-700">
                      <p className="font-medium mb-1">Errors:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        {importResult.errors.map((err: string, i: number) => ( // Fixed: Typed params
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-center space-x-3 pt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-light"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => setStep('upload')}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-light flex items-center space-x-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Import More</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}