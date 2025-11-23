import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: true,
    enum: ['FLAT', 'PERCENT']
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    min: 0,
    default: null
  },
  minCartValue: {
    type: Number,
    min: 0,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },
  userTier: {
    type: String,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    default: null
  },
  categories: {
    type: [String],
    default: []
  },
  maxUsage: {
    type: Number,
    min: 1,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

couponSchema.index({ expiryDate: 1 });
couponSchema.index({ userTier: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;

