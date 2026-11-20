import mongoose from 'mongoose'

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: 'Verification status must be PENDING, APPROVED, or REJECTED',
      },
      default: 'PENDING',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    // Optional compatibility fields for existing provider features
    hourlyRate: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_document, returnedObject) {
        returnedObject.id = returnedObject._id
        delete returnedObject.__v
        return returnedObject
      },
    },
  }
)

const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema)

export default Provider
