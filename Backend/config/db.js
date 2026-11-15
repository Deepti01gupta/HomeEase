const mongoose = require('mongoose')

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.warn('MONGODB_URI is not configured. Skipping database connection.')
    return false
  }

  try {
    await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
    return true
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    return false
  }
}

module.exports = connectDatabase
