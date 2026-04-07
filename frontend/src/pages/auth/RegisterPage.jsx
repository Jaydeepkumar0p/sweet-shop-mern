import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiShoppingCart } from 'react-icons/fi'

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'buyer', shopName:'', shopDescription:'' })
  const [showPw, setShowPw] = useState(false)
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await register(form)
    if (res.success) navigate(res.role === 'seller' ? '/seller/dashboard' : '/')
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <span className="text-5xl mb-4 block">🎉</span>
          <h1 className="font-display text-3xl font-bold text-gray-900">Join SweetShop</h1>
          <p className="text-gray-500 mt-2">Create your free account today</p>
        </div>

        <div className="card p-8 animate-fade-in">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value:'buyer',  icon: FiShoppingCart, label:'I want to Buy',  sub:'Browse & order sweets' },
              { value:'seller', icon: FiShoppingBag,  label:'I want to Sell', sub:'List & sell sweets' },
            ].map(({ value, icon: Icon, label, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => up('role', value)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  form.role === value
                    ? 'border-pink-500 bg-pink-50 shadow-pink-sm'
                    : 'border-pink-100 hover:border-pink-200'
                }`}
              >
                <Icon size={22} className={form.role === value ? 'text-pink-600 mb-2' : 'text-gray-400 mb-2'}/>
                <p className={`font-semibold text-sm ${form.role === value ? 'text-pink-700' : 'text-gray-700'}`}>{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
              <div className="relative">
                <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input required className="input-field pl-11" placeholder="Your name"
                  value={form.name} onChange={e => up('name', e.target.value)}/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="email" required className="input-field pl-11" placeholder="you@example.com"
                  value={form.email} onChange={e => up('email', e.target.value)}/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={showPw?'text':'password'} required minLength={6} className="input-field pl-11 pr-11"
                  placeholder="Min 6 characters"
                  value={form.password} onChange={e => up('password', e.target.value)}/>
                <button type="button" onClick={()=>setShowPw(v=>!v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                </button>
              </div>
            </div>

            {form.role === 'seller' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Shop Name</label>
                  <input className="input-field" placeholder="Your sweet shop name"
                    value={form.shopName} onChange={e => up('shopName', e.target.value)}/>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Shop Description</label>
                  <textarea rows={2} className="input-field resize-none" placeholder="Tell customers about your shop..."
                    value={form.shopDescription} onChange={e => up('shopDescription', e.target.value)}/>
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-pink-50 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
