import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import { PageLoader } from '../../components/common/Loader'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const { cart, loading, fetchCart, updateQuantity, removeFromCart } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => { fetchCart() }, [])

  if (loading) return <PageLoader/>

  const subtotal = cart.reduce((a,i) => a + (i.product?.price||0)*i.quantity, 0)
  const shipping = subtotal >= 499 ? 0 : 49
  const total    = subtotal + shipping

  if (cart.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center page-enter">
      <p className="text-7xl mb-6">🛒</p>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some delicious sweets to get started!</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2">
        <FiShoppingBag size={18}/> Browse Sweets
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">Shopping Cart 🛒</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const p = item.product
            if (!p) return null
            return (
              <div key={item._id || p._id} className="card p-4 flex gap-4 animate-fade-in">
                <Link to={`/products/${p._id}`} className="shrink-0">
                  <img src={p.image} alt={p.name}
                    className="w-20 h-20 rounded-xl object-cover bg-pink-50 hover:scale-105 transition-transform"
                    onError={e=>e.target.src='https://via.placeholder.com/80?text=🍬'}/>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${p._id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-pink-600 transition-colors line-clamp-1">{p.name}</h3>
                  </Link>
                  <p className="text-pink-600 font-bold mt-1">₹{p.price}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Stock: {p.stock}</p>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button onClick={() => removeFromCart(p._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <FiTrash2 size={16}/>
                  </button>
                  <div className="flex items-center border border-pink-100 rounded-full">
                    <button onClick={() => updateQuantity(p._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 rounded-full text-gray-500 transition-colors">
                      <FiMinus size={13}/>
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(p._id, item.quantity + 1)}
                      disabled={item.quantity >= p.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 rounded-full text-gray-500 transition-colors disabled:opacity-40">
                      <FiPlus size={13}/>
                    </button>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">₹{(p.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h2 className="font-display text-xl font-bold text-gray-800">Order Summary</h2>
            <div className="space-y-3 py-4 border-y border-pink-50">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cart.reduce((a,i)=>a+i.quantity,0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-pink-500 bg-pink-50 px-3 py-2 rounded-lg">
                  Add ₹{499 - subtotal} more for free shipping!
                </p>
              )}
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
              Proceed to Checkout <FiArrowRight size={18}/>
            </button>
            <Link to="/products" className="block text-center text-sm text-pink-600 hover:text-pink-700 font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
