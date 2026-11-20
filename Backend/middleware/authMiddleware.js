import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Provide a Bearer token.',
      })
    }

    const token = authorization.slice(7).trim()
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token is missing.' })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is not configured.' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Authentication token has expired.' })
      }
      return res.status(401).json({ success: false, message: 'Invalid authentication token.' })
    }

    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ success: false, message: 'Invalid authentication token payload.' })
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database is unavailable.' })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authenticated user no longer exists.' })
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been disabled.' })
    }

    req.user = {
      id: user._id,
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    }
    next()
  } catch (error) {
    console.error('Authentication middleware error:', error)
    return res.status(500).json({ success: false, message: 'Authentication could not be completed.' })
  }
}

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' })
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action.',
    })
  }

  next()
}

export { authMiddleware, authorizeRoles }
