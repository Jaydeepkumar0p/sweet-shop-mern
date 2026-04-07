import { useEffect, useState } from 'react'
import API from '../../utils/axios'
import SellerLayout from '../../components/seller/SellerLayout'
import { PageLoader } from '../../components/common/Loader'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['Confirmed','Shipped','Out for Delivery','Delivered','Cancelled']

const STATUS_COLORS = {
  Processing:        'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed:         'bg-blue-50 text-blue-700 border-blue-200',
  Shipped:           'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Out for Delivery':'bg-orange-50 text-orange-700 border-orange-200',
  Delivered:         'bg-green-50 text-green-700 border-green-200',
  Cancelled:         'bg-red-50 text-red-700 border-red-200',
}

export default function SellerOrders() {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    API.get('/orders/seller')
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      const res = await API.patch(`/orders/${orderId}/status`, { status })
      setOrders(os => os.map(o => o._id === orderId ? res.data.order : o))
      toast.success(`Order marked as ${status}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setUpdating(null) }
  }

  return (
    <SellerLayout>
      <div className="space-y-6 page-enter">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {loading ? <PageLoader /> : orders.length === 0 ? (
          <div className="card text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="font-display text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400">Orders from buyers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="card overflow-hidden">
                {/* Header */}
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-pink-50/30 transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs text-gray-400 font-semibold">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`badge border text-xs ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`badge text-xs ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                        {order.paymentMethod} · {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{order.buyer?.name}</span>
                      <span className="text-gray-400"> · {order.buyer?.email}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{order.items.length} items</p>
                    </div>
                    <span className={`text-gray-400 transition-transform duration-200 ${expanded === order._id ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </div>

                {/* Expanded */}
                {expanded === order._id && (
                  <div className="border-t border-pink-50 p-5 space-y-5 animate-fade-in">
                    {/* Items */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-pink-50/40 rounded-xl p-3">
                            <img src={item.image} alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-pink-100 shrink-0"
                              onError={e => e.target.src='https://via.placeholder.com/40?text=🍬'}/>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-400">₹{item.price} × {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900 text-sm shrink-0">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Ship to</h3>
                      <p className="text-sm text-gray-700">{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
                      <p className="text-sm text-gray-500">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                    </div>

                    {/* Status update */}
                    {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(order._id, s)}
                              disabled={updating === order._id || order.orderStatus === s}
                              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50 ${
                                order.orderStatus === s
                                  ? 'bg-pink-500 text-white border-pink-500'
                                  : 'border-pink-200 text-gray-600 hover:border-pink-400 hover:text-pink-600'
                              }`}
                            >
                              {updating === order._id ? '...' : s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
