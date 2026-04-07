import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sweetshop_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — but NOT for auth endpoints
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || ''
    const is401 = error.response?.status === 401
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register')

    if (is401 && !isAuthRoute) {
      localStorage.removeItem('sweetshop_token')
      localStorage.removeItem('sweetshop_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API
