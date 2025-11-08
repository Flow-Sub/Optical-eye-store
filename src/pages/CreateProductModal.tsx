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
  Shield,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { createProduct, batchCreateProducts } from '../services/airtable';
import { useLensOptions } from '../hooks/useLensOptions';
import { useCoatingOptions } from '../hooks/useCoatingOptions';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  
  // Lens and Coating selections
  const [selectedLensOptions, setSelectedLensOptions] = useState<string[]>([]);
  const [selectedCoatingOptions, setSelectedCoatingOptions] = useState<string[]>([]);

  // Separate state for form inputs (comma-separated strings)
  const [featuresInput, setFeaturesInput] = useState('');

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Single Product Form State
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
    images: uploadedImages,  // ✅ FIXED: Start with uploaded (empty initially, fills during upload)
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

  // Load lens and coating options
  const { lensOptions, loading: lensLoading } = useLensOptions();
  const { coatingOptions, loading: coatingLoading } = useCoatingOptions();

  // Single Product: Handle Form Submit
  // Single Product: Handle Form Submit
const handleSingleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.brand || (formData.price ?? 0) <= 0) {
    alert('Please fill required fields (Name, Brand, Price).');
    return;
  }
  setLoading(true);
  try {
    // Parse features from comma-separated input
    const features = featuresInput ? featuresInput.split(',').map((f: string) => f.trim()).filter(Boolean) : [];
    // ✅ FIXED: Use formData.images directly (populated during upload, no placeholder fallback)
    const images = formData.images || [];  // Empty if no uploads (let Airtable handle default)
    
    // Create product with lens and coating options
    await createProduct({ 
      ...formData, 
      features, 
      images,  // Now always real URLs (or empty)
      allowedLensOptions: selectedLensOptions,
      allowedCoatingOptions: selectedCoatingOptions
    });
    
    onSuccess();
    onClose();
  } catch (error) {
    alert('Failed to create product. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Single: Update Form Data Helper
  const updateFormData = <K extends keyof Partial<Product>>(key: K, value: Partial<Product>[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Bulk: Download Template
  const downloadTemplate = () => {
    const csvContent = `Product Name,Brand,Category,Price,Description,Stock Quantity,Lens Compatible,Features,Images,Allowed Lens Options,Allowed Coating Options
  Classic Black Frame,Ray-Ban,frames,89.99,A timeless design for everyday wear,50,Yes,"Lightweight,UV Protection,Anti-Scratch","https://example.com/black-frame1.jpg,https://example.com/black-frame2.jpg",rec123abc|rec456def,recAAA111|recBBB222
  Aviator Sunglasses,Prada,sunglasses,129.99,Iconic pilot style with polarized lenses,25,No,"Polarized,Metal Frame",https://example.com/aviator1.jpg,,
  Round Vintage Frames,Gucci,frames,199.99,Retro-inspired round frames,30,Yes,"Acetate Frame,Spring Hinges",https://example.com/round1.jpg,rec123abc,recAAA111|recBBB222`;
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
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const dataRows = results.data;
        const valid: Partial<Product>[] = [];
        const invalid: { row: Partial<Product>; error: string }[] = [];

        dataRows.forEach((row: Record<string, string>, index: number) => {
        const rowNum = index + 2;
        const product: Partial<Product> = {
          name: row['Product Name']?.trim() || '',
          brand: row['Brand']?.trim() || '',
          category: (row['Category']?.trim()?.toLowerCase() === 'sunglasses' || row['Category']?.trim()?.toLowerCase() === 'accessories' ? row['Category']?.trim()?.toLowerCase() : 'frames') as 'frames' | 'sunglasses' | 'accessories',
          price: parseFloat(row['Price'] ?? '0') || 0,
          description: row['Description']?.trim() || '',
          stock: parseInt(row['Stock Quantity'] ?? '0') || 0,
          lensCompatible: row['Lens Compatible']?.trim().toLowerCase() === 'yes',
          features: row['Features'] 
            ? row['Features'].split(',').map((f: string) => f.trim()).filter(Boolean)
            : [],
          images: row['Images'] 
            ? row['Images'].split(',').map((url: string) => url.trim()).filter(Boolean)
            : [],
          // ✅ NEW: Parse lens options (pipe-separated Airtable record IDs)
          allowedLensOptions: row['Allowed Lens Options']
            ? row['Allowed Lens Options'].split('|').map((id: string) => id.trim()).filter(Boolean)
            : [],
          // ✅ NEW: Parse coating options (pipe-separated Airtable record IDs)
          allowedCoatingOptions: row['Allowed Coating Options']
            ? row['Allowed Coating Options'].split('|').map((id: string) => id.trim()).filter(Boolean)
            : [],
          isActive: true
        };

        const errors: string[] = [];
        if (!product.name) errors.push('Missing Product Name');
        if (!product.brand) errors.push('Missing Brand');
        if (!product.category) errors.push('Missing Category');
        if ((product.price ?? 0) <= 0) errors.push('Invalid Price');
        if ((product.stock ?? 0) < 0) errors.push('Invalid Stock Quantity');
        // ✅ UPDATED: Relaxed image validation (allow empty for placeholder fallback)
        if (row['Images'] && product.images && product.images.length > 0 && !(product.images[0]?.startsWith('http'))) {
          errors.push('Invalid Images (must be comma-separated URLs)');
        }
        // ✅ NEW: Validate lens/coating logic
        if (product.lensCompatible && product.allowedLensOptions && product.allowedLensOptions.length === 0) {
          errors.push('Lens Compatible=Yes but no Allowed Lens Options provided (use pipe-separated IDs like rec123|rec456)');
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
      onSuccess();
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
    setUploadedImages([]);
    setImagePreviews([]);
    setUploadingImages(false);
    setFeaturesInput('');
    setSelectedLensOptions([]);
    setSelectedCoatingOptions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
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
            <form onSubmit={handleSingleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4" />
                  <span>Product Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name ?? ''}
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
                  value={formData.brand ?? ''}
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
                  value={formData.category ?? 'frames'}
                  onChange={(e) => updateFormData('category', e.target.value as 'frames' | 'sunglasses' | 'accessories')}
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
                  value={formData.price ?? 0}
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
                  value={formData.description ?? ''}
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
                  value={formData.stock ?? 0}
                  onChange={(e) => updateFormData('stock', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., 50"
                  min="0"
                />
              </div>

              {/* Lens Compatible */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="lensCompatible"
                  checked={formData.lensCompatible ?? false}
                  onChange={(e) => {
                    updateFormData('lensCompatible', e.target.checked);
                    // Clear selections if unchecked
                    if (!e.target.checked) {
                      setSelectedLensOptions([]);
                      setSelectedCoatingOptions([]);
                    }
                  }}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="lensCompatible" className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <Eye className={`h-4 w-4 ${(formData.lensCompatible ?? false) ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>Lens Compatible</span>
                </label>
              </div>

              {/* Lens Options Selection - Only show if lens compatible */}
              {formData.lensCompatible && (
                <>
                  {/* Allowed Lens Options */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span>Allowed Lens Options</span>
                      <span className="text-xs text-gray-500 font-normal">(Select which lens types customers can choose)</span>
                    </label>
                    
                    {lensLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                      </div>
                    ) : lensOptions.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No lens options available. Please add lens options first.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
                        {lensOptions.map((option) => (
                          <label key={option.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              value={option.id}
                              checked={selectedLensOptions.includes(option.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLensOptions([...selectedLensOptions, option.id]);
                                } else {
                                  setSelectedLensOptions(selectedLensOptions.filter(id => id !== option.id));
                                }
                              }}
                              className="h-4 w-4 text-gray-900 border-gray-300 rounded mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{option.name}</span>
                                <span className="text-sm text-gray-600">${option.price.toFixed(2)}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                              <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                                {option.type}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {selectedLensOptions.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ {selectedLensOptions.length} lens option(s) selected
                      </p>
                    )}
                  </div>

                  {/* Allowed Coating Options */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span>Allowed Coating Options</span>
                      <span className="text-xs text-gray-500 font-normal">(Select which coatings customers can add)</span>
                    </label>
                    
                    {coatingLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                      </div>
                    ) : coatingOptions.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No coating options available. Please add coating options first.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
                        {coatingOptions.map((option) => (
                          <label key={option.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              value={option.id}
                              checked={selectedCoatingOptions.includes(option.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCoatingOptions([...selectedCoatingOptions, option.id]);
                                } else {
                                  setSelectedCoatingOptions(selectedCoatingOptions.filter(id => id !== option.id));
                                }
                              }}
                              className="h-4 w-4 text-gray-900 border-gray-300 rounded mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{option.name}</span>
                                <span className="text-sm text-gray-600">+${option.price.toFixed(2)}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {selectedCoatingOptions.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ {selectedCoatingOptions.length} coating option(s) selected
                      </p>
                    )}
                  </div>
                </>
              )}

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

              {/* Images Upload */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Product Images</span>
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Upload className="h-4 w-4" />
                      <span className="font-light text-sm">
                        {uploadingImages ? 'Uploading...' : 'Choose images'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;

                        setUploadingImages(true);
                        const newUrls: string[] = [];
                        const newPreviews: string[] = [];

                        for (const file of files) {
                          // Create preview
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            newPreviews.push(reader.result as string);
                            setImagePreviews(prev => [...prev, reader.result as string]);
                          };
                          reader.readAsDataURL(file);

                          // Upload to API
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append('image', file);

                            const response = await fetch(`http://134.209.6.174:3000/api/digitalOceanRoutes/uploadImage`, {
                              method: 'POST',
                              body: uploadFormData,
                            });

                            const result = await response.json();

                            if (result.success && result.data?.url) {
                              newUrls.push(result.data.url);
                              // ✅ FIXED: Sync formData immediately after each upload
                              setFormData(prev => ({
                                ...prev,
                                images: [...(prev.images || []), result.data.url]
                              }));
                            } else {
                              alert(`Failed to upload ${file.name}`);
                            }
                          } catch (error) {
                            console.error('Image upload error:', error);
                            alert(`Failed to upload ${file.name}`);
                          }
                        }

                        setUploadedImages(prev => [...prev, ...newUrls]);
                        setUploadingImages(false);
                      }}
                      disabled={uploadingImages}
                      className="hidden"
                    />
                  </label>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreviews(prev => prev.filter((_, i) => i !== index));
                              setUploadedImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    {uploadedImages.length > 0 
                      ? `✅ ${uploadedImages.length} image(s) uploaded successfully`
                      : 'Upload product images (first image will be primary)'}
                  </p>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onChange={(e) => updateFormData('isActive', e.target.checked)}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <CheckSquare className={`h-4 w-4 ${(formData.isActive ?? true) ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>Active</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  disabled={loading || uploadingImages}  // ✅ FIXED: Disable until uploads finish
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-light disabled:opacity-50 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{(loading || uploadingImages) ? 'Processing...' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Bulk Import Tab Content */}
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
                    <p className="mb-1"><strong>Required:</strong> Product Name, Brand, Category, Price, Stock Quantity, Images (comma-separated URLs)</p>
                    <p className="mb-1"><strong>Optional:</strong> Description, Lens Compatible (Yes/No), Features (comma-separated)</p>
                    <p><strong>Lens/Coating IDs:</strong> Use pipe-separated Airtable record IDs (e.g., <code className="bg-gray-200 px-1 rounded">rec123abc|rec456def</code>)</p>
                    <p className="text-amber-600 mt-2">💡 Get record IDs from Admin → Lens Options tab (copy from URL or table)</p>
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