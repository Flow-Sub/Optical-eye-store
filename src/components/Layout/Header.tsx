import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Eye, ShoppingCart, User, Menu, X, Search, ChevronDown,
  LogOut, Settings, Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Appointments', href: '/appointments' },
    { name: 'About', href: '/about' }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header className="relative z-50">
        {/* ────────  CENTERED FLOATING PILL  ──────── */}
        <nav className="fixed inset-x-0 top-6 flex justify-center pointer-events-none">
          <div className="w-full max-w-5xl px-6 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/30
                            transition-all duration-300 hover:shadow-3xl animate-float">
              <div className="flex items-center justify-between h-16 px-6">

                {/* ── LOGO ── */}
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="p-2 bg-gradient-to-br from-gray-50 to-white rounded-full border border-white/40 shadow-inner">
                    <Eye className="h-5 w-5 text-gray-900" />
                  </div>
                  <div>
                    <div className="text-lg font-medium tracking-tight text-gray-900
                                    animate-shimmer bg-clip-text text-transparent
                                    bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                      OpticalStore
                    </div>
                    <div className="text-xs text-gray-500 -mt-0.5 font-light">Vision Perfected</div>
                  </div>
                </Link>

                {/* ── DESKTOP NAV ── */}
                <div className="hidden md:flex items-center space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300
                                  group overflow-hidden rounded-full
                                  ${isActive(item.href) ? 'text-white' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                      <span className={`absolute inset-0 rounded-full transition-all duration-300
                                        ${isActive(item.href)
                          ? 'bg-gradient-to-r from-gray-900 to-black scale-100'
                          : 'bg-gray-100 scale-0 group-hover:scale-100'}`} />
                      <span className="relative z-10 flex items-center space-x-1">
                        <span className={isActive(item.href) ? 'animate-vibrate' : ''}>
                          {item.name}
                        </span>
                        {isActive(item.href) && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        )}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* ── RIGHT ACTIONS ── */}
                <div className="flex items-center space-x-2">
                  {/* Search */}
                  <button className="p-2.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-200">
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Cart */}
                  <Link to="/cart" className="relative p-2.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 group">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-500 to-pink-600
                                       text-white text-xs rounded-full h-5 w-5 flex items-center justify-center
                                       font-medium shadow-lg animate-bounce">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-full
                                   bg-gradient-to-r from-gray-900 to-black text-white
                                   hover:shadow-lg transition-all duration-200"
                      >
                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl
                                        rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                          <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center justify-between px-5 py-3 text-sm hover:bg-gray-50">
                              <div className="flex items-center space-x-3"><User className="h-4 w-4" /><span>My Profile</span></div>
                            </Link>
                            <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center justify-between px-5 py-3 text-sm hover:bg-gray-50">
                              <div className="flex items-center space-x-3"><Package className="h-4 w-4" /><span>My Orders</span></div>
                            </Link>
                            {user.isAdmin && (
                              <Link to="/admin" onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-center justify-between px-5 py-3 text-sm hover:bg-gray-50 border-t">
                                <div className="flex items-center space-x-3"><Settings className="h-4 w-4" /><span>Admin Dashboard</span></div>
                              </Link>
                            )}
                          </div>
                          <div className="border-t">
                            <button
                              onClick={() => { logout(); setIsUserMenuOpen(false); }}
                              className="w-full text-left px-5 py-3 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-3"
                            >
                              <LogOut className="h-4 w-4" /><span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2.5
                                 rounded-full text-sm font-medium hover:shadow-lg transition-all"
                    >
                      Sign In
                    </Link>
                  )}

                  {/* Mobile toggle */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all"
                  >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── MOBILE MENU (still centered under the pill) ── */}
        {isMenuOpen && (
          <div className="fixed inset-x-0 top-24 mx-6 mt-4 bg-white/95 backdrop-blur-xl
                          rounded-3xl shadow-2xl border border-white/30 p-6 md:hidden">
            {/* … same mobile markup as before … */}
          </div>
        )}
      </header>

      {/* Close dropdown on outside click */}
      {isUserMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
      )}

      {/* ── ANIMATIONS ── */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes vibrate { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-1px) rotate(-.5deg)} 50%{transform:translateX(1px) rotate(.5deg)} 75%{transform:translateX(-1px) rotate(-.5deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-vibrate { animation: vibrate .5s ease-in-out infinite; }
        .animate-shimmer { background-size:200% auto; animation: shimmer 3s linear infinite; }
      `}</style>
    </>
  );
}