import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, AlertCircle, ArrowLeft, Share2, Check, Zap } from 'lucide-react';
import { fetchProductById } from '../services/airtable';
import { useCart } from '../contexts/CartContext';
import { LensSelector } from '../components/LensSelector/LensSelector';
import { LensOption, LensCoating, PrescriptionData, Product } from '../types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLensSelectorOpen, setIsLensSelectorOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <ShoppingCart className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Product</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 inline-flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Products</span>
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (lensOption?: LensOption, coatings?: LensCoating[], prescription?: PrescriptionData) => {
    addToCart(product, 1, lensOption, coatings, prescription);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDirectAdd = () => {
    if (product.lensCompatible) {
      setIsLensSelectorOpen(true);
    } else {
      addToCart(product);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 animate-slide-in">
          <Check className="h-6 w-6" />
          <span className="font-semibold">Added to cart successfully!</span>
        </div>
      )}

      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Products</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-800" />
                    </button>
                  </>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span>Only {product.stock} left!</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                        index === selectedImageIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-3 rounded-full hover:bg-red-50 transition-colors group"
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'} transition-colors`} />
                  </button>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-xl text-gray-600 font-medium">{product.brand}</p>
                
                <div className="flex items-center mt-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-3 font-medium">(24 reviews)</span>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.lensCompatible && (
                      <span className="text-gray-500 text-lg">+ lens options</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{product.description || 'Premium quality eyewear crafted with precision.'}</p>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-sm font-medium px-4 py-3 rounded-xl border border-blue-100 flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4 text-blue-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-4 border-t border-gray-200 pt-8">
                <button
                  onClick={handleDirectAdd}
                  disabled={product.stock === 0}
                  className={`w-full py-5 px-8 rounded-xl font-bold text-lg transition-all transform shadow-lg ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
                  } flex items-center justify-center space-x-3`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>
                    {product.lensCompatible 
                      ? 'Customize & Add to Cart' 
                      : product.stock === 0 
                        ? 'Out of Stock' 
                        : 'Add to Cart'
                    }
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-4 px-6 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </button>
                  <button className="py-4 px-6 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-4 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $150</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <RotateCcw className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">90-Day Returns</p>
                    <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2-Year Warranty</p>
                    <p className="text-sm text-gray-600">Premium protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lens Selector Modal */}
      <LensSelector
        isOpen={isLensSelectorOpen}
        onClose={() => setIsLensSelectorOpen(false)}
        onAdd={handleAddToCart}
        productName={product.name}
      />
    </div>
  );
}