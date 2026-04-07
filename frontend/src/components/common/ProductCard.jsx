import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useWishlistStore from '../../store/wishlistStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { toggleWishlist, isWishlisted } = useWishlistStore()

  const wishlisted = isWishlisted(product._id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to add to cart'); return }
    if (user.role !== 'buyer') { toast.error('Only buyers can add to cart'); return }
    await addToCart(product._id)
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to wishlist'); return }
    if (user.role !== 'buyer') { toast.error('Only buyers can wishlist'); return }
    await toggleWishlist(product._id)
  }

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="card group-hover:-translate-y-1 transition-all duration-300">

        {/* Image */}
        <div className="relative overflow-hidden bg-pink-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://via.placeholder.com/400x400?text=🍬' }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="badge bg-amber-400 text-amber-900 text-[10px]">⭐ Best Seller</span>
            )}
            {discount > 0 && (
              <span className="badge bg-green-500 text-white text-[10px]">{discount}% OFF</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-800 text-white text-[10px]">Out of Stock</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            {wishlisted
              ? <FaHeart size={14} className="text-pink-500" />
              : <FiHeart size={14} className="text-gray-500" />
            }
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-pink-500 font-medium uppercase tracking-wide mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={11}
                  className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.numReviews})</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-pink-sm"
            >
              <FiShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
