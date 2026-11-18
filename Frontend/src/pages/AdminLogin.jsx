import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { loginAdmin, getStoredAdmin } from '../services/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (getStoredAdmin()) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      return setError('Enter both your admin email and password.')
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return setError('Enter a valid email address.')
    }

    setLoading(true)
    try {
      const res = await loginAdmin({ email: email.trim(), password })
      if (res.success) {
        navigate('/admin/dashboard')
      } else {
        setError(res.message || 'Login failed. Check your credentials.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f7f8f2] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-[#174c48] p-12 text-white lg:flex">
        <Link to="/" className="text-[1.65rem] font-black tracking-[-0.06em]">
          Home<span className="text-[#f6c453]">Ease</span>
        </Link>
        <div>
          <h1 className="max-w-md text-4xl font-black leading-tight tracking-[-0.03em]">
            Every booking, provider and complaint in one place.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#b8d5c9]">
            Approve providers, watch bookings and resolve complaints from the admin panel.
          </p>
        </div>
        <p className="text-xs text-[#b8d5c9]">© 2026 HomeEase</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-block text-sm font-bold text-[#174c48] transition hover:text-[#e76f3c]">
            ← Back to Home
          </Link>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-[#dce6df] bg-white p-8 shadow-xl shadow-[#174c48]/5"
          >
            <h2 className="text-2xl font-black text-[#173c3a]">Admin sign in</h2>
            <p className="mt-1 text-sm text-[#55706d]">Use your administrator account to continue.</p>

            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <label htmlFor="admin-email" className="mt-6 block text-xs font-bold text-[#173c3a]">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@homeease.com"
              className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm outline-none transition focus:border-[#174c48] focus:ring-2 focus:ring-[#174c48]/20"
            />

            <label htmlFor="admin-password" className="mt-4 block text-xs font-bold text-[#173c3a]">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#174c48] focus:ring-2 focus:ring-[#174c48]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#174c48]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#174c48] py-3 text-sm font-black text-white shadow-md transition hover:bg-[#0f3936] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="mt-4 text-center text-[11px] text-[#55706d]">
              Demo login while the backend is offline: admin@homeease.com / admin123
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}