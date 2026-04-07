import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useProductStore from '../store/productStore'
import ProductCard from '../components/common/ProductCard'
import { ProductSkeleton } from '../components/common/Loader'
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'

const CATEGORIES = ['All','Chocolates','Mithai','Cakes','Cookies','Candies','Ice Cream','Dry Fruits','Gift Boxes','Others']
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
]

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const { products, total, pages, loading, fetchProducts } = useProductStore()
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    keyword:  params.get('keyword')  || '',
    category: params.get('category') || 'All',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    rating:   params.get('rating')   || '',
    sort:     params.get('sort')     || 'newest',
    page:     Number(params.get('page') || 1),
  })

  useEffect(() => {
    const q = {}
    if (filters.keyword)  q.keyword  = filters.keyword
    if (filters.category && filters.category !== 'All') q.category = filters.category
    if (filters.minPrice) q.minPrice = filters.minPrice
    if (filters.maxPrice) q.maxPrice = filters.maxPrice
    if (filters.rating)   q.rating   = filters.rating
    if (filters.sort)     q.sort     = filters.sort
    q.page  = filters.page
    q.limit = 12
    setParams(q)
    fetchProducts(q)
  }, [filters])

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val, page: key !== 'page' ? 1 : val }))
  const resetFilters = () => setFilters({ keyword:'', category:'All', minPrice:'', maxPrice:'', rating:'', sort:'newest', page:1 })

  const hasActiveFilters = filters.category !== 'All' || filters.minPrice || filters.maxPrice || filters.rating

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-1">Browse Sweets 🍬</h1>
        <p className="text-gray-500">{total} sweets available</p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            className="input-field pl-11"
            placeholder="Search sweets, chocolates, mithai..."
            value={filters.keyword}
            onChange={e => update('keyword', e.target.value)}
          />
        </div>
        <select
          className="input-field w-auto min-w-[180px] cursor-pointer"
          value={filters.sort}
          onChange={e => update('sort', e.target.value)}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
            hasActiveFilters ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-pink-100 text-gray-600 hover:border-pink-300'
          }`}
        >
          <FiFilter size={16}/> Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-pink-500"/>}
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => update('category', cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              filters.category === cat
                ? 'bg-pink-500 text-white shadow-pink-sm'
                : 'bg-white border border-pink-100 text-gray-600 hover:border-pink-300 hover:text-pink-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-pink-50 rounded-2xl p-5 mb-6 border border-pink-100 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Filters</h3>
            <button onClick={resetFilters} className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1">
              <FiX size={14}/> Reset All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Min Price (₹)</label>
              <input type="number" className="input-field text-sm" placeholder="0"
                value={filters.minPrice} onChange={e => update('minPrice', e.target.value)}/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Max Price (₹)</label>
              <input type="number" className="input-field text-sm" placeholder="10000"
                value={filters.maxPrice} onChange={e => update('maxPrice', e.target.value)}/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Minimum Rating</label>
              <select className="input-field text-sm cursor-pointer"
                value={filters.rating} onChange={e => update('rating', e.target.value)}>
                <option value="">Any Rating</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
                <option value="2">2★ & above</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(12).fill(0).map((_,i) => <ProductSkeleton key={i}/>)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🍬</p>
          <h3 className="font-display text-xl font-bold text-gray-700 mb-2">No sweets found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search</p>
          <button onClick={resetFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => update('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-xl border border-pink-100 text-sm font-medium text-gray-600 disabled:opacity-40 hover:border-pink-400 hover:text-pink-600 transition-all"
              >
                ← Prev
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(pg => (
                <button
                  key={pg}
                  onClick={() => update('page', pg)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    pg === filters.page
                      ? 'bg-pink-500 text-white shadow-pink-sm'
                      : 'border border-pink-100 text-gray-600 hover:border-pink-400 hover:text-pink-600'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => update('page', filters.page + 1)}
                disabled={filters.page === pages}
                className="px-4 py-2 rounded-xl border border-pink-100 text-sm font-medium text-gray-600 disabled:opacity-40 hover:border-pink-400 hover:text-pink-600 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
