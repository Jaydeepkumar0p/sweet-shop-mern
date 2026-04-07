import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const { login, loading }    = useAuthStore()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await login(form)
    if (res.success) navigate(res.role === 'seller' ? '/seller/dashboard' : '/')
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <span className="text-5xl mb-4 block">🍬</span>
          <h1 className="font-display text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-500 mt-2">Sign in to continue shopping</p>
        </div>

        <div className="card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="email" required className="input-field pl-11"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f=>({...f,email:e.target.value}))}/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={showPw ? 'text' : 'password'} required className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f=>({...f,password:e.target.value}))}/>
                <button type="button" onClick={() => setShowPw(v=>!v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-pink-50 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-pink-600 font-semibold hover:text-pink-700">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
