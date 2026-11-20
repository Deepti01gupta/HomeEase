import express from 'express'
import { register, login, getMe, updateProfile, logout } from '../controllers/authController.js'
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, getMe)
router.put('/update-profile', authMiddleware, updateProfile)
router.post('/logout', authMiddleware, logout)

// Small protected role examples for authorization testing.
router.get('/customer-only', authMiddleware, authorizeRoles('CUSTOMER'), (_req, res) =>
  res.status(200).json({ success: true, message: 'Customer access granted.' })
)
router.get('/provider-only', authMiddleware, authorizeRoles('PROVIDER'), (_req, res) =>
  res.status(200).json({ success: true, message: 'Provider access granted.' })
)
router.get('/admin-only', authMiddleware, authorizeRoles('ADMIN'), (_req, res) =>
  res.status(200).json({ success: true, message: 'Admin access granted.' })
)

export default router
