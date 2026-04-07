import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/axios'
import { PageLoader } from '../../components/common/Loader'
import { FiPackage, FiArrowRight } from 'react-icons/fi'

const STATUS_COLORS = {
  Processing:       'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed:        'bg-blue-50 text-blue-700 border-blue-200',
  Shipped:          'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Out for Delivery':'bg-orange-50 text-orange-700 border-orange-200',
  Delivered:        'bg-green-50 text-green-700 border-green-200',
  Cancelled:        'bg-red-50 text-red-700 border-red-200',
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/orders/my')
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">My Orders 📦</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-7xl mb-6">📦</p>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">No orders yet</h2>
          <p className="text-gray-500 mb-8">Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <FiPackage size={18} /> Browse Sweets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`badge border text-xs ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`badge text-xs ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-pink-50"
                          onError={e => e.target.src = 'https://via.placeholder.com/40?text=🍬'}
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-xs font-semibold text-pink-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                    <span className="text-sm text-gray-500 ml-1">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">₹{order.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                  </div>
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-1.5 text-pink-600 font-medium text-sm hover:text-pink-700 transition-colors whitespace-nowrap"
                  >
                    View <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
