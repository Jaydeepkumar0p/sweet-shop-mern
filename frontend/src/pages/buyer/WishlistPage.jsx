import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useWishlistStore from '../../store/wishlistStore'
import useCartStore from '../../store/cartStore'
import { PageLoader } from '../../components/common/Loader'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'

export default function WishlistPage() {
  const { wishlist, loading, fetchWishlist, toggleWishlist } = useWishlistStore()
  const { addToCart } = useCartStore()

  useEffect(() => { fetchWishlist() }, [])

  if (loading) return <PageLoader/>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">My Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-7xl mb-6">❤️</p>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save sweets you love to buy later!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">Browse Sweets</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="card group hover:-translate-y-1 transition-all duration-300">
              <div className="relative overflow-hidden bg-pink-50 aspect-square">
                <Link to={`/products/${product._id}`}>
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e=>e.target.src='https://via.placeholder.com/400?text=🍬'}/>
                </Link>
                <button onClick={() => toggleWishlist(product._id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-all text-pink-500">
                  <FiTrash2 size={14}/>
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 font-medium uppercase tracking-wide mb-1">{product.category}</p>
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 hover:text-pink-600 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">₹{product.price}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                    className="w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 shadow-pink-sm"
                  >
                    <FiShoppingCart size={15}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
