import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import API from '../../utils/axios'
import SellerLayout from '../../components/seller/SellerLayout'
import toast from 'react-hot-toast'
import { FiSave, FiLock } from 'react-icons/fi'

export default function SellerProfile() {
  const { user, updateUser } = useAuthStore()
  const [tab,    setTab]    = useState('profile')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name:            user?.name            || '',
    phone:           user?.phone           || '',
    shopName:        user?.shopName        || '',
    shopDescription: user?.shopDescription || '',
    address: {
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      pincode: user?.address?.pincode || '',
    },
  })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await API.put('/user/profile', form)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setSaving(false) }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    setSaving(true)
    try {
      await API.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setSaving(false) }
  }

  return (
    <SellerLayout>
      <div className="max-w-2xl space-y-6 page-enter">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">Seller Profile</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-pink-100">
          {[['profile','Profile & Shop'],['password','Password']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${
                tab === val ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>{label}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="card p-6 animate-fade-in">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-pink-50">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold shadow-pink-md">
                {user?.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{user?.shopName || user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <span className="badge bg-pink-100 text-pink-700 text-xs mt-1">Seller</span>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Full Name</label>
                  <input className="input-field" value={form.name} onChange={e => up('name', e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Phone</label>
                  <input className="input-field" value={form.phone} onChange={e => up('phone', e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Shop Name</label>
                  <input className="input-field" value={form.shopName} onChange={e => up('shopName', e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">City</label>
                  <input className="input-field" value={form.address.city}
                    onChange={e => up('address', { ...form.address, city: e.target.value })}/>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Shop Description</label>
                <textarea rows={3} className="input-field resize-none" value={form.shopDescription}
                  onChange={e => up('shopDescription', e.target.value)}
                  placeholder="Tell customers about your shop..."/>
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                <FiSave size={16}/>{saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'password' && (
          <div className="card p-6 animate-fade-in">
            <form onSubmit={savePassword} className="space-y-4 max-w-sm">
              {['currentPassword','newPassword','confirm'].map((field, i) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    {i === 0 ? 'Current Password' : i === 1 ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <input type="password" required className="input-field"
                    value={pwForm[field]}
                    onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}/>
                </div>
              ))}
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                <FiLock size={16}/>{saving ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
