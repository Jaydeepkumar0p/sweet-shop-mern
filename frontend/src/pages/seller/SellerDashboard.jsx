import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/axios'
import SellerLayout from '../../components/seller/SellerLayout'
import { PageLoader } from '../../components/common/Loader'
import {
  FiDollarSign, FiShoppingBag, FiPackage,
  FiAlertTriangle, FiArrowRight, FiTrendingUp
} from 'react-icons/fi'

const STATUS_COLORS = {
  Processing:        'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed:         'bg-blue-50 text-blue-700 border-blue-200',
  Shipped:           'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Out for Delivery':'bg-orange-50 text-orange-700 border-orange-200',
  Delivered:         'bg-green-50 text-green-700 border-green-200',
  Cancelled:         'bg-red-50 text-red-700 border-red-200',
}

export default function SellerDashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/seller/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SellerLayout><PageLoader /></SellerLayout>

  const { stats, recentOrders, lowStockProducts, monthlyRevenue, categoryDistribution } = data

  const monthLabels  = Object.keys(monthlyRevenue  || {})
  const monthValues  = Object.values(monthlyRevenue || {})
  const maxRevenue   = Math.max(...monthValues, 1)

  const catLabels    = Object.keys(categoryDistribution  || {})
  const catValues    = Object.values(categoryDistribution || {})
  const maxCat       = Math.max(...catValues, 1)

  return (
    <SellerLayout>
      <div className="space-y-8 page-enter">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">Dashboard 📊</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FiDollarSign, label: 'Total Revenue',  value: `₹${(stats.revenue||0).toLocaleString()}`,   bg: 'bg-green-50',  icon_color: 'text-green-600' },
            { icon: FiShoppingBag,label: 'Total Orders',   value: stats.totalOrders,                           bg: 'bg-blue-50',   icon_color: 'text-blue-600' },
            { icon: FiPackage,     label: 'Products',       value: stats.totalProducts,                         bg: 'bg-purple-50', icon_color: 'text-purple-600' },
            { icon: FiAlertTriangle,label:'Low Stock',      value: stats.lowStockCount,                         bg: 'bg-red-50',    icon_color: 'text-red-500' },
          ].map(({ icon: Icon, label, value, bg, icon_color }) => (
            <div key={label} className="card p-5 space-y-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={icon_color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          {monthLabels.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiTrendingUp size={18} className="text-pink-500"/>
                <h2 className="font-semibold text-gray-800">Monthly Revenue</h2>
              </div>
              <div className="flex items-end gap-2 h-40">
                {monthLabels.map((month, i) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-pink-600">
                      ₹{Math.round(monthValues[i]/1000)}k
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-pink-500 to-pink-300 rounded-t-lg transition-all duration-500 hover:from-pink-600 hover:to-pink-400"
                      style={{ height: `${(monthValues[i] / maxRevenue) * 130}px`, minHeight: '4px' }}
                    />
                    <span className="text-[9px] text-gray-400">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Distribution */}
          {catLabels.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-800 mb-6">Products by Category</h2>
              <div className="space-y-3">
                {catLabels.map((cat, i) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">{cat}</span>
                      <span className="text-gray-400">{catValues[i]} products</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-700"
                        style={{ width: `${(catValues[i] / maxCat) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts?.length > 0 && (
          <div className="card p-5 border-l-4 border-orange-400">
            <div className="flex items-center gap-2 mb-3">
              <FiAlertTriangle size={16} className="text-orange-500"/>
              <h2 className="font-semibold text-gray-800">Low Stock Alert</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {lowStockProducts.slice(0, 4).map(p => (
                <div key={p._id} className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                  <img src={p.image} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-white"
                    onError={e => e.target.src='https://via.placeholder.com/40?text=🍬'}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-orange-600 font-semibold">Only {p.stock} left!</p>
                  </div>
                  <Link to={`/seller/products/edit/${p._id}`} className="text-pink-500 hover:text-pink-700 shrink-0">
                    <FiArrowRight size={16}/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <Link to="/seller/orders" className="text-pink-600 text-sm hover:text-pink-700 flex items-center gap-1">
              View All <FiArrowRight size={14}/>
            </Link>
          </div>
          {recentOrders?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-pink-50">
                    <th className="pb-3 text-xs text-gray-400 font-semibold uppercase">Order ID</th>
                    <th className="pb-3 text-xs text-gray-400 font-semibold uppercase">Customer</th>
                    <th className="pb-3 text-xs text-gray-400 font-semibold uppercase">Amount</th>
                    <th className="pb-3 text-xs text-gray-400 font-semibold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {recentOrders?.slice(0,6).map(order => (
                    <tr key={order._id} className="hover:bg-pink-50/50 transition-colors">
                      <td className="py-3 font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 font-medium text-gray-800">{order.buyer?.name}</td>
                      <td className="py-3 font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`badge border text-xs ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  )
}
