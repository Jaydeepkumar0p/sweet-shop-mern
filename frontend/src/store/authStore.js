import { create } from 'zustand'
import API from '../utils/axios'
import toast from 'react-hot-toast'

const useAuthStore = create((set, get) => ({
  user:    JSON.parse(localStorage.getItem('sweetshop_user') || 'null'),
  token:   localStorage.getItem('sweetshop_token') || null,
  loading: false,

  register: async (data) => {
    set({ loading: true })
    try {
      const res = await API.post('/auth/register', data)
      const { token, user } = res.data
      localStorage.setItem('sweetshop_token', token)
      localStorage.setItem('sweetshop_user', JSON.stringify(user))
      set({ user, token, loading: false })
      toast.success(`Welcome, ${user.name}! 🍬`)
      return { success: true, role: user.role }
    } catch (err) {
      set({ loading: false })
      toast.error(err.response?.data?.message || 'Registration failed')
      return { success: false }
    }
  },

  login: async (data) => {
    set({ loading: true })
    try {
      const res = await API.post('/auth/login', data)
      const { token, user } = res.data
      localStorage.setItem('sweetshop_token', token)
      localStorage.setItem('sweetshop_user', JSON.stringify(user))
      set({ user, token, loading: false })
      toast.success(`Welcome back, ${user.name}! 🎉`)
      return { success: true, role: user.role }
    } catch (err) {
      set({ loading: false })
      toast.error(err.response?.data?.message || 'Login failed')
      return { success: false }
    }
  },

  logout: () => {
    localStorage.removeItem('sweetshop_token')
    localStorage.removeItem('sweetshop_user')
    set({ user: null, token: null })
    toast.success('Logged out successfully')
  },

  updateUser: (user) => {
    localStorage.setItem('sweetshop_user', JSON.stringify(user))
    set({ user })
  },

  fetchMe: async () => {
    try {
      const res = await API.get('/auth/me')
      const user = res.data.user
      localStorage.setItem('sweetshop_user', JSON.stringify(user))
      set({ user })
    } catch {
      get().logout()
    }
  },
}))

export default useAuthStore
