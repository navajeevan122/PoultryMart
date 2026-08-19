const mongoose = require('mongoose');

const poultrySchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Poultry name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Hen', 'Cock'],
      required: [true, 'Gender is required'],
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be positive'],
    },
    ageUnit: {
      type: String,
      enum: ['Days', 'Months', 'Years'],
      default: 'Months',
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight must be positive'],
    },
    weightUnit: {
      type: String,
      enum: ['Grams', 'KG'],
      default: 'KG',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    // Location Breakdown
    village: {
      type: String,
      default: '',
      trim: true,
    },
    mandal: {
      type: String,
      default: '',
      trim: true,
    },
    district: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    // Health & Vaccination
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Good', 'Needs Attention', 'Other'],
      default: 'Healthy',
    },
    vaccinationStatus: {
      type: String,
      enum: ['Vaccinated', 'Not Vaccinated', 'Unknown'],
      default: 'Vaccinated',
    },
    vaccinationDetails: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    // Media
    media: {
      images: {
        type: [String],
        default: [],
      },
      videos: {
        type: [String],
        default: [],
      },
    },
    // Admin Review Status
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    // Availability & Stats
    isAvailable: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for powerful search
poultrySchema.index({
  name: 'text',
  breed: 'text',
  location: 'text',
  village: 'text',
  district: 'text',
  description: 'text',
});

module.exports = mongoose.model('Poultry', poultrySchema);
