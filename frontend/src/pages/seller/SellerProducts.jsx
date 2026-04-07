import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/axios'
import SellerLayout from '../../components/seller/SellerLayout'
import { PageLoader } from '../../components/common/Loader'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi'

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = () => {
    setLoading(true)
    API.get('/seller/products')
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    try {
      await API.delete(`/products/${id}`)
      toast.success('Product deleted')
      setProducts(ps => ps.filter(p => p._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally { setDeleting(null) }
  }

  return (
    <SellerLayout>
      <div className="space-y-6 page-enter">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">My Products</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} products listed</p>
          </div>
          <Link to="/seller/products/add" className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus size={16}/> Add Product
          </Link>
        </div>

        {loading ? <PageLoader /> : products.length === 0 ? (
          <div className="card text-center py-20">
            <p className="text-5xl mb-4">🍬</p>
            <h3 className="font-display text-xl font-bold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-400 mb-6">Add your first sweet to start selling!</p>
            <Link to="/seller/products/add" className="btn-primary inline-flex items-center gap-2">
              <FiPlus size={16}/> Add First Product
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-50/60 border-b border-pink-100">
                  <tr className="text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover bg-pink-50 shrink-0"
                            onError={e => e.target.src='https://via.placeholder.com/44?text=🍬'}/>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1 max-w-[160px]">{p.name}</p>
                            <div className="flex gap-1 mt-0.5">
                              {p.isFeatured   && <span className="badge bg-pink-100 text-pink-600 text-[9px]">Featured</span>}
                              {p.isBestSeller && <span className="badge bg-amber-100 text-amber-700 text-[9px]">Best Seller</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{p.category}</td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-900 text-sm">₹{p.price}</span>
                        {p.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{p.originalPrice}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge text-xs font-semibold ${
                          p.stock === 0  ? 'bg-red-50 text-red-600' :
                          p.stock <= 5   ? 'bg-orange-50 text-orange-600' :
                                           'bg-green-50 text-green-700'
                        }`}>
                          {p.stock === 0 ? 'Out of Stock' : p.stock <= 5
                            ? <><FiAlertTriangle size={10} className="inline mr-0.5"/>{p.stock} left</>
                            : `${p.stock} units`}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className="text-amber-500 font-semibold">★ {p.rating?.toFixed(1) || '–'}</span>
                        <span className="text-gray-400 text-xs ml-1">({p.numReviews})</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/seller/products/edit/${p._id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                            <FiEdit2 size={14}/>
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deleting === p._id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
                          >
                            <FiTrash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
