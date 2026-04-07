import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Public pages
import HomePage      from './pages/HomePage'
import ProductsPage  from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import LoginPage     from './pages/auth/LoginPage'
import RegisterPage  from './pages/auth/RegisterPage'

// Buyer pages
import CartPage     from './pages/buyer/CartPage'
import WishlistPage from './pages/buyer/WishlistPage'
import CheckoutPage from './pages/buyer/CheckoutPage'
import OrdersPage   from './pages/buyer/OrdersPage'
import OrderDetail  from './pages/buyer/OrderDetail'
import ProfilePage  from './pages/buyer/ProfilePage'

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts  from './pages/seller/SellerProducts'
import AddProduct      from './pages/seller/AddProduct'
import EditProduct     from './pages/seller/EditProduct'
import SellerOrders    from './pages/seller/SellerOrders'
import SellerProfile   from './pages/seller/SellerProfile'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'seller' ? '/seller/dashboard' : '/'} replace />
  }
  return children
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"             element={<HomePage />} />
          <Route path="/products"     element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />

          {/* Buyer */}
          <Route path="/cart"       element={<ProtectedRoute role="buyer"><CartPage /></ProtectedRoute>} />
          <Route path="/wishlist"   element={<ProtectedRoute role="buyer"><WishlistPage /></ProtectedRoute>} />
          <Route path="/checkout"   element={<ProtectedRoute role="buyer"><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders"     element={<ProtectedRoute role="buyer"><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute role="buyer"><OrderDetail /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute role="buyer"><ProfilePage /></ProtectedRoute>} />

          {/* Seller */}
          <Route path="/seller/dashboard"          element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/products"           element={<ProtectedRoute role="seller"><SellerProducts /></ProtectedRoute>} />
          <Route path="/seller/products/add"       element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
          <Route path="/seller/products/edit/:id"  element={<ProtectedRoute role="seller"><EditProduct /></ProtectedRoute>} />
          <Route path="/seller/orders"             element={<ProtectedRoute role="seller"><SellerOrders /></ProtectedRoute>} />
          <Route path="/seller/profile"            element={<ProtectedRoute role="seller"><SellerProfile /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
