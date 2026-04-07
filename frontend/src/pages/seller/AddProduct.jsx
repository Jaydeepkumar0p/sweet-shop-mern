import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/axios'
import SellerLayout from '../../components/seller/SellerLayout'
import toast from 'react-hot-toast'
import { FiUpload, FiX } from 'react-icons/fi'

const CATEGORIES = ['Chocolates','Mithai','Cakes','Cookies','Candies','Ice Cream','Dry Fruits','Gift Boxes','Others']

export default function AddProduct() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: '', stock: '', weight: '', tags: '',
    isFeatured: false, isBestSeller: false,
  })

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) { toast.error('Please upload a product image'); return }
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('image', imageFile)

    try {
      await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product added successfully! 🍬')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally { setSaving(false) }
  }

  return (
    <SellerLayout>
      <div className="max-w-3xl space-y-6 page-enter">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to list your sweet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Product Image *</h2>
            <div
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                preview ? 'border-pink-300' : 'border-pink-200 hover:border-pink-400'
              }`}
            >
              {preview ? (
                <div className="relative aspect-video">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover"/>
                  <button type="button"
                    onClick={() => { setPreview(null); setImageFile(null) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white shadow-sm">
                    <FiX size={16}/>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-14 cursor-pointer gap-3 text-gray-400 hover:text-pink-500 transition-colors">
                  <FiUpload size={28}/>
                  <div className="text-center">
                    <p className="font-medium text-sm">Click to upload image</p>
                    <p className="text-xs mt-1">JPG, PNG, WebP · Max 5MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage}/>
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">Basic Information</h2>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Product Name *</label>
              <input required className="input-field" placeholder="e.g., Kaju Katli Premium"
                value={form.name} onChange={e => up('name', e.target.value)}/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description *</label>
              <textarea required rows={4} className="input-field resize-none"
                placeholder="Describe your sweet – ingredients, taste, occasion..."
                value={form.description} onChange={e => up('description', e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Category *</label>
                <select required className="input-field cursor-pointer"
                  value={form.category} onChange={e => up('category', e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Weight / Size</label>
                <input className="input-field" placeholder="e.g., 250g, 500ml"
                  value={form.weight} onChange={e => up('weight', e.target.value)}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Tags</label>
                <input className="input-field" placeholder="festive, gift, healthy"
                  value={form.tags} onChange={e => up('tags', e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">Pricing & Stock</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Selling Price (₹) *</label>
                <input type="number" required min="1" className="input-field" placeholder="299"
                  value={form.price} onChange={e => up('price', e.target.value)}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Original Price (₹)</label>
                <input type="number" min="0" className="input-field" placeholder="399"
                  value={form.originalPrice} onChange={e => up('originalPrice', e.target.value)}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Stock Quantity *</label>
                <input type="number" required min="0" className="input-field" placeholder="100"
                  value={form.stock} onChange={e => up('stock', e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Product Flags</h2>
            <div className="flex gap-6">
              {[['isFeatured','Featured Product'],['isBestSeller','Best Seller']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => up(key, !form[key])}
                    className={`w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer ${
                      form[key] ? 'bg-pink-500' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                      form[key] ? 'left-5.5 translate-x-0.5' : 'left-0.5'
                    }`}/>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/seller/products')}
              className="btn-outline flex-1 py-3.5">Cancel</button>
            <button type="submit" disabled={saving}
              className="btn-primary flex-1 py-3.5 disabled:opacity-60">
              {saving ? 'Uploading & Saving...' : '🍬 Add Product'}
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  )
}
