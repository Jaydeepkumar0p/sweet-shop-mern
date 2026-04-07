import { create } from 'zustand'
import API from '../utils/axios'
import toast from 'react-hot-toast'

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading:  false,

  fetchWishlist: async () => {
    set({ loading: true })
    try {
      const res = await API.get('/wishlist')
      set({ wishlist: res.data.wishlist, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const res = await API.post('/wishlist/toggle', { productId })
      const { action } = res.data
      if (action === 'added') {
        toast.success('Added to wishlist ❤️')
      } else {
        toast.success('Removed from wishlist')
        set({ wishlist: get().wishlist.filter(p => p._id !== productId) })
      }
      return action
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  },

  isWishlisted: (productId) => get().wishlist.some(p => p._id === productId),
}))

export default useWishlistStore
