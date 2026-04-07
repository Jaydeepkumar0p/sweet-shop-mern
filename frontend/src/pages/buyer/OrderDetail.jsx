import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../utils/axios'
import { PageLoader } from '../../components/common/Loader'
import { FiArrowLeft, FiCheck, FiPackage, FiTruck, FiHome } from 'react-icons/fi'

const STEPS = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']

const STATUS_COLORS = {
  Processing:        'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed:         'bg-blue-50 text-blue-700 border-blue-200',
  Shipped:           'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Out for Delivery':'bg-orange-50 text-orange-700 border-orange-200',
  Delivered:         'bg-green-50 text-green-700 border-green-200',
  Cancelled:         'bg-red-50 text-red-700 border-red-200',
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(r => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (!order) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-gray-600">Order not found</p>
    </div>
  )

  const currentStep = order.orderStatus === 'Cancelled' ? -1 : STEPS.indexOf(order.orderStatus)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-6 transition-colors text-sm">
        <FiArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">
            Order <span className="text-pink-500">#{order._id.slice(-8).toUpperCase()}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
        <span className={`badge border text-sm px-4 py-1.5 ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Order Tracker */}
      {order.orderStatus !== 'Cancelled' && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-6 text-sm uppercase tracking-wider">Order Tracking</h2>
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500"
                style={{ width: currentStep >= 0 ? `${(currentStep / (STEPS.length - 1)) * 100}%` : '0%' }}
              />
            </div>
            <div className="relative flex justify-between">
              {STEPS.map((step, i) => {
                const done    = i < currentStep
                const current = i === currentStep
                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                      done    ? 'bg-pink-500 text-white' :
                      current ? 'bg-pink-500 text-white ring-4 ring-pink-100' :
                                'bg-white border-2 border-gray-200 text-gray-300'
                    }`}>
                      {done ? <FiCheck size={14} /> :
                       i === 0 ? <FiPackage size={14}/> :
                       i === STEPS.length - 1 ? <FiHome size={14}/> :
                       <FiTruck size={14}/>}
                    </div>
                    <span className={`text-[10px] text-center font-medium hidden sm:block ${
                      current ? 'text-pink-600' : done ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-pink-50 shrink-0"
                  onError={e => e.target.src = 'https://via.placeholder.com/48?text=🍬'}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">₹{item.price} × {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900 text-sm shrink-0">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-pink-50 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className={order.shippingCharge === 0 ? 'text-green-600' : ''}>
                {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-pink-50">
              <span>Total</span><span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping + Payment */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Payment Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-800 mb-3">Order Timeline</h2>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{h.status}</p>
                      {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                      <p className="text-xs text-gray-400">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
