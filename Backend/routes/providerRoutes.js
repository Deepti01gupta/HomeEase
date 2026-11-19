import express from 'express'
import {
  registerProvider,
  loginProvider,
  getProfile,
  updateProfile,
  getDashboardData,
} from '../controllers/providerController.js'

const router = express.Router()

// Provider Authentication
router.post('/register', registerProvider)
router.post('/login', loginProvider)

// Provider Profile & Dashboard
router.get('/profile/:id', getProfile)
router.put('/profile/:id', updateProfile)
router.get('/dashboard/:id', getDashboardData)

export default router
