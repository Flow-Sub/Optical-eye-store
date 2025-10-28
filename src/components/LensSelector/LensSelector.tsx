import React, { useState } from 'react';
import { X, Plus, Check, Upload, Camera, FileText, Eye, Info } from 'lucide-react';
import { LensOption, LensCoating, PrescriptionData } from '../../types';
import { lensOptions, coatingOptions } from '../../data/mockData';

interface LensSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lensOption?: LensOption, coatings?: LensCoating[], prescription?: PrescriptionData) => void;
  productName: string;
}

export function LensSelector({ isOpen, onClose, onAdd, productName }: LensSelectorProps) {
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

  if (!isOpen) return null;

  const handleCoatingToggle = (coating: LensCoating) => {
    setSelectedCoatings(prev => {
      const isSelected = prev.some(c => c.id === coating.id);
      if (isSelected) {
        return prev.filter(c => c.id !== coating.id);
      } else {
        return [...prev, coating];
      }
    });
  };

  const calculateTotal = () => {
    const lensPrice = selectedLens?.price || 0;
    const coatingsPrice = selectedCoatings.reduce((sum, coating) => sum + coating.price, 0);
    return lensPrice + coatingsPrice;
  };

  const handleAddToCart = () => {
    onAdd(selectedLens || undefined, selectedCoatings, showPrescriptionForm ? prescription : undefined);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Customize Your Lenses</h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>for {productName}</span>
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
              >
                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-240px)] custom-scrollbar">
          <div className="p-8 space-y-10">
            
            {/* Lens Type Selection */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Choose Lens Type</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {lensOptions.map((lens) => (
                  <div
                    key={lens.id}
                    className={`group relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedLens?.id === lens.id
                        ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                    }`}
                    onClick={() => setSelectedLens(lens)}
                  >
                    {/* Image Placeholder */}
                    <div className="h-36 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye className="h-16 w-16 text-gray-300" />
                      </div>
                      <img
                      src={lens.type === 'single-vision' 
                        ? 'data:image/webp;base64,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'
                        : lens.type === 'bifocal'
                        ? 'https://th.bing.com/th/id/OIP.Gtu87KqLMkNDK-UnvnUkbwHaFj?w=209&h=180&c=7&r=0&o=7&pid=1.7&rm=3'
                        : 'https://tse2.mm.bing.net/th/id/OIP.UbQ40UCtDBIDGctfTZDk9gHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'
                      }
                      alt={lens.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                    />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{lens.name}</h4>
                        <span className="text-lg font-bold text-blue-600 whitespace-nowrap">+${lens.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{lens.description}</p>
                      
                      {selectedLens?.id === lens.id && (
                        <div className="flex items-center gap-2 text-blue-600 pt-2 border-t border-blue-200">
                          <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                      selectedLens?.id === lens.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lens Coatings */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Add Premium Coatings</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Optional</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {coatingOptions.map((coating) => (
                  <div
                    key={coating.id}
                    className={`group relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                      selectedCoatings.some(c => c.id === coating.id)
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'
                    }`}
                    onClick={() => handleCoatingToggle(coating)}
                  >
                    {/* Image Placeholder */}
                    <div className="h-32 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/50"></div>
                      </div>
                      <img
                      src={coating.id === 'ar' 
                        ? 'https://i.ibb.co/prbvM3wS/Gemini-Generated-Image-n3g4qrn3g4qrn3g4.png'
                        : coating.id === 'bl'
                        ? 'https://i.ibb.co/842bm09X/Gemini-Generated-Image-n3g4qrn3g4qrn3g4-1.png'
                        : coating.id === 'uv'
                        ? 'https://i.ibb.co/p6N9CRhR/Gemini-Generated-Image-n3g4qrn3g4qrn3g4-3.png'
                        : 'https://i.ibb.co/Q7XQQD18/Gemini-Generated-Image-n3g4qrn3g4qrn3g4-2.png'
                      }
                      alt={coating.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                    />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900">{coating.name}</h4>
                        <span className="text-lg font-bold text-green-600 whitespace-nowrap">+${coating.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{coating.description}</p>
                      
                      {selectedCoatings.some(c => c.id === coating.id) && (
                        <div className="flex items-center gap-2 text-green-600 pt-2 border-t border-green-200">
                          <div className="h-5 w-5 bg-green-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm font-medium">Added</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Prescription Details</h3>
              </div>

              {/* Prescription Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setPrescriptionMethod('manual');
                    setShowPrescriptionForm(true);
                  }}
                  className={`group p-6 border-2 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                    prescriptionMethod === 'manual'
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`h-14 w-14 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                    prescriptionMethod === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <FileText className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Enter Manually</h4>
                  <p className="text-sm text-gray-600">Type in your prescription details</p>
                </button>

                <button
                  onClick={() => {
                    setPrescriptionMethod('upload');
                    setShowPrescriptionForm(false);
                  }}
                  className={`group p-6 border-2 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                    prescriptionMethod === 'upload'
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`h-14 w-14 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                    prescriptionMethod === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <Upload className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Upload Photo</h4>
                  <p className="text-sm text-gray-600">Take a photo of your prescription</p>
                </button>

                <button
                  onClick={() => {
                    setPrescriptionMethod('later');
                    setShowPrescriptionForm(false);
                  }}
                  className={`group p-6 border-2 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                    prescriptionMethod === 'later'
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`h-14 w-14 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                    prescriptionMethod === 'later'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <Camera className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Add Later</h4>
                  <p className="text-sm text-gray-600">We'll contact you for details</p>
                </button>
              </div>

              {/* Upload Interface */}
              {prescriptionMethod === 'upload' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-white/50 transition-all group"
                  >
                    <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium mb-1">
                      {uploadedFile ? uploadedFile.name : 'Click to upload prescription image'}
                    </span>
                    <span className="text-sm text-gray-500">PNG, JPG or PDF up to 10MB</span>
                  </label>
                  {uploadedFile && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <div className="h-5 w-5 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-medium">File uploaded successfully</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Entry Form */}
              {showPrescriptionForm && prescriptionMethod === 'manual' && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border-2 border-gray-200 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Right Eye */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">Right Eye (OD)</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sphere (SPH)</label>
                          <input
                            type="text"
                            value={prescription.rightEye.sphere}
                            onChange={(e) => setPrescription(prev => ({
                              ...prev,
                              rightEye: { ...prev.rightEye, sphere: e.target.value }
                            }))}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., -2.50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cylinder (CYL)</label>
                          <input
                            type="text"
                            value={prescription.rightEye.cylinder}
                            onChange={(e) => setPrescription(prev => ({
                              ...prev,
                              rightEye: { ...prev.rightEye, cylinder: e.target.value }
                            }))}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., -1.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Axis</label>
                          <input
                            type="text"
                            value={prescription.rightEye.axis}
                            onChange={(e) => setPrescription(prev => ({
                              ...prev,
                              rightEye: { ...prev.rightEye, axis: e.target.value }
                            }))}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., 90"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Left Eye */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">Left Eye (OS)</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sphere (SPH)</label>
                          <input
                            type="text"
                            value={prescription.leftEye.sphere}
                            onChange={(e) => setPrescription(prev => ({
                              ...prev,
                              leftEye: { ...prev.leftEye, sphere: e.target.value }
                            }))}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., -2.50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cylinder (CYL)</label>
                          <input
                            type="text"
                            value={prescription.leftEye.cylinder}
                            onChange={(e) => setPrescription(prev => ({
                              ...prev,
                              leftEye: { ...prev.leftEye, cylinder: e.target.value }
                            }))}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., -1.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Axis</label>
                          <input
                            type="text"
                            value={prescription.leftEye.axis}
                            onChange={(e) => setPrescription(prev => ({
                              ...prev,
                              leftEye: { ...prev.leftEye, axis: e.target.value }
                            }))}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., 90"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pupillary Distance (PD)</label>
                    <input
                      type="text"
                      value={prescription.pd}
                      onChange={(e) => setPrescription(prev => ({ ...prev, pd: e.target.value }))}
                      className="block w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 63"
                    />
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={prescription.notes || ''}
                      onChange={(e) => setPrescription(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>
              )}

              {/* Later Option Info */}
              {prescriptionMethod === 'later' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Info className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">We'll Help You!</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        No problem! Our team will contact you within 24 hours to collect your prescription details. 
                        You can also email us a photo of your prescription at{' '}
                        <a href="mailto:prescriptions@opticalstore.com" className="text-blue-600 font-medium hover:underline">
                          prescriptions@opticalstore.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg">Lens total:</span>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg">
                <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedLens || (prescriptionMethod === 'upload' && !uploadedFile)}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                <Plus className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .bg-grid-white\/10 {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`}</style>
    </div>
  );
}