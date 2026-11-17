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

export default api
