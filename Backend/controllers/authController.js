import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Provider from '../models/Provider.js'

const emailPattern = /^\S+@\S+\.\S+$/
const phonePattern = /^\+?[0-9]{7,15}$/

const ensureDatabase = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database is unavailable. Configure MONGODB_URI and try again.',
    })
    return false
  }
  return true
}

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.')
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// Register User (Customer or Provider)
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, skills, experience, serviceAreas, description, bio, hourlyRate } = req.body

    // 1. Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required.',
      })
    }

    if (String(name).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' })
    }

    const trimmedPhone = String(phone).trim()
    if (!phonePattern.test(trimmedPhone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' })
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      })
    }

    // 2. Validate role - Public registration cannot register ADMIN
    const requestedRole = role ? String(role).toUpperCase().trim() : 'CUSTOMER'
    if (requestedRole === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Public registration does not allow ADMIN accounts.',
      })
    }

    if (!['CUSTOMER', 'PROVIDER'].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be CUSTOMER or PROVIDER.',
      })
    }

    if (!ensureDatabase(res)) return

    // 3. Check whether the email already exists
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    // 4. Create User document (password is hashed by Mongoose pre('save') hook)
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: trimmedPhone,
      password,
      role: requestedRole,
    })

    let providerDoc = null

    // 5. If role is PROVIDER, create the corresponding Provider document with PENDING verification
    if (requestedRole === 'PROVIDER') {
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

      const expNumber = Number(experience) || (typeof experience === 'string' ? parseInt(experience, 10) || 0 : 0)

      providerDoc = await Provider.create({
        userId: user._id,
        skills: normalizedSkills,
        experience: expNumber,
        serviceAreas: normalizedAreas,
        description: description || bio || '',
        verificationStatus: 'PENDING',
        averageRating: 0,
        totalReviews: 0,
        isAvailable: false,
        hourlyRate: Number(hourlyRate) || 0,
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    }

    // 6. Return response with safe user details (and provider details if provider)
    const responsePayload = {
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }

    if (providerDoc) {
      responsePayload.provider = {
        id: providerDoc._id,
        userId: providerDoc.userId,
        skills: providerDoc.skills,
        experience: providerDoc.experience,
        serviceAreas: providerDoc.serviceAreas,
        description: providerDoc.description,
        verificationStatus: providerDoc.verificationStatus,
        averageRating: providerDoc.averageRating,
        totalReviews: providerDoc.totalReviews,
        isAvailable: providerDoc.isAvailable,
      }
    }

    return res.status(201).json(responsePayload)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: Object.values(error.errors).map((item) => item.message),
      })
    }
    console.error('Registration error:', error)
    return res.status(500).json({ success: false, message: 'Server error during registration.' })
  }
}

// Login User
const login = async (req, res) => {
  try {
    if (!ensureDatabase(res)) return

    const { email, password } = req.body

    // 1. Validate both fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
    }

    // 2. Find user using email (explicitly select password because select: false)
    const user = await User.findOne({ email: normalizedEmail }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // 3. Check whether account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled. Please contact support.',
      })
    }

    // 4. Compare entered password with hashed password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // 5. Generate JWT token
    const token = signToken(user)

    // 6. Return token and safe user details
    const responsePayload = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }

    // If provider, attach provider profile info
    if (user.role === 'PROVIDER') {
      const provider = await Provider.findOne({ userId: user._id })
      if (provider) {
        responsePayload.provider = {
          id: provider._id,
          userId: provider.userId,
          skills: provider.skills,
          experience: provider.experience,
          serviceAreas: provider.serviceAreas,
          description: provider.description,
          verificationStatus: provider.verificationStatus,
          averageRating: provider.averageRating,
          totalReviews: provider.totalReviews,
          isAvailable: provider.isAvailable,
        }
      }
    }

    return res.status(200).json(responsePayload)
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: 'Server error during login.' })
  }
}

// Get Authenticated User Profile
const getMe = async (req, res) => {
  try {
    if (!ensureDatabase(res)) return

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been disabled.' })
    }

    const responsePayload = {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage || '',
        address: user.address || '',
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    }

    if (user.role === 'PROVIDER') {
      const provider = await Provider.findOne({ userId: user._id })
      if (provider) {
        responsePayload.provider = {
          id: provider._id,
          userId: provider.userId,
          skills: provider.skills,
          experience: provider.experience,
          serviceAreas: provider.serviceAreas,
          description: provider.description,
          verificationStatus: provider.verificationStatus,
          averageRating: provider.averageRating,
          totalReviews: provider.totalReviews,
          isAvailable: provider.isAvailable,
          hourlyRate: provider.hourlyRate,
        }
      }
    }

    return res.status(200).json(responsePayload)
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' })
  }
}

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    if (!ensureDatabase(res)) return

    const allowedFields = ['name', 'phone', 'address', 'profileImage']
    const updateData = {}
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field]
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
      return res.status(400).json({ success: false, message: 'Email cannot be changed through this endpoint.' })
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
      return res.status(400).json({ success: false, message: 'Password cannot be changed through this endpoint.' })
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'role')) {
      return res.status(400).json({ success: false, message: 'Role cannot be changed through this endpoint.' })
    }

    if (updateData.name !== undefined && String(updateData.name).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' })
    }
    if (updateData.phone !== undefined && !phonePattern.test(String(updateData.phone).trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' })
    }
    if (updateData.address !== undefined && String(updateData.address).length > 300) {
      return res.status(400).json({ success: false, message: 'Address cannot exceed 300 characters.' })
    }

    for (const field of ['name', 'phone', 'address', 'profileImage']) {
      if (updateData[field] !== undefined) updateData[field] = String(updateData[field]).trim()
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      returnDocument: 'after',
      runValidators: true,
    })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage || '',
        address: user.address || '',
        isActive: user.isActive,
      },
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: Object.values(error.errors).map((item) => item.message),
      })
    }
    console.error('Update profile error:', error)
    return res.status(500).json({ success: false, message: 'Server error updating profile.' })
  }
}

// Logout
const logout = async (_req, res) =>
  res.status(200).json({
    success: true,
    message: 'Logout successful. Remove the JWT from client storage.',
  })

export { register, login, getMe, updateProfile, logout }
