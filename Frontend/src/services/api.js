import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
})

// Local storage session helpers
export const getStoredProvider = () => {
  try {
    const data = localStorage.getItem('homeease_provider')
    if (!data) return null
    const parsed = JSON.parse(data)
    // Clear legacy dummy/prefilled mock data if present
    if (
      parsed._id === 'provider-default' ||
      parsed.email === 'alex.rivera@example.com' ||
      parsed.email === 'alex@example.com'
    ) {
      localStorage.removeItem('homeease_provider')
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export const setStoredProvider = (provider) => {
  try {
    localStorage.setItem('homeease_provider', JSON.stringify(provider))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export const clearStoredProvider = () => {
  try {
    localStorage.removeItem('homeease_provider')
  } catch (err) {
    console.error('Failed to clear localStorage:', err)
  }
}

// Helper to track registered accounts in local mode
const getRegisteredAccounts = () => {
  try {
    const data = localStorage.getItem('homeease_registered_providers')
    if (!data) return []
    const list = JSON.parse(data)
    return list.filter(
      (a) =>
        a._id !== 'provider-default' &&
        a.email !== 'alex.rivera@example.com' &&
        a.email !== 'alex@example.com'
    )
  } catch {
    return []
  }
}

const saveRegisteredAccount = (provider, password) => {
  try {
    const list = getRegisteredAccounts()
    const filtered = list.filter((a) => a.email.toLowerCase() !== provider.email.toLowerCase())
    filtered.push({ ...provider, password })
    localStorage.setItem('homeease_registered_providers', JSON.stringify(filtered))
  } catch (err) {
    console.error('Failed to save registered account:', err)
  }
}

// Backend Health
export const getHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

// Provider Registration
export const registerProvider = async (providerData) => {
  try {
    const response = await api.post('/providers/register', providerData)
    if (response.data?.provider) {
      setStoredProvider(response.data.provider)
      saveRegisteredAccount(response.data.provider, providerData.password)
    }
    return response.data
  } catch (error) {
    // Offline/standalone fallback with user-provided data only
    console.warn('Backend server unavailable, registering locally:', error.message)
    const newProvider = {
      _id: 'provider-' + Date.now(),
      name: providerData.name,
      email: providerData.email,
      phone: providerData.phone,
      skills: providerData.skills || [],
      experience: providerData.experience || '',
      serviceAreas: providerData.serviceAreas || [],
      hourlyRate: Number(providerData.hourlyRate) || 0,
      bio: providerData.bio || '',
      status: 'available',
      rating: 5.0,
      completedJobs: 0,
      earnings: 0,
      createdAt: new Date().toISOString(),
    }
    setStoredProvider(newProvider)
    saveRegisteredAccount(newProvider, providerData.password)
    return {
      success: true,
      message: 'Provider registered successfully',
      provider: newProvider,
    }
  }
}

// Provider Login
export const loginProvider = async (credentials) => {
  try {
    const response = await api.post('/providers/login', credentials)
    if (response.data?.provider) {
      setStoredProvider(response.data.provider)
    }
    return response.data
  } catch (error) {
    // Offline/standalone login validation against registered accounts
    const accounts = getRegisteredAccounts()
    const matched = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === credentials.email.toLowerCase().trim() &&
        acc.password === credentials.password
    )

    if (matched) {
      const sanitized = { ...matched }
      delete sanitized.password
      setStoredProvider(sanitized)
      return {
        success: true,
        message: 'Login successful',
        provider: sanitized,
      }
    }

    return {
      success: false,
      message: 'Invalid email or password. Please verify your credentials or register a new account.',
    }
  }
}

// Get Profile
export const getProviderProfile = async (id) => {
  try {
    const response = await api.get(`/providers/profile/${id}`)
    return response.data
  } catch (error) {
    const stored = getStoredProvider()
    if (stored) {
      return { success: true, provider: stored }
    }
    return { success: false, message: 'Provider profile not found.' }
  }
}

// Update Profile
export const updateProviderProfile = async (id, updateData) => {
  try {
    const response = await api.put(`/providers/profile/${id}`, updateData)
    if (response.data?.provider) {
      setStoredProvider(response.data.provider)
    }
    return response.data
  } catch (error) {
    const current = getStoredProvider() || {}
    const merged = { ...current, ...updateData }
    setStoredProvider(merged)
    return {
      success: true,
      message: 'Profile updated successfully',
      provider: merged,
    }
  }
}

// Get Dashboard Data
export const getProviderDashboard = async (id) => {
  try {
    const response = await api.get(`/providers/dashboard/${id}`)
    return response.data
  } catch (error) {
    const provider = getStoredProvider()
    if (!provider) {
      return {
        success: false,
        message: 'No active session. Please log in.',
        provider: null,
        stats: null,
        jobs: [],
      }
    }

    return {
      success: true,
      provider,
      stats: {
        completedJobs: provider.completedJobs || 0,
        activeJobs: 0,
        pendingRequests: 0,
        rating: provider.rating || 5.0,
        hourlyRate: provider.hourlyRate || 0,
        totalEarnings: provider.earnings || 0,
      },
      jobs: [],
    }
  }
}
// ---------------------------------------------------------------
// Admin (Day 4)
// ---------------------------------------------------------------
const ADMIN_KEY = 'homeease_admin'

export const getStoredAdmin = () => {
  try {
    const data = localStorage.getItem(ADMIN_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const setStoredAdmin = (admin) => {
  try {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
  } catch (err) {
    console.error('Failed to save admin session:', err)
  }
}

export const clearStoredAdmin = () => {
  try {
    localStorage.removeItem(ADMIN_KEY)
  } catch (err) {
    console.error('Failed to clear admin session:', err)
  }
}

// Admin Login
// Uses POST /api/admin/login when the backend has it. Until then (backend
// offline / route missing) it falls back to a local demo admin so the UI
// can be tested. Real admin auth is added with the backend auth module.
export const loginAdmin = async ({ email, password }) => {
  try {
    const response = await api.post('/admin/login', { email, password })
    if (response.data?.admin) setStoredAdmin(response.data.admin)
    return response.data
  } catch (error) {
    // Backend answered with a real error (wrong password etc.)
    if (error.response && error.response.status !== 404) {
      return { success: false, message: error.response.data?.message || 'Login failed.' }
    }

    const demoEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@homeease.com'
    const demoPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

    if (email.toLowerCase().trim() === demoEmail && password === demoPassword) {
      const admin = { _id: 'admin-local', name: 'HomeEase Admin', email: demoEmail, role: 'admin' }
      setStoredAdmin(admin)
      return { success: true, message: 'Login successful', admin }
    }
    return { success: false, message: 'Invalid admin email or password.' }
  }
}

// Admin Dashboard data
// Real counts only (no dummy data). Providers come from the backend, or from
// locally registered providers while offline. Other modules (users, bookings,
// complaints) are filled in by later days, so they start at zero.
export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard')
    return response.data
  } catch {
    const providers = getRegisteredAccounts().map((p) => {
      const safe = { ...p }
      delete safe.password
      return safe
    })
    return {
      success: true,
      stats: {
        totalUsers: 0,
        totalProviders: providers.length,
        totalBookings: 0,
        totalComplaints: 0,
        totalCategories: SERVICE_CATEGORIES.length,
      },
      providers,
      bookings: [],
      complaints: [],
      categories: SERVICE_CATEGORIES,
    }
  }
}

export const SERVICE_CATEGORIES = [
  { name: 'Electrician', icon: '⚡' },
  { name: 'Plumber', icon: '🔧' },
  { name: 'Home cleaning', icon: '✦' },
  { name: 'Carpenter', icon: '⌂' },
  { name: 'Appliance repair', icon: '◈' },
]
export default api
