import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import {
  FiShoppingCart, FiHeart, FiUser, FiMenu, FiX,
  FiLogOut, FiPackage, FiGrid
} from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { cart, fetchCart } = useCartStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (user?.role === 'buyer') fetchCart()
  }, [user])

  useEffect(() => { setMenuOpen(false); setUserMenu(false) }, [location.pathname])

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0)

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-pink-sm' : 'bg-white'
    } border-b border-pink-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🍬</span>
            <span className="font-display font-bold text-xl text-gray-800 group-hover:text-pink-600 transition-colors">
              Sweet<span className="text-pink-500">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/"         className="text-gray-600 hover:text-pink-600 font-medium transition-colors text-sm">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-pink-600 font-medium transition-colors text-sm">Browse Sweets</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <>
                    <Link to="/wishlist" className="p-2.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                      <FiHeart size={19} />
                    </Link>
                    <Link to="/cart" className="relative p-2.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                      <FiShoppingCart size={19} />
                      {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* User Dropdown */}
                <div className="relative ml-1">
                  <button onClick={() => setUserMenu(v => !v)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-pink-50 transition-all">
                    {user.avatar
                      ? <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-pink-200" />
                      : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                          {user.name[0].toUpperCase()}
                        </div>
                    }
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  </button>

                  {userMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-pink-md border border-pink-100 py-2 animate-fade-in z-50">
                        <div className="px-4 py-2.5 border-b border-pink-50">
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-pink-500 text-xs capitalize mt-0.5">{user.role}</p>
                        </div>
                        {user.role === 'buyer' ? (
                          <>
                            <Link to="/profile"  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiUser size={14}/> Profile</Link>
                            <Link to="/orders"   className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiPackage size={14}/> My Orders</Link>
                            <Link to="/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiHeart size={14}/> Wishlist</Link>
                          </>
                        ) : (
                          <>
                            <Link to="/seller/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiGrid size={14}/> Dashboard</Link>
                            <Link to="/seller/products"  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiPackage size={14}/> My Products</Link>
                            <Link to="/seller/orders"    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiUser size={14}/> Orders</Link>
                          </>
                        )}
                        <div className="border-t border-pink-50 mt-1">
                          <button onClick={() => { logout(); navigate('/') }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <FiLogOut size={14}/> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="btn-ghost text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
              </div>
            )}

            <button className="md:hidden p-2 text-gray-600 hover:text-pink-600 rounded-full hover:bg-pink-50"
              onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <FiX size={22}/> : <FiMenu size={22}/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-pink-100 py-3 animate-slide-up space-y-1 pb-4">
            <Link to="/"         className="block px-4 py-2.5 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl">Home</Link>
            <Link to="/products" className="block px-4 py-2.5 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl">Browse Sweets</Link>
            {!user && (
              <>
                <Link to="/login"    className="block px-4 py-2.5 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl">Login</Link>
                <Link to="/register" className="block px-4 py-2.5 text-pink-600 font-medium hover:bg-pink-50 rounded-xl">Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
