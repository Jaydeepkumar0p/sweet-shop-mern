import { create } from 'zustand'
import API from '../utils/axios'

const useProductStore = create((set) => ({
  products:    [],
  featured:    [],
  bestSellers: [],
  product:     null,
  total:       0,
  pages:       1,
  page:        1,
  loading:     false,
  error:       null,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const query = new URLSearchParams(params).toString()
      const res   = await API.get(`/products?${query}`)
      set({
        products: res.data.products,
        total:    res.data.total,
        pages:    res.data.pages,
        page:     res.data.page,
        loading:  false,
      })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load products', loading: false })
    }
  },

  fetchFeatured: async () => {
    try {
      const res = await API.get('/products/featured')
      set({ featured: res.data.products })
    } catch {}
  },

  fetchBestSellers: async () => {
    try {
      const res = await API.get('/products/bestsellers')
      set({ bestSellers: res.data.products })
    } catch {}
  },

  fetchProduct: async (id) => {
    set({ loading: true, product: null })
    try {
      const res = await API.get(`/products/${id}`)
      set({ product: res.data.product, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Product not found', loading: false })
    }
  },
}))

export default useProductStore
