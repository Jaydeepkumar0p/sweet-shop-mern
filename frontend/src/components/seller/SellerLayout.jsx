import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUser,
  FiLogOut, FiPlusCircle
} from 'react-icons/fi'

const NAV = [
  { to: '/seller/dashboard', icon: FiGrid,        label: 'Dashboard' },
  { to: '/seller/products',  icon: FiPackage,      label: 'My Products' },
  { to: '/seller/products/add', icon: FiPlusCircle, label: 'Add Product' },
  { to: '/seller/orders',    icon: FiShoppingBag,  label: 'Orders' },
  { to: '/seller/profile',   icon: FiUser,         label: 'Profile' },
]

export default function SellerLayout({ children }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-pink-100 sticky top-16 h-[calc(100vh-64px)] flex flex-col hidden md:flex">
        {/* Shop info */}
        <div className="p-5 border-b border-pink-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold mb-2">
            {user?.name[0].toUpperCase()}
          </div>
          <p className="font-semibold text-gray-800 text-sm">{user?.shopName || user?.name}</p>
          <p className="text-xs text-pink-500 mt-0.5">Seller Account</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/seller/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 shadow-pink-sm'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-pink-50">
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <FiLogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-pink-100 z-40 flex">
        {NAV.slice(0, 4).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/seller/dashboard'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-pink-600' : 'text-gray-400'
              }`
            }
          >
            <Icon size={20} />
            {label.split(' ')[0]}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}
