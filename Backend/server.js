require('dotenv').config()

const cors = require('cors')
const express = require('express')
const connectDatabase = require('./config/db')
const healthRoutes = require('./routes/healthRoutes')
const providerRoutes = require('./routes/providerRoutes')

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))
app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/providers', providerRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

const startServer = async () => {
  await connectDatabase()
  app.listen(port, () => {
    console.log(`HomeEase API running on http://localhost:${port}`)
  })
}

startServer()

module.exports = app
