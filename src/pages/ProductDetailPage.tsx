/* src/pages/ProductDetailPage.tsx */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, AlertCircle, ArrowLeft,
  Share2, Check, Zap
} from 'lucide-react';
import { fetchProductById } from '../services/airtable';
import { useCart } from '../contexts/CartContext';
import { LensSelector } from '../components/LensSelector/LensSelector';
import { LensOption, LensCoating, PrescriptionData, Product } from '../types';
import { formatCurrency } from '../lib/currency';

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
  const [showSuccess, setShowSuccess] = useState(false);

  /* ────────────────────── FETCH PRODUCT ────────────────────── */
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ────────────────────── HANDLERS ────────────────────── */
  const handleAddToCart = (lens?: LensOption, coatings?: LensCoating[], prescription?: PrescriptionData) => {
    addToCart(product!, 1, lens, coatings, prescription);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const directAdd = () => {
    if (product!.lensCompatible) {
      setIsLensSelectorOpen(true);
    } else {
      handleAddToCart(); // Now this works
    }
  };

  const nextImg = () => setSelectedImageIndex(i => (i + 1) % product!.images.length);
  const prevImg = () => setSelectedImageIndex(i => (i - 1 + product!.images.length) % product!.images.length);

  /* ────────────────────── LOADING ────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-6"></div>
          <h3 className="text-2xl font-light text-gray-900">Loading Product</h3>
          <p className="text-gray-600 mt-2">Please wait…</p>
        </div>
      </div>
    );
  }

  /* ────────────────────── ERROR / NOT FOUND ────────────────────── */
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't locate this item."}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-900 text-white px-8 py-3.5 font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Products</span>
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────────── MAIN UI ────────────────────── */
  return (
    <div className="min-h-screen bg-white">

      {/* ───── SUCCESS TOAST ───── */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <Check className="h-5 w-5" />
          <span className="font-medium">Added to cart!</span>
        </div>
      )}

      {/* ───── BREADCRUMB ───── */}
      <div className="border-b border-gray-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Products</span>
          </button>
        </div>
      </div>

      {/* ───── FULL‑WIDTH CONTENT ───── */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* ── GRID – IMAGES + INFO ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">

            {/* ── IMAGE SECTION ── */}
            <div className="space-y-6">
              {/* Main Image (full‑bleed on lg) */}
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm group">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Stock Badges */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span>Only {product.stock} left!</span>
                    </span>
                  </div>
                )}

                {/* Nav Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        i === selectedImageIndex
                          ? 'border-gray-900 ring-2 ring-gray-300'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── INFO SECTION ── */}
            <div className="space-y-8">

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2.5 rounded-full hover:bg-gray-100 transition"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-400'
                      } transition-colors`}
                    />
                  </button>
                </div>

                <h1 className="text-4xl font-light text-gray-900 mb-2">{product.name}</h1>
                <p className="text-xl text-gray-600 font-medium">{product.brand}</p>

                {/* Rating */}
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(24)</span>
                </div>

                {/* Price */}
                <div className="mt-6">
                  <span className="text-5xl font-light text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.lensCompatible && (
                    <span className="ml-2 text-gray-500 text-lg">+ lens options</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'Premium quality eyewear crafted with precision.'}
                </p>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((f, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 text-gray-800 text-sm font-medium px-4 py-3 rounded-lg border border-gray-200 flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4 text-gray-600" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <button
                  onClick={directAdd}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-lg font-medium text-lg transition-all flex items-center justify-center space-x-2 ${
                    product.stock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>
                    {product.lensCompatible
                      ? 'Customize & Add to Cart'
                      : product.stock === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </button>
                  <button className="py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* ── GUARANTEES (now HomePage‑style cards) ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {[
                  { Icon: Truck, title: 'Free Shipping', desc: 'On orders over £150' },
                  { Icon: RotateCcw, title: '90‑Day Returns', desc: 'Satisfaction guaranteed' },
                  { Icon: Shield, title: '2‑Year Warranty', desc: 'Premium protection' }
                ].map((g, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <g.Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{g.title}</h4>
                    <p className="text-sm text-gray-600">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LENS SELECTOR MODAL ── */}
      <LensSelector
        isOpen={isLensSelectorOpen}
        onClose={() => setIsLensSelectorOpen(false)}
        onAdd={handleAddToCart}
        productName={product.name}
        product={product}
      />

      {/* ── ANIMATIONS ── */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}