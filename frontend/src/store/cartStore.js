import { create } from 'zustand'
import API from '../utils/axios'
import toast from 'react-hot-toast'

const useCartStore = create((set, get) => ({
  cart:    [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const res = await API.get('/cart')
      set({ cart: res.data.cart, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await API.post('/cart', { productId, quantity })
      set({ cart: res.data.cart })
      toast.success('Added to cart! 🛒')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
      return false
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await API.put(`/cart/${productId}`, { quantity })
      set({ cart: res.data.cart })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  },

  removeFromCart: async (productId) => {
    try {
      const res = await API.delete(`/cart/${productId}`)
      set({ cart: res.data.cart })
      toast.success('Removed from cart')
    } catch {
      toast.error('Failed to remove item')
    }
  },

  clearCart: async () => {
    try {
      await API.delete('/cart')
      set({ cart: [] })
    } catch {}
  },

  get cartCount() {
    return get().cart.reduce((a, i) => a + i.quantity, 0)
  },

  get cartTotal() {
    return get().cart.reduce((a, i) => a + (i.product?.price || 0) * i.quantity, 0)
  },
}))

export default useCartStore
