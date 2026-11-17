import { useState, useEffect } from 'react'
import { getStoredProvider, updateProviderProfile } from '../services/api'

const POPULAR_SKILLS = [
  'Electrician',
  'Plumber',
  'Home cleaning',
  'Carpenter',
  'Appliance repair',
  'Painting',
  'AC & HVAC',
  'Gardening & Lawn',
]

const POPULAR_AREAS = [
  'Downtown',
  'Northside',
  'West End',
  'South Hills',
  'Metro East',
  'Uptown',
  'Suburbs',
]

export default function ProfileForm({ onProfileUpdated }) {
  const [provider, setProvider] = useState(getStoredProvider())
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    phone: provider?.phone || '',
    experience: provider?.experience || '',
    hourlyRate: provider?.hourlyRate || '',
    bio: provider?.bio || '',
    status: provider?.status || 'available',
  })

  const [skills, setSkills] = useState(provider?.skills || [])
  const [customSkill, setCustomSkill] = useState('')

  const [serviceAreas, setServiceAreas] = useState(provider?.serviceAreas || [])
  const [customArea, setCustomArea] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const current = getStoredProvider()
    if (current) {
      setProvider(current)
      setFormData({
        name: current.name || '',
        phone: current.phone || '',
        experience: current.experience || '',
        hourlyRate: current.hourlyRate || '',
        bio: current.bio || '',
        status: current.status || 'available',
      })
      setSkills(current.skills || [])
      setServiceAreas(current.serviceAreas || [])
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Skills handlers
  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const addCustomSkill = (e) => {
    e.preventDefault()
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills((prev) => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  const removeSkill = (s) => {
    setSkills((prev) => prev.filter((item) => item !== s))
  }

  // Service Areas handlers
  const toggleArea = (area) => {
    setServiceAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const addCustomArea = (e) => {
    e.preventDefault()
    if (customArea.trim() && !serviceAreas.includes(customArea.trim())) {
      setServiceAreas((prev) => [...prev, customArea.trim()])
      setCustomArea('')
    }
  }

  const removeArea = (a) => {
    setServiceAreas((prev) => prev.filter((item) => item !== a))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!formData.name.trim()) {
      return setMessage({ type: 'error', text: 'Name cannot be empty.' })
    }
    if (!formData.phone.trim()) {
      return setMessage({ type: 'error', text: 'Phone cannot be empty.' })
    }
    if (skills.length === 0) {
      return setMessage({ type: 'error', text: 'Please add at least one skill.' })
    }
    if (serviceAreas.length === 0) {
      return setMessage({ type: 'error', text: 'Please add at least one service area.' })
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        skills,
        serviceAreas,
      }
      const res = await updateProviderProfile(provider._id, payload)
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        if (onProfileUpdated) onProfileUpdated(res.provider)
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update profile.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message.text && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message.type === 'success' ? '✓ ' : '⚠️ '}
          {message.text}
        </div>
      )}

      {/* Basic Contact Info */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Alex Rivera"
            className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2.5 text-sm text-[#173c3a] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2.5 text-sm text-[#173c3a] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
            Experience Level *
          </label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2.5 text-sm text-[#173c3a] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
          >
            <option value="">Select experience level...</option>
            <option value="1-2 years">1-2 years (Junior Pro)</option>
            <option value="3-5 years">3-5 years (Experienced)</option>
            <option value="6-9 years">6-9 years (Senior Specialist)</option>
            <option value="10+ years">10+ years (Master Technician)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
            Hourly Rate ($/hr)
          </label>
          <input
            type="number"
            name="hourlyRate"
            min={10}
            max={500}
            value={formData.hourlyRate}
            onChange={handleInputChange}
            placeholder="e.g. 50"
            className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2.5 text-sm text-[#173c3a] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Availability Status */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
          Availability Status
        </label>
        <div className="mt-2 flex gap-3">
          {['available', 'busy', 'offline'].map((st) => (
            <label
              key={st}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold capitalize transition ${
                formData.status === st
                  ? 'border-[#174c48] bg-[#eaf3f0] text-[#174c48]'
                  : 'border-[#dce6df] bg-[#f7f8f2] text-[#55706d]'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={st}
                checked={formData.status === st}
                onChange={handleInputChange}
                className="hidden"
              />
              <span
                className={`h-2 w-2 rounded-full ${
                  st === 'available'
                    ? 'bg-emerald-500'
                    : st === 'busy'
                    ? 'bg-amber-500'
                    : 'bg-gray-400'
                }`}
              />
              {st}
            </label>
          ))}
        </div>
      </div>

      {/* Skills Field */}
      <div className="border-t border-[#eef2ee] pt-5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
            Skills & Trade Specialties *
          </label>
          <span className="text-xs font-bold text-[#e76f3c]">{skills.length} active</span>
        </div>
        <p className="mt-1 text-xs text-[#55706d]">
          Select trade capabilities you can perform for HomeEase clients.
        </p>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {POPULAR_SKILLS.map((sk) => {
            const has = skills.includes(sk)
            return (
              <button
                type="button"
                key={sk}
                onClick={() => toggleSkill(sk)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  has
                    ? 'bg-[#174c48] text-white shadow-sm'
                    : 'border border-[#dce6df] bg-[#f7f8f2] text-[#55706d] hover:border-[#174c48]'
                }`}
              >
                {has ? '✓ ' : '+ '}
                {sk}
              </button>
            )
          })}
        </div>

        <div className="mt-2.5 flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Add custom skill..."
            className="w-full max-w-xs rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-3 py-1.5 text-xs text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addCustomSkill(e)}
          />
          <button
            type="button"
            onClick={addCustomSkill}
            className="rounded-xl bg-[#174c48] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#0f3936]"
          >
            Add
          </button>
        </div>

        {skills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-md bg-[#eaf3f0] px-2.5 py-1 text-xs font-bold text-[#174c48]"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="text-[#e76f3c] hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Service Areas Field */}
      <div className="border-t border-[#eef2ee] pt-5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
            Service Areas & Neighborhoods *
          </label>
          <span className="text-xs font-bold text-[#e76f3c]">{serviceAreas.length} active</span>
        </div>
        <p className="mt-1 text-xs text-[#55706d]">
          Locations where you accept customer appointments.
        </p>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {POPULAR_AREAS.map((ar) => {
            const has = serviceAreas.includes(ar)
            return (
              <button
                type="button"
                key={ar}
                onClick={() => toggleArea(ar)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  has
                    ? 'bg-[#e76f3c] text-white shadow-sm'
                    : 'border border-[#dce6df] bg-[#f7f8f2] text-[#55706d] hover:border-[#e76f3c]'
                }`}
              >
                {has ? '✓ ' : '+ '}
                {ar}
              </button>
            )
          })}
        </div>

        <div className="mt-2.5 flex gap-2">
          <input
            type="text"
            value={customArea}
            onChange={(e) => setCustomArea(e.target.value)}
            placeholder="Add neighborhood or city..."
            className="w-full max-w-xs rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-3 py-1.5 text-xs text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addCustomArea(e)}
          />
          <button
            type="button"
            onClick={addCustomArea}
            className="rounded-xl bg-[#e76f3c] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#cf5c2e]"
          >
            Add
          </button>
        </div>

        {serviceAreas.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {serviceAreas.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 rounded-md bg-[#fff2ec] px-2.5 py-1 text-xs font-bold text-[#e76f3c]"
              >
                📍 {a}
                <button
                  type="button"
                  onClick={() => removeArea(a)}
                  className="text-[#e76f3c] hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bio / Summary */}
      <div className="border-t border-[#eef2ee] pt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
          Professional Bio
        </label>
        <textarea
          name="bio"
          rows={3}
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Brief description of your trade certifications and work history..."
          className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2.5 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
        />
      </div>

      {/* Submit Action */}
      <div className="border-t border-[#eef2ee] pt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#174c48] px-7 py-3 text-sm font-black text-white shadow-md transition hover:bg-[#0f3936] disabled:opacity-50"
        >
          {saving ? 'Saving changes...' : 'Save Profile Changes ✓'}
        </button>
      </div>
    </form>
  )
}
