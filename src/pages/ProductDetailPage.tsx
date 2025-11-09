/* src/pages/ProductDetailPage.tsx */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, AlertCircle, ArrowLeft,
  Share2, Check, Zap, Package, Eye, Sparkles
} from 'lucide-react';
import { fetchProductById } from '../services/airtable';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import { LensSelector } from '../components/LensSelector/LensSelector';
import { ProductCard } from '../components/Product/ProductCard';
import { LensOption, LensCoating, PrescriptionData, Product } from '../types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { products } = useProducts();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLensSelectorOpen, setIsLensSelectorOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  /* ────────────────────── SUGGESTED PRODUCTS ────────────────────── */
  const suggestedProducts = product 
    ? products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
    : [];

  /* ────────────────────── HANDLERS ────────────────────── */
  const handleAddToCart = (lens?: LensOption, coatings?: LensCoating[], prescription?: PrescriptionData) => {
    addToCart(product!, quantity, lens, coatings, prescription);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const directAdd = () => {
    if (product!.lensCompatible) {
      setIsLensSelectorOpen(true);
    } else {
      handleAddToCart();
    }
  };

  const nextImg = () => setSelectedImageIndex(i => (i + 1) % product!.images.length);
  const prevImg = () => setSelectedImageIndex(i => (i - 1 + product!.images.length) % product!.images.length);

  /* ────────────────────── LOADING ────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
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
      <div className="min-h-screen bg-white flex items-center justify-center pt-28 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't locate this item."}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-900 text-white px-8 py-3.5 rounded-lg font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
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
    <div className="min-h-screen bg-white pt-20"> {/* ✅ Added pt-20 for navbar spacing */}

      {/* ───── SUCCESS TOAST ───── */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <Check className="h-5 w-5" />
          <span className="font-medium">Added to cart!</span>
        </div>
      )}

      {/* ───── BREADCRUMB ───── */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10 backdrop-blur-sm bg-white/95"> {/* ✅ Sticky breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-light">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors font-light">Products</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium capitalize">{product.category}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* ───── MAIN CONTENT ───── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ── PRODUCT SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* ── IMAGE GALLERY ── */}
          <div className="space-y-6">
            {/* Main Image - Subtle black border */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-lg group border border-gray-200">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Stock Badges */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-1 shadow-lg">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter - Black background */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImageIndex
                        ? 'border-gray-900 ring-2 ring-gray-300 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="space-y-8">

            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-gray-900 text-white text-xs font-medium px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.lensCompatible && (
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium px-4 py-1.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Customizable</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-3 rounded-full hover:bg-gray-100 transition group"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-400 group-hover:text-red-500'
                      } transition-colors`}
                    />
                  </button>
                  <button className="p-3 rounded-full hover:bg-gray-100 transition group">
                    <Share2 className="h-6 w-6 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 font-medium mb-4">{product.brand}</p>

              {/* Rating */}
              <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
                {/* <button className="text-sm text-gray-900 hover:underline font-medium">
                  Write a review
                </button> */}
              </div>
            </div>

            {/* Price - Subtle black accent */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-900">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-5xl font-light text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.lensCompatible && (
                  <span className="text-gray-500 text-lg">+ lens options</span>
                )}
              </div>
              <p className="text-sm text-gray-600">Free shipping on orders over $150</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Description</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Premium quality eyewear crafted with precision and care. Designed for modern life with exceptional comfort and style.'}
              </p>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Key Features</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((f, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 text-gray-800 text-sm font-medium px-4 py-3 rounded-xl flex items-center space-x-2 hover:border-gray-900 transition-colors"
                    >
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="capitalize">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-2xl font-light text-gray-900 w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-600">{product.stock} available</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={directAdd}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  product.stock === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-black hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>
                  {product.lensCompatible
                    ? 'Customize & Add to Cart'
                    : product.stock === 0
                    ? 'Out of Stock'
                    : `Add ${quantity} to Cart`}
                </span>
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Add to Wishlist</span>
                </button>
                <button className="py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Try Virtual</span>
                </button>
              </div>
            </div>

            {/* ── GUARANTEES - Subtle black icons ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {[
                { Icon: Truck, title: 'Free Shipping', desc: 'On orders over $150' },
                { Icon: RotateCcw, title: '90-Day Returns', desc: 'Hassle-free' },
                { Icon: Shield, title: '2-Year Warranty', desc: 'Full coverage' }
              ].map((g, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl text-center border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <g.Icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{g.title}</h4>
                  <p className="text-xs text-gray-600">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SUGGESTED PRODUCTS ── */}
        {suggestedProducts.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-200">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-3">
                <Sparkles className="h-4 w-4" />
                <span>You May Also Like</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900">Similar Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
              {suggestedProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}