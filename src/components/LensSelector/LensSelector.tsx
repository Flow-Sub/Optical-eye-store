/* src/components/LensSelector/LensSelector.tsx */
import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Upload, Camera, FileText, Eye, Info, ChevronLeft } from 'lucide-react';
import { LensOption, LensCoating, PrescriptionData, Product } from '../../types';
import { useProductLensOptions } from '../../hooks/useProductLensOptions';
import { formatCurrency } from '../../lib/currency';

interface LensSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lensOption?: LensOption, coatings?: LensCoating[], prescription?: PrescriptionData) => void;
  productName: string;
  product: Product;  // Pass the full product
}

export function LensSelector({ isOpen, onClose, onAdd, productName, product }: LensSelectorProps) {
  // Use product-specific lens options
  const { 
    lensOptions, 
    coatingOptions, 
    loading 
  } = useProductLensOptions(
    product.allowedLensOptions, 
    product.allowedCoatingOptions
  );

  const [selectedLens, setSelectedLens] = useState<LensOption | null>(null);
  const [selectedCoatings, setSelectedCoatings] = useState<LensCoating[]>([]);
  const [prescription, setPrescription] = useState<PrescriptionData>({
    rightEye: { sphere: '', cylinder: '', axis: '' },
    leftEye: { sphere: '', cylinder: '', axis: '' },
    pd: '',
    notes: ''
  });
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionMethod, setPrescriptionMethod] = useState<'manual' | 'upload' | 'later'>('manual');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleCoatingToggle = (coating: LensCoating) => {
    setSelectedCoatings(prev =>
      prev.some(c => c.id === coating.id)
        ? prev.filter(c => c.id !== coating.id)
        : [...prev, coating]
    );
  };

  const calculateTotal = () => {
    const lensPrice = selectedLens?.price || 0;
    const coatingsPrice = selectedCoatings.reduce((sum, c) => sum + c.price, 0);
    return lensPrice + coatingsPrice;
  };

  const handleAddToCart = () => {
    onAdd(selectedLens || undefined, selectedCoatings, showPrescriptionForm ? prescription : undefined);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  if (!isOpen) return null;

  // If product doesn't support lenses at all
  if (!product.lensCompatible) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lenses Not Available
            </h3>
            <p className="text-gray-600 mb-4">
              This product doesn't support prescription lenses.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p>Loading options...</p>;
  }

  return (
    <>
      {/* Overlay (mobile only) */}
      <div
        className="fixed inset-0 bg-black/50 lg:hidden z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:max-w-md lg:shadow-2xl
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl font-light text-gray-900">Customize Lenses</h2>
              <p className="text-sm text-gray-600 mt-1">for {productName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-full pb-32">
          <div className="p-6 space-y-10">

            {/* Lens Type */}
            <div>
              <h3 className="text-lg font-light text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-gray-700" />
                Choose Lens Type
              </h3>
              <div className="space-y-4">
                {lensOptions.map((lens) => (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={`
                      border rounded-lg p-5 cursor-pointer transition-all
                      ${selectedLens?.id === lens.id
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-300 hover:border-gray-500 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-light text-gray-900">{lens.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{lens.description}</p>
                      </div>
                      <span className="text-lg font-light text-gray-900">+{formatCurrency(lens.price)}</span>
                    </div>
                    {selectedLens?.id === lens.id && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <div className="h-5 w-5 bg-gray-900 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-light">Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Coatings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-gray-900 flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  Add Coatings
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {coatingOptions.map((coating) => (
                  <div
                    key={coating.id}
                    onClick={() => handleCoatingToggle(coating)}
                    className={`
                      border rounded-lg p-5 cursor-pointer transition-all
                      ${selectedCoatings.some(c => c.id === coating.id)
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-300 hover:border-gray-500'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-light text-gray-900">{coating.name}</h4>
                      <span className="text-lg font-light text-gray-900">+{formatCurrency(coating.price)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{coating.description}</p>
                    {selectedCoatings.some(c => c.id === coating.id) && (
                      <div className="flex items-center gap-2 text-gray-900 mt-3">
                        <div className="h-5 w-5 bg-gray-900 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-light">Added</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription */}
            <div>
              <h3 className="text-lg font-light text-gray-900 mb-4">Prescription</h3>

              {/* Method Buttons */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {[
                  { id: 'manual', icon: FileText, label: 'Enter Manually' },
                  { id: 'upload', icon: Upload, label: 'Upload Photo' },
                  { id: 'later', icon: Camera, label: 'Add Later' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPrescriptionMethod(method.id as any);
                      setShowPrescriptionForm(method.id === 'manual');
                    }}
                    className={`
                      p-4 border rounded-lg text-left transition-all
                      ${prescriptionMethod === method.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-500'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="h-5 w-5 text-gray-700" />
                      <span className="font-light text-gray-900">{method.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Upload */}
              {prescriptionMethod === 'upload' && (
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="upload"
                  />
                  <label
                    htmlFor="upload"
                    className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-500 mb-2" />
                    <span className="text-sm font-light text-gray-700">
                      {uploadedFile ? uploadedFile.name : 'Click to upload'}
                    </span>
                  </label>
                </div>
              )}

              {/* Manual Form */}
              {showPrescriptionForm && prescriptionMethod === 'manual' && (
                <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(['rightEye', 'leftEye'] as const).map((eye) => (
                      <div key={eye} className="bg-white p-5 rounded-lg shadow-sm">
                        <h4 className="font-light text-gray-900 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-gray-700" />
                          {eye === 'rightEye' ? 'Right Eye (OD)' : 'Left Eye (OS)'}
                        </h4>
                        {['sphere', 'cylinder', 'axis'].map((field) => (
                          <div key={field} className="mb-4">
                            <label className="block text-xs font-light text-gray-600 mb-1 uppercase tracking-wider">
                              {field === 'sphere' ? 'SPH' : field === 'cylinder' ? 'CYL' : 'Axis'}
                            </label>
                            <input
                              type="text"
                              value={prescription[eye][field as keyof typeof prescription.rightEye]}
                              onChange={(e) => setPrescription(prev => ({
                                ...prev,
                                [eye]: { ...prev[eye], [field]: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:border-gray-900"
                              placeholder={field === 'axis' ? '0–180' : '-10.00'}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-light text-gray-600 mb-1 uppercase tracking-wider">PD</label>
                      <input
                        type="text"
                        value={prescription.pd}
                        onChange={(e) => setPrescription(prev => ({ ...prev, pd: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:border-gray-900"
                        placeholder="63"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-600 mb-1 uppercase tracking-wider">Notes</label>
                      <textarea
                        value={prescription.notes}
                        onChange={(e) => setPrescription(prev => ({ ...prev, notes: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:border-gray-900 resize-none"
                        placeholder="Any special instructions..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Later Info */}
              {prescriptionMethod === 'later' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-light text-gray-700">
                      We'll contact you within 24 hours to get your prescription. Or email it to{' '}
                      <a href="mailto:prescriptions@Optieye Care.com" className="text-blue-600 hover:underline">
                        prescriptions@Optieye Care.com
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-sm text-gray-600">Lens total:</span>
              <span className="ml-2 text-xl font-light text-gray-900">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-light hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedLens || (prescriptionMethod === 'upload' && !uploadedFile)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-light hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}