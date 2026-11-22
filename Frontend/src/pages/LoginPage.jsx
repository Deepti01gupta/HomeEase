import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  loginProvider,
  getStoredProvider,
  loginCustomer,
  getStoredCustomer,
  clearCustomerSession,
} from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const currentProvider = getStoredProvider()
  const currentCustomer = getStoredCustomer()

  const [role, setRole] = useState('provider') // 'provider' or 'customer'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      return setError('Please enter both email and password.')
    }

    setLoading(true)

    try {
      const res = role === 'provider'
        ? await loginProvider({ email: email.trim(), password, role })
        : await loginCustomer({ email: email.trim(), password })

      if (res.success) {
        if (role === 'provider') {
          navigate('/provider/dashboard')
        } else {
          navigate('/customer/profile')
        }
      } else {
        setError(res.message || 'Login failed. Please verify credentials.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f2] px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Top Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-sm font-bold text-[#174c48] transition hover:text-[#e76f3c]"
          >
            ← Back to Home
          </Link>
          <span className="text-xs font-semibold text-[#55706d]">Secure Login</span>
        </div>

        {/* Notice if already logged in */}
        {currentCustomer && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            <p>Currently signed in as <strong>{currentCustomer.name}</strong></p>
            <div className="mt-2 flex gap-3">
              <Link to="/customer/profile" className="font-bold underline">Go to profile</Link>
              <button type="button" onClick={clearCustomerSession} className="font-bold text-red-700">Clear session</button>
            </div>
          </div>
        )}

        {currentProvider && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            <p>
              ✓ Currently logged in as <strong className="font-bold">{currentProvider.name}</strong> ({currentProvider.email})
            </p>
            <div className="mt-2 flex gap-3">
              <Link
                to="/provider/dashboard"
                className="font-bold text-[#174c48] underline hover:text-[#e76f3c]"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-xl shadow-[#174c48]/5 sm:p-8">
          <div className="text-center">
            <Link to="/" className="text-2xl font-black tracking-[-0.06em] text-[#174c48]">
              Home<span className="text-[#e76f3c]">Ease</span>
              <span className="ml-1 text-xs text-[#e76f3c]">●</span>
            </Link>
            <h1 className="mt-4 text-2xl font-black text-[#173c3a]">Sign in to your account</h1>
            <p className="mt-1 text-xs text-[#55706d]">
              Enter the email & password you used during registration
            </p>
          </div>

          {/* Role selector tab */}
          <div className="mt-6 flex rounded-xl bg-[#f7f8f2] p-1 border border-[#dce6df]">
            <button
              type="button"
              onClick={() => {
                setRole('provider')
                setError('')
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                role === 'provider'
                  ? 'bg-[#174c48] text-white shadow'
                  : 'text-[#55706d] hover:text-[#174c48]'
              }`}
            >
              🛠️ Service Provider
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('customer')
                setError('')
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                role === 'customer'
                  ? 'bg-[#174c48] text-white shadow'
                  : 'text-[#55706d] hover:text-[#174c48]'
              }`}
            >
              🏠 Customer
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#173c3a]">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#e76f3c] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-3 text-sm text-[#173c3a] placeholder-[#8ea39f] focus:border-[#e76f3c] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#174c48] py-3.5 text-sm font-black text-white shadow-md transition hover:bg-[#0f3936] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : `Sign in as ${role === 'provider' ? 'Service Provider' : 'Customer'}`}
            </button>
          </form>

          <div className="mt-6 border-t border-[#eef2ee] pt-4 text-center">
            <p className="text-xs text-[#55706d]">
              New to HomeEase?{' '}
              <Link to="/customer/register" className="font-bold text-[#e76f3c] underline">
                Create a customer account
              </Link>
              <span className="mx-2 text-[#dce6df]">|</span>
              <Link to="/provider/register" className="font-bold text-[#174c48] underline">
                Provider
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
