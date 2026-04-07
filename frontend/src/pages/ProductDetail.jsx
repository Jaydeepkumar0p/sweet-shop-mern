import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProductStore from '../store/productStore'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import useAuthStore from '../store/authStore'
import { PageLoader } from '../components/common/Loader'
import StarRating from '../components/common/StarRating'
import API from '../utils/axios'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiMinus, FiPlus, FiStar } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

export default function ProductDetail() {
  const { id } = useParams()
  const { product, loading, fetchProduct } = useProductStore()
  const { addToCart } = useCartStore()
  const { toggleWishlist, isWishlisted, fetchWishlist } = useWishlistStore()
  const { user } = useAuthStore()

  const [qty, setQty] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchProduct(id) }, [id])
  useEffect(() => { if (user?.role === 'buyer') fetchWishlist() }, [user])

  if (loading) return <PageLoader/>
  if (!product) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-gray-600 text-lg">Product not found</p>
      <Link to="/products" className="btn-primary mt-4 inline-flex">Back to Sweets</Link>
    </div>
  )

  const wishlisted = isWishlisted(product._id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return }
    if (user.role !== 'buyer') { toast.error('Only buyers can add to cart'); return }
    await addToCart(product._id, qty)
  }

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return }
    await toggleWishlist(product._id)
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    if (user.role !== 'buyer') { toast.error('Only buyers can review'); return }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return }
    setSubmitting(true)
    try {
      await API.post(`/products/${id}/review`, reviewForm)
      toast.success('Review submitted!')
      setReviewForm({ rating: 5, comment: '' })
      fetchProduct(id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-pink-500">Home</Link> /
        <Link to="/products" className="hover:text-pink-500">Sweets</Link> /
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-pink-50 aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge bg-green-500 text-white text-sm px-3 py-1.5">
                {discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <span className="badge bg-pink-100 text-pink-700 text-xs mb-2">{product.category}</span>
            <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            {product.seller && (
              <p className="text-gray-400 text-sm mt-1">by <span className="text-pink-500">{product.seller.shopName || product.seller.name}</span></p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating value={Math.round(product.rating)} readonly size={18}/>
            <span className="text-gray-600 text-sm font-medium">{product.rating?.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-lg line-through">₹{product.originalPrice}</span>
            )}
            {discount > 0 && <span className="text-green-600 text-sm font-semibold">Save ₹{product.originalPrice - product.price}</span>}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm">
            {product.weight && <span className="badge bg-gray-100 text-gray-600">⚖️ {product.weight}</span>}
            <span className={`badge ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✕ Out of Stock'}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-pink-100 rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q-1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 text-gray-600 transition-colors">
                  <FiMinus size={15}/>
                </button>
                <span className="w-10 text-center font-semibold text-gray-800">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 text-gray-600 transition-colors">
                  <FiPlus size={15}/>
                </button>
              </div>
              <button onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
                <FiShoppingCart size={18}/> Add to Cart
              </button>
              <button onClick={handleWishlist}
                className="w-12 h-12 rounded-full border-2 border-pink-200 flex items-center justify-center hover:border-pink-500 hover:bg-pink-50 transition-all">
                {wishlisted ? <FaHeart size={18} className="text-pink-500"/> : <FiHeart size={18} className="text-gray-400"/>}
              </button>
            </div>
          )}

          {/* Trust */}
          <div className="flex gap-4 pt-2 border-t border-pink-50">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiTruck size={16} className="text-pink-400"/> Free delivery ₹499+
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiShield size={16} className="text-pink-400"/> Secure payment
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-8">Reviews ({product.numReviews})</h2>
        <div className="grid md:grid-cols-2 gap-10">

          {/* Review form */}
          {user?.role === 'buyer' && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Your Rating</label>
                  <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f=>({...f,rating:r}))} size={24}/>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Your Review</label>
                  <textarea
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f=>({...f,comment:e.target.value}))}
                    required
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3 disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Review list */}
          <div className="space-y-4">
            {product.reviews?.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FiStar size={32} className="mx-auto mb-2 opacity-30"/>
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              product.reviews.map((r, i) => (
                <div key={i} className="card p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-gradient flex items-center justify-center text-white text-sm font-bold">
                        {r.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
                    </div>
                    <StarRating value={r.rating} readonly size={13}/>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                  <p className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
