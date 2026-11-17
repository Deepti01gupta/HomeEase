const express = require('express')
const {
  registerProvider,
  loginProvider,
  getProfile,
  updateProfile,
  getDashboardData,
} = require('../controllers/providerController')

const router = express.Router()

// Provider Authentication
router.post('/register', registerProvider)
router.post('/login', loginProvider)

// Provider Profile & Dashboard
router.get('/profile/:id', getProfile)
router.put('/profile/:id', updateProfile)
router.get('/dashboard/:id', getDashboardData)

module.exports = router
