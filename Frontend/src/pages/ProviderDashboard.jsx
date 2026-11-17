import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getStoredProvider,
  setStoredProvider,
  getProviderDashboard,
  clearStoredProvider,
} from '../services/api'
import ProfileForm from '../components/ProfileForm'

export default function ProviderDashboard() {
  const navigate = useNavigate()
  const [provider, setProvider] = useState(getStoredProvider())
  const [dashboardData, setDashboardData] = useState(null)
  const [activeTab, setActiveTab] = useState('jobs') // 'jobs', 'profile', 'coverage'
  const [jobsList, setJobsList] = useState([])
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const current = getStoredProvider()
    setProvider(current)

    if (current && current._id) {
      getProviderDashboard(current._id).then((data) => {
        setDashboardData(data)
        setJobsList(data.jobs || [])
      })
    }
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Handle job status change (accept / complete)
  const handleUpdateJobStatus = (jobId, newStatus) => {
    setJobsList((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
    )
    showToast(`Job ${jobId} status updated to: ${newStatus.toUpperCase()}`)
  }

  // Handle quick status toggle (available / busy / offline)
  const handleStatusToggle = (newStatus) => {
    if (!provider) return
    const updated = { ...provider, status: newStatus }
    setProvider(updated)
    setStoredProvider(updated)
    showToast(`Your status is now ${newStatus.toUpperCase()}`)
  }

  const handleLogout = () => {
    clearStoredProvider()
    setProvider(null)
    navigate('/login')
  }

  // If no provider is logged in, show access card with zero dummy data
  if (!provider) {
    return (
      <div className="min-h-screen bg-[#f7f8f2] px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#dce6df] bg-white p-8 text-center shadow-xl shadow-[#174c48]/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6c453]/30 text-3xl">
            🔒
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#173c3a]">Provider Portal</h2>
          <p className="mt-2 text-xs text-[#55706d] leading-5">
            You are currently not signed in. Please sign in with your provider account or register as a new service provider to access your dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="rounded-full bg-[#174c48] py-3 text-xs font-black text-white shadow-md transition hover:bg-[#0f3936]"
            >
              Sign In to Provider Account
            </Link>
            <Link
              to="/provider/register"
              className="rounded-full border border-[#174c48] py-3 text-xs font-bold text-[#174c48] transition hover:bg-[#174c48] hover:text-white"
            >
              Register as New Provider
            </Link>
            <Link to="/" className="text-xs text-[#55706d] hover:text-[#e76f3c] mt-2">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    completedJobs: provider.completedJobs || 0,
    activeJobs: jobsList.filter((j) => j.status === 'confirmed').length,
    pendingRequests: jobsList.filter((j) => j.status === 'pending').length,
    rating: provider.rating || 5.0,
    totalEarnings: provider.earnings || 0,
  }

  return (
    <div className="min-h-screen bg-[#f7f8f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#174c48] px-5 py-3 text-xs font-bold text-white shadow-2xl animate-bounce">
            ✓ {toastMessage}
          </div>
        )}

        {/* Dashboard Top Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#dce6df] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xl font-black text-[#174c48]">
                Home<span className="text-[#e76f3c]">Ease</span>
              </Link>
              <span className="text-xs font-bold text-[#8ea39f]">/</span>
              <span className="rounded-full bg-[#f6c453]/40 px-2.5 py-0.5 text-xs font-bold text-[#174c48]">
                Provider Hub
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-[#173c3a] sm:text-3xl">
              Welcome back, {provider.name || 'Service Provider'} 👋
            </h1>
            <p className="text-xs text-[#55706d] mt-1">
              Manage your incoming booking requests, profile details, and coverage zones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Status Selector */}
            <div className="flex items-center rounded-full bg-white p-1 border border-[#dce6df] shadow-sm">
              {['available', 'busy', 'offline'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusToggle(st)}
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition ${
                    provider.status === st
                      ? st === 'available'
                        ? 'bg-emerald-500 text-white'
                        : st === 'busy'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-500 text-white'
                      : 'text-[#55706d] hover:text-[#174c48]'
                  }`}
                >
                  ● {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#dce6df] bg-white px-4 py-1.5 text-xs font-bold text-[#55706d] transition hover:border-red-400 hover:text-red-600"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#55706d]">
                Active Jobs
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf3f0] text-sm text-[#174c48]">
                ⚡
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#173c3a]">{stats.activeJobs}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">
              {stats.pendingRequests} request(s) awaiting response
            </p>
          </div>

          <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#55706d]">
                Jobs Completed
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fef5ee] text-sm text-[#e76f3c]">
                ✓
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#173c3a]">{stats.completedJobs}</p>
            <p className="mt-1 text-xs text-[#55706d]">Verified appointments</p>
          </div>

          <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#55706d]">
                Estimated Earnings
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fffbf0] text-sm text-[#b47a16]">
                $
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#173c3a]">${stats.totalEarnings}</p>
            <p className="mt-1 text-xs text-[#55706d]">
              Base rate: {provider.hourlyRate ? `$${provider.hourlyRate}/hr` : 'Not set'}
            </p>
          </div>

          <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#55706d]">
                Customer Rating
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff2ec] text-sm text-[#e76f3c]">
                ★
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#173c3a]">{stats.rating} / 5.0</p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">Active Provider</p>
          </div>
        </div>

        {/* Quick Profile Summary Badge Card */}
        <div className="mt-6 rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174c48] text-2xl font-black text-white shadow-md">
                {provider.name ? provider.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#173c3a]">{provider.name || 'Provider'}</h2>
                  {provider.experience && (
                    <span className="rounded-full bg-[#eaf3f0] px-2.5 py-0.5 text-xs font-bold text-[#174c48]">
                      {provider.experience}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#55706d] mt-0.5">
                  📞 {provider.phone || 'No phone set'} • ✉️ {provider.email || 'No email set'}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {(provider.skills || []).length > 0 ? (
                    provider.skills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded-md bg-[#f7f8f2] border border-[#dce6df] px-2 py-0.5 text-[11px] font-bold text-[#174c48]"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#8ea39f]">No skills listed yet</span>
                  )}

                  {(provider.serviceAreas || []).length > 0 ? (
                    provider.serviceAreas.map((ar) => (
                      <span
                        key={ar}
                        className="rounded-md bg-[#fff2ec] px-2 py-0.5 text-[11px] font-bold text-[#e76f3c]"
                      >
                        📍 {ar}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#8ea39f] ml-2">No areas listed yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="rounded-full bg-[#174c48] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0f3936]"
              >
                ✏️ Edit Profile Form
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mt-8">
          <div className="flex border-b border-[#dce6df] gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                activeTab === 'jobs'
                  ? 'border-[#e76f3c] text-[#e76f3c]'
                  : 'border-transparent text-[#55706d] hover:text-[#174c48]'
              }`}
            >
              📋 Service Requests & Jobs ({jobsList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                activeTab === 'profile'
                  ? 'border-[#e76f3c] text-[#e76f3c]'
                  : 'border-transparent text-[#55706d] hover:text-[#174c48]'
              }`}
            >
              ⚙️ Provider Profile Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('coverage')}
              className={`pb-3 text-sm font-bold transition border-b-2 ${
                activeTab === 'coverage'
                  ? 'border-[#e76f3c] text-[#e76f3c]'
                  : 'border-transparent text-[#55706d] hover:text-[#174c48]'
              }`}
            >
              🗺️ Service Areas & Rates
            </button>
          </div>

          {/* TAB 1: Job Requests List */}
          {activeTab === 'jobs' && (
            <div className="mt-6 space-y-4">
              {jobsList.length === 0 ? (
                <div className="rounded-3xl border border-[#dce6df] bg-white p-12 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f8f2] text-2xl">
                    📋
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[#173c3a]">No Job Requests Yet</h3>
                  <p className="mt-1 text-xs text-[#55706d] max-w-sm mx-auto">
                    When homeowners in your selected service areas request appointments for your trade skills, new bookings will appear here.
                  </p>
                </div>
              ) : (
                jobsList.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm transition hover:border-[#174c48]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black tracking-wider text-[#e76f3c]">
                            {job.id}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                              job.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : job.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            ● {job.status}
                          </span>
                          <span className="text-xs text-[#55706d]">• {job.date}</span>
                        </div>
                        <h3 className="mt-2 text-lg font-black text-[#173c3a]">{job.service}</h3>
                        <p className="mt-1 text-xs text-[#55706d]">
                          Customer: <strong className="text-[#173c3a]">{job.customerName}</strong> •{' '}
                          📍 {job.address} • 📞 {job.phone}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-3">
                        <div>
                          <span className="text-xs text-[#55706d]">Estimated Pay</span>
                          <p className="text-xl font-black text-[#174c48]">${job.estimatedPay}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateJobStatus(job.id, 'confirmed')}
                              className="rounded-full bg-[#174c48] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#0f3936]"
                            >
                              Accept Job
                            </button>
                          )}
                          {job.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateJobStatus(job.id, 'completed')}
                              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                            >
                              Mark as Done ✓
                            </button>
                          )}
                          {job.status !== 'completed' && (
                            <a
                              href={`tel:${job.phone}`}
                              className="rounded-full border border-[#dce6df] px-3.5 py-1.5 text-xs font-bold text-[#55706d] transition hover:bg-[#f7f8f2]"
                            >
                              Call Customer
                            </a>
                          )}
                          {job.status === 'completed' && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                              Completed & Paid
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Embedded Profile Form */}
          {activeTab === 'profile' && (
            <div className="mt-6 rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 border-b border-[#eef2ee] pb-4">
                <h2 className="text-xl font-black text-[#173c3a]">Edit Provider Profile</h2>
                <p className="mt-1 text-xs text-[#55706d]">
                  Update your contact phone, skill categories, experience years, and active service areas.
                </p>
              </div>
              <ProfileForm
                onProfileUpdated={(updated) => {
                  setProvider(updated)
                  showToast('Provider profile updated successfully!')
                }}
              />
            </div>
          )}

          {/* TAB 3: Coverage & Rates */}
          {activeTab === 'coverage' && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
                <h3 className="text-base font-black text-[#173c3a]">Active Service Areas</h3>
                <p className="mt-1 text-xs text-[#55706d]">
                  You are receiving alerts and booking requests for these zones:
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(provider.serviceAreas || []).length > 0 ? (
                    provider.serviceAreas.map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-2 rounded-2xl border border-[#dce6df] bg-[#f7f8f2] px-4 py-2.5 text-xs font-bold text-[#173c3a]"
                      >
                        <span className="text-[#e76f3c]">📍</span>
                        {area}
                        <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                          Active
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#8ea39f]">No service areas selected yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-[#dce6df] bg-white p-6 shadow-sm">
                <h3 className="text-base font-black text-[#173c3a]">Trade Skills & Rates</h3>
                <p className="mt-1 text-xs text-[#55706d]">Your registered professional specialties:</p>
                <div className="mt-4 space-y-2">
                  {(provider.skills || []).length > 0 ? (
                    provider.skills.map((sk) => (
                      <div
                        key={sk}
                        className="flex items-center justify-between rounded-xl bg-[#f7f8f2] px-4 py-2 text-xs font-bold text-[#173c3a]"
                      >
                        <span>🛠️ {sk}</span>
                        <span className="text-[#174c48]">
                          {provider.hourlyRate ? `$${provider.hourlyRate}/hr` : 'Not set'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#8ea39f]">No trade skills added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
