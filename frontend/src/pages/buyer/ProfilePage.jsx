import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import API from '../../utils/axios'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiLock, FiSave } from 'react-icons/fi'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [tab,  setTab]  = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: {
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      pincode: user?.address?.pincode || '',
    },
  })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await API.put('/user/profile', profile)
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">My Profile 👤</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-pink-100">
        {[['profile','Profile'],['password','Password']].map(([val, label]) => (
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold shadow-pink-md">
              {user?.name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="badge bg-pink-100 text-pink-700 text-xs mt-1 capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5"><FiUser size={12}/> Full Name</label>
                <input className="input-field" value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5"><FiMail size={12}/> Email</label>
                <input className="input-field bg-gray-50 cursor-not-allowed" value={user?.email} readOnly/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5"><FiPhone size={12}/> Phone</label>
                <input className="input-field" value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5"><FiMapPin size={12}/> Street</label>
                <input className="input-field" value={profile.address.street}
                  onChange={e => setProfile(p => ({ ...p, address: { ...p.address, street: e.target.value } }))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">City</label>
                <input className="input-field" value={profile.address.city}
                  onChange={e => setProfile(p => ({ ...p, address: { ...p.address, city: e.target.value } }))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">State</label>
                <input className="input-field" value={profile.address.state}
                  onChange={e => setProfile(p => ({ ...p, address: { ...p.address, state: e.target.value } }))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Pincode</label>
                <input className="input-field" value={profile.address.pincode}
                  onChange={e => setProfile(p => ({ ...p, address: { ...p.address, pincode: e.target.value } }))}/>
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-60">
              <FiSave size={16}/>{saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-6 animate-fade-in">
          <form onSubmit={savePassword} className="space-y-4 max-w-sm">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5"><FiLock size={12}/> Current Password</label>
              <input type="password" required className="input-field"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">New Password</label>
              <input type="password" required minLength={6} className="input-field"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Confirm New Password</label>
              <input type="password" required className="input-field"
                value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}/>
            </div>
            <button type="submit" disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-60">
              <FiLock size={16}/>{saving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
