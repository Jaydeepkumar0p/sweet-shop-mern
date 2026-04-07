import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import API from '../../utils/axios'
import toast from 'react-hot-toast'
import { FiTruck, FiCreditCard, FiCheck } from 'react-icons/fi'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || 'pk_test_placeholder')

function CheckoutForm() {
  const { cart, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const stripe   = useStripe()
  const elements = useElements()

  const [step, setStep]   = useState(1) // 1=address, 2=payment
  const [method, setMethod] = useState('COD')
  const [placing, setPlacing] = useState(false)
  const [addr, setAddr] = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    street:   user?.address?.street || '',
    city:     user?.address?.city || '',
    state:    user?.address?.state || '',
    pincode:  user?.address?.pincode || '',
    country:  'India',
  })

  const subtotal = cart.reduce((a,i) => a + (i.product?.price||0)*i.quantity, 0)
  const shipping = subtotal >= 499 ? 0 : 49
  const total    = subtotal + shipping

  const up = (k, v) => setAddr(a => ({ ...a, [k]: v }))

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const items = cart.map(i => ({ product: i.product._id, quantity: i.quantity }))

      if (method === 'COD') {
        const res = await API.post('/orders', { items, shippingAddress: addr, paymentMethod: 'COD' })
        toast.success('Order placed successfully! 🎉')
        await clearCart()
        navigate(`/orders/${res.data.order._id}`)
      } else {
        // Stripe
        const intentRes = await API.post('/payment/create-intent', { amount: total })
        const { clientSecret, paymentIntentId } = intentRes.data

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) }
        })
        if (error) throw new Error(error.message)

        const res = await API.post('/orders', {
          items,
          shippingAddress:       addr,
          paymentMethod:         'Stripe',
          stripePaymentIntentId: paymentIntent.id,
        })
        toast.success('Payment successful! Order placed 🎉')
        await clearCart()
        navigate(`/orders/${res.data.order._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {['Shipping Address', 'Payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step > i+1 ? 'bg-green-500 text-white' : step === i+1 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i+1 ? <FiCheck size={14}/> : i+1}
            </div>
            <span className={`text-sm font-medium ${step === i+1 ? 'text-pink-600' : 'text-gray-400'}`}>{s}</span>
            {i === 0 && <div className="w-12 h-0.5 bg-gray-200 mx-2"/>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card p-6 space-y-4 animate-fade-in">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Full Name *</label>
                  <input className="input-field" required value={addr.fullName} onChange={e=>up('fullName',e.target.value)}/>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Phone *</label>
                  <input className="input-field" required value={addr.phone} onChange={e=>up('phone',e.target.value)}/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Street Address *</label>
                  <input className="input-field" required value={addr.street} onChange={e=>up('street',e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">City *</label>
                  <input className="input-field" required value={addr.city} onChange={e=>up('city',e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">State *</label>
                  <input className="input-field" required value={addr.state} onChange={e=>up('state',e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Pincode *</label>
                  <input className="input-field" required value={addr.pincode} onChange={e=>up('pincode',e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Country</label>
                  <input className="input-field" value={addr.country} readOnly/>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!addr.fullName || !addr.phone || !addr.street || !addr.city || !addr.state || !addr.pincode) {
                    toast.error('Please fill all required fields'); return
                  }
                  setStep(2)
                }}
                className="btn-primary w-full py-3.5 mt-2">
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6 space-y-5 animate-fade-in">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Payment Method</h2>

              {/* COD */}
              <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                method === 'COD' ? 'border-pink-500 bg-pink-50' : 'border-pink-100 hover:border-pink-200'
              }`}>
                <input type="radio" name="payment" value="COD" checked={method==='COD'} onChange={()=>setMethod('COD')} className="accent-pink-500"/>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiTruck size={18} className="text-green-600"/>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                </div>
              </label>

              {/* Stripe */}
              <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                method === 'Stripe' ? 'border-pink-500 bg-pink-50' : 'border-pink-100 hover:border-pink-200'
              }`}>
                <input type="radio" name="payment" value="Stripe" checked={method==='Stripe'} onChange={()=>setMethod('Stripe')} className="accent-pink-500 mt-3"/>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiCreditCard size={18} className="text-blue-600"/>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Pay with Card (Stripe)</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, etc.</p>
                    </div>
                  </div>
                  {method === 'Stripe' && (
                    <div className="p-3 border border-pink-100 rounded-xl bg-white">
                      <CardElement options={{
                        style: {
                          base: { fontSize:'15px', color:'#1a1a2e', '::placeholder':{ color:'#9ca3af' } },
                          invalid: { color:'#ef4444' },
                        }
                      }}/>
                    </div>
                  )}
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
                <button onClick={handlePlaceOrder} disabled={placing || !stripe}
                  className="btn-primary flex-1 py-3 disabled:opacity-60">
                  {placing ? 'Placing Order...' : `Place Order (₹${total})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit sticky top-24 space-y-3">
          <h3 className="font-semibold text-gray-800">Your Order</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map(item => item.product && (
              <div key={item.product._id} className="flex gap-3 items-start">
                <img src={item.product.image} alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-pink-50 shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-gray-900 shrink-0">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-pink-50 pt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className={shipping===0?'text-green-600 font-medium':''}>{shipping===0?'FREE':'₹'+shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-pink-50">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm/>
    </Elements>
  )
}
