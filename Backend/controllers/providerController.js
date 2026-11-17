const crypto = require('crypto')
const mongoose = require('mongoose')
const Provider = require('../models/Provider')

// In-memory fallback cache for newly registered providers when MongoDB is offline
const memoryProviders = []

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const isDbConnected = () => mongoose.connection.readyState === 1

// Clean provider object to omit password
const sanitizeProvider = (provider) => {
  if (!provider) return null
  const obj = provider.toObject ? provider.toObject() : { ...provider }
  delete obj.password
  delete obj.passwordHash
  return obj
}

// Register Provider
const registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, skills, experience, serviceAreas, hourlyRate, bio } = req.body

    if (!name || !email || !password || !phone || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, phone, and experience are required.',
      })
    }

    const normalizedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const normalizedAreas = Array.isArray(serviceAreas)
      ? serviceAreas
      : typeof serviceAreas === 'string'
      ? serviceAreas.split(',').map((a) => a.trim()).filter(Boolean)
      : []

    if (isDbConnected()) {
      const existing = await Provider.findOne({ email: email.toLowerCase() })
      if (existing) {
        return res.status(400).json({ success: false, message: 'Provider with this email already exists.' })
      }

      const newProvider = await Provider.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword(password),
        phone: phone.trim(),
        skills: normalizedSkills,
        experience: String(experience).trim(),
        serviceAreas: normalizedAreas,
        hourlyRate: Number(hourlyRate) || 0,
        bio: bio || '',
        status: 'available',
        rating: 5.0,
        completedJobs: 0,
      })

      return res.status(201).json({
        success: true,
        message: 'Service Provider registered successfully',
        provider: sanitizeProvider(newProvider),
      })
    } else {
      // In-memory fallback (only stores actively registered users)
      const existing = memoryProviders.find((p) => p.email.toLowerCase() === email.toLowerCase().trim())
      if (existing) {
        return res.status(400).json({ success: false, message: 'Provider with this email already exists.' })
      }

      const newProvider = {
        _id: 'provider-' + Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashPassword(password),
        phone: phone.trim(),
        skills: normalizedSkills,
        experience: String(experience).trim(),
        serviceAreas: normalizedAreas,
        hourlyRate: Number(hourlyRate) || 0,
        bio: bio || '',
        status: 'available',
        rating: 5.0,
        completedJobs: 0,
        earnings: 0,
        createdAt: new Date().toISOString(),
      }

      memoryProviders.push(newProvider)
      return res.status(201).json({
        success: true,
        message: 'Service Provider registered successfully',
        provider: sanitizeProvider(newProvider),
      })
    }
  } catch (error) {
    console.error('Provider registration error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

// Login Provider
const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const hashedInput = hashPassword(password)

    if (isDbConnected()) {
      const provider = await Provider.findOne({ email: email.toLowerCase().trim() })
      if (!provider || provider.password !== hashedInput) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        provider: sanitizeProvider(provider),
      })
    } else {
      const provider = memoryProviders.find((p) => p.email.toLowerCase() === email.toLowerCase().trim())
      if (!provider || provider.passwordHash !== hashedInput) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        provider: sanitizeProvider(provider),
      })
    }
  } catch (error) {
    console.error('Provider login error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

// Get Provider Profile
const getProfile = async (req, res) => {
  try {
    const { id } = req.params

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const provider = await Provider.findById(id)
      if (provider) {
        return res.status(200).json({ success: true, provider: sanitizeProvider(provider) })
      }
    }

    const cached = memoryProviders.find((p) => p._id === id || p.email === id)
    if (cached) {
      return res.status(200).json({ success: true, provider: sanitizeProvider(cached) })
    }

    return res.status(404).json({ success: false, message: 'Provider not found' })
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

// Update Provider Profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, skills, experience, serviceAreas, hourlyRate, bio, status } = req.body

    const normalizedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined

    const normalizedAreas = Array.isArray(serviceAreas)
      ? serviceAreas
      : typeof serviceAreas === 'string'
      ? serviceAreas.split(',').map((a) => a.trim()).filter(Boolean)
      : undefined

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updateData = {}
      if (name) updateData.name = name.trim()
      if (phone) updateData.phone = phone.trim()
      if (normalizedSkills) updateData.skills = normalizedSkills
      if (experience) updateData.experience = String(experience).trim()
      if (normalizedAreas) updateData.serviceAreas = normalizedAreas
      if (hourlyRate !== undefined) updateData.hourlyRate = Number(hourlyRate)
      if (bio !== undefined) updateData.bio = bio
      if (status) updateData.status = status

      const updated = await Provider.findByIdAndUpdate(id, updateData, { new: true })
      if (updated) {
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          provider: sanitizeProvider(updated),
        })
      }
    }

    // In-memory fallback
    const idx = memoryProviders.findIndex((p) => p._id === id || p.email === id)
    if (idx !== -1) {
      if (name) memoryProviders[idx].name = name.trim()
      if (phone) memoryProviders[idx].phone = phone.trim()
      if (normalizedSkills) memoryProviders[idx].skills = normalizedSkills
      if (experience) memoryProviders[idx].experience = String(experience).trim()
      if (normalizedAreas) memoryProviders[idx].serviceAreas = normalizedAreas
      if (hourlyRate !== undefined) memoryProviders[idx].hourlyRate = Number(hourlyRate)
      if (bio !== undefined) memoryProviders[idx].bio = bio
      if (status) memoryProviders[idx].status = status

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        provider: sanitizeProvider(memoryProviders[idx]),
      })
    }

    return res.status(404).json({ success: false, message: 'Provider not found' })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

// Get Dashboard Data
const getDashboardData = async (req, res) => {
  try {
    const { id } = req.params
    let provider = null

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      provider = await Provider.findById(id)
    }

    if (!provider) {
      provider = memoryProviders.find((p) => p._id === id || p.email === id)
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' })
    }

    const sanitized = sanitizeProvider(provider)

    const stats = {
      completedJobs: sanitized.completedJobs || 0,
      activeJobs: 0,
      pendingRequests: 0,
      rating: sanitized.rating || 5.0,
      hourlyRate: sanitized.hourlyRate || 0,
      totalEarnings: (sanitized.completedJobs || 0) * (sanitized.hourlyRate || 0),
    }

    return res.status(200).json({
      success: true,
      provider: sanitized,
      stats,
      jobs: [],
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

module.exports = {
  registerProvider,
  loginProvider,
  getProfile,
  updateProfile,
  getDashboardData,
}
