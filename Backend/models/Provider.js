const mongoose = require('mongoose')

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 45,
    },
    bio: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    completedJobs: {
      type: Number,
      default: 18,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.models.Provider || mongoose.model('Provider', providerSchema)
