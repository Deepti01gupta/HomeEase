import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerProvider } from '../services/api'

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

export default function ProviderRegister() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: '',
    hourlyRate: '',
    bio: '',
  })

  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkill, setCustomSkill] = useState('')

  const [selectedAreas, setSelectedAreas] = useState([])
  const [customArea, setCustomArea] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Toggle or add skills
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const addCustomSkill = (e) => {
    e.preventDefault()
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove))
  }

  // Toggle or add service areas
  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const addCustomArea = (e) => {
    e.preventDefault()
    if (customArea.trim() && !selectedAreas.includes(customArea.trim())) {
      setSelectedAreas((prev) => [...prev, customArea.trim()])
      setCustomArea('')
    }
  }

  const removeArea = (areaToRemove) => {
    setSelectedAreas((prev) => prev.filter((a) => a !== areaToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim()) return setError('Please enter your full name.')
    if (!formData.phone.trim()) return setError('Please enter your phone number.')
    if (!formData.email.trim()) return setError('Please enter your email.')
    if (!formData.password.trim() || formData.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    if (selectedSkills.length === 0) {
      return setError('Please select at least one skill.')
    }
    if (selectedAreas.length === 0) {
      return setError('Please select at least one service area.')
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        skills: selectedSkills,
        serviceAreas: selectedAreas,
      }

      const res = await registerProvider(payload)
      if (res.success) {
        setSuccess('Registration successful! Redirecting to your dashboard...')
        setTimeout(() => {
          navigate('/provider/dashboard')
        }, 1200)
      } else {
        setError(res.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f2] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb / Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-sm font-bold text-[#174c48] transition hover:text-[#e76f3c]"
          >
            ← Back to Home
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#55706d]">
            Service Provider Portal
          </span>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-xl shadow-[#174c48]/5 sm:p-10">
          <div className="border-b border-[#eef2ee] pb-6">
            <span className="inline-block rounded-full bg-[#f6c453]/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#174c48]">
              Join the Network
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#173c3a] sm:text-4xl">
              Service Provider Registration
            </h1>
            <p className="mt-2 text-sm text-[#55706d]">
              Showcase your expertise, set your rates, and start receiving job requests in your service areas.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Section 1: Basic Information */}
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-[#174c48]">
                1. Basic Information
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
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
                    placeholder="e.g. Marcus Vance"
                    className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
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
                    placeholder="e.g. +1 (555) 345-6789"
                    className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. marcus@vancepro.com"
                    className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Skills & Trade */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black uppercase tracking-wider text-[#174c48]">
                  2. Your Skills & Specializations *
                </h2>
                <span className="text-xs font-bold text-[#e76f3c]">
                  {selectedSkills.length} selected
                </span>
              </div>
              <p className="mt-1 text-xs text-[#55706d]">
                Click to select your primary trades or add custom specialties.
              </p>

              {/* Skill chips */}
              <div className="mt-3.5 flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill)
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        isSelected
                          ? 'bg-[#174c48] text-white shadow-sm'
                          : 'border border-[#dce6df] bg-[#f7f8f2] text-[#55706d] hover:border-[#174c48] hover:text-[#174c48]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  )
                })}
              </div>

              {/* Custom skill adder */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill (e.g. Solar Inverter Setup)"
                  className="w-full max-w-sm rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2 text-xs text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill(e)}
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="rounded-xl bg-[#174c48] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0f3936]"
                >
                  Add
                </button>
              </div>

              {/* Active selected list badges */}
              {selectedSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-[#55706d] mr-1">Selected:</span>
                  {selectedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-md bg-[#eaf3f0] px-2.5 py-1 text-xs font-bold text-[#174c48]"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-[#e76f3c] hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Experience & Service Areas */}
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-[#174c48]">
                3. Experience & Coverage Areas
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                    Years of Experience *
                  </label>
                  <select
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                  >
                    <option value="">Select experience level...</option>
                    <option value="1-2 years">1-2 years (Apprentice / Junior)</option>
                    <option value="3-5 years">3-5 years (Experienced Pro)</option>
                    <option value="6-9 years">6-9 years (Senior Specialist)</option>
                    <option value="10+ years">10+ years (Master Craftsman)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                    Base Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    min={10}
                    max={500}
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 45"
                    max={300}
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Areas selection */}
              <div className="mt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                  Service Areas / Neighborhoods *
                </label>
                <p className="mt-1 text-xs text-[#55706d]">
                  Select the regions you are willing to travel to for appointments.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR_AREAS.map((area) => {
                    const isSelected = selectedAreas.includes(area)
                    return (
                      <button
                        type="button"
                        key={area}
                        onClick={() => toggleArea(area)}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? 'bg-[#e76f3c] text-white shadow-sm'
                            : 'border border-[#dce6df] bg-[#f7f8f2] text-[#55706d] hover:border-[#e76f3c] hover:text-[#e76f3c]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {area}
                      </button>
                    )
                  })}
                </div>

                {/* Custom area adder */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    placeholder="Add city or postal code (e.g. South Bay)"
                    className="w-full max-w-sm rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2 text-xs text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomArea(e)}
                  />
                  <button
                    type="button"
                    onClick={addCustomArea}
                    className="rounded-xl bg-[#e76f3c] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#cf5c2e]"
                  >
                    Add Area
                  </button>
                </div>

                {selectedAreas.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-[#55706d] mr-1">Active Areas:</span>
                    {selectedAreas.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1 rounded-md bg-[#fff2ec] px-2.5 py-1 text-xs font-bold text-[#e76f3c]"
                      >
                        📍 {a}
                        <button
                          type="button"
                          onClick={() => removeArea(a)}
                          className="text-[#e76f3c] hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Bio / Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                Professional Bio & Description
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Briefly describe your certifications, specialties, and customer satisfaction guarantee..."
                className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="border-t border-[#eef2ee] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#55706d]">
                Already have a provider account?{' '}
                <Link to="/login" className="font-bold text-[#e76f3c] underline">
                  Log in here
                </Link>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-full bg-[#174c48] px-8 py-4 text-sm font-black text-white shadow-lg shadow-[#174c48]/20 transition hover:-translate-y-0.5 hover:bg-[#0f3936] disabled:opacity-50"
              >
                {loading ? 'Registering Provider...' : 'Create Provider Profile ↗'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
