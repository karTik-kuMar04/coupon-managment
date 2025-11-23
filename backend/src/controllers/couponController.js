import { createCoupon, getAllCoupons, getApplicableCoupons } from '../utils/couponStorage.js';
import { findBestCoupon } from '../utils/couponComparator.js';
import { calculateDiscount } from '../utils/couponStorage.js';
import mongoose from 'mongoose';

function checkDatabaseConnection(res) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database not connected',
      message: 'MongoDB is not connected. Please start MongoDB and try again.'
    });
  }
  return null;
}

export async function createCouponHandler(req, res) {
  const dbError = checkDatabaseConnection(res);
  if (dbError) return dbError;
  
  try {
    const {
      code,
      type,
      discountValue,
      maxDiscountAmount,
      minCartValue,
      expiryDate,
      userTier,
      categories,
      maxUsage,
      description
    } = req.body;

    if (!code || !type || discountValue === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: code, type, discountValue'
      });
    }

    if (type !== 'FLAT' && type !== 'PERCENT') {
      return res.status(400).json({
        error: 'type must be either FLAT or PERCENT'
      });
    }

    if (typeof discountValue !== 'number' || discountValue <= 0) {
      return res.status(400).json({
        error: 'discountValue must be a positive number'
      });
    }

    if (type === 'PERCENT' && discountValue > 100) {
      return res.status(400).json({
        error: 'PERCENT discountValue cannot exceed 100'
      });
    }

    if (type === 'FLAT' && maxDiscountAmount) {
      return res.status(400).json({
        error: 'maxDiscountAmount is only applicable for PERCENT type'
      });
    }

    const couponData = {
      code: code.toUpperCase().trim(),
      type,
      discountValue,
      maxDiscountAmount: maxDiscountAmount || null,
      minCartValue: minCartValue || null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      userTier: userTier || null,
      categories: categories || [],
      maxUsage: maxUsage || null,
      usedCount: 0,
      description: description || ''
    };

    const coupon = await createCoupon(couponData);

    res.status(201).json({
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    if (error.message === 'Coupon code already exists') {
      return res.status(409).json({
        error: 'Coupon code already exists'
      });
    }
    res.status(500).json({
      error: 'Failed to create coupon',
      message: error.message
    });
  }
}

export async function getAllCouponsHandler(req, res) {
  const dbError = checkDatabaseConnection(res);
  if (dbError) return dbError;
  
  try {
    const coupons = await getAllCoupons();
    res.json({
      count: coupons.length,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch coupons',
      message: error.message
    });
  }
}

export async function getBestCouponHandler(req, res) {
  const dbError = checkDatabaseConnection(res);
  if (dbError) return dbError;
  
  try {
    const { user, cart } = req.body;

    if (!user || !cart) {
      return res.status(400).json({
        error: 'Missing required fields: user and cart'
      });
    }

    if (!cart.total || typeof cart.total !== 'number') {
      return res.status(400).json({
        error: 'cart.total must be a number'
      });
    }

    const applicableCoupons = await getApplicableCoupons(user, cart);

    if (applicableCoupons.length === 0) {
      return res.json({
        message: 'No applicable coupons found',
        bestCoupon: null,
        discountAmount: 0
      });
    }

    const bestCoupon = findBestCoupon(applicableCoupons, cart.total);
    const discountAmount = calculateDiscount(bestCoupon, cart.total);

    res.json({
      message: 'Best coupon found',
      bestCoupon,
      discountAmount,
      finalAmount: cart.total - discountAmount,
      applicableCount: applicableCoupons.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to find best coupon',
      message: error.message
    });
  }
}

