import Coupon from '../models/Coupon.js';

function transformCoupon(coupon) {
  const obj = coupon.toObject ? coupon.toObject() : coupon;
  return {
    ...obj,
    id: obj._id?.toString() || obj.id,
    _id: undefined,
    expiryDate: obj.expiryDate ? new Date(obj.expiryDate).toISOString().split('T')[0] : null,
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined
  };
}

export async function createCoupon(couponData) {
  try {
    const coupon = new Coupon(couponData);
    await coupon.save();
    return transformCoupon(coupon);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Coupon code already exists');
    }
    throw error;
  }
}

export async function getAllCoupons() {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return coupons.map(coupon => transformCoupon(coupon));
}

export async function getCouponById(id) {
  const coupon = await Coupon.findById(id);
  return coupon ? transformCoupon(coupon) : null;
}

export async function getApplicableCoupons(user, cart) {
  const now = new Date();
  const query = {
    $and: [
      {
        $or: [
          { expiryDate: null },
          { expiryDate: { $gte: now } }
        ]
      },
      {
        $or: [
          { minCartValue: null },
          { minCartValue: { $lte: cart.total } }
        ]
      },
      {
        $or: [
          { userTier: null },
          { userTier: user.tier }
        ]
      },
      {
        $or: [
          { maxUsage: null },
          { $expr: { $lt: ['$usedCount', '$maxUsage'] } }
        ]
      }
    ]
  };

  const cartCategories = cart.items?.map(item => item.category) || [];
  
  let coupons = await Coupon.find(query);
  
  coupons = coupons.filter(coupon => {
    if (coupon.categories && coupon.categories.length > 0) {
      return coupon.categories.some(cat => cartCategories.includes(cat));
    }
    return true;
  });

  return coupons.map(coupon => transformCoupon(coupon));
}

export function calculateDiscount(coupon, cartTotal) {
  if (coupon.type === 'FLAT') {
    return Math.min(coupon.discountValue, cartTotal);
  } else if (coupon.type === 'PERCENT') {
    const discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      return Math.min(discount, coupon.maxDiscountAmount);
    }
    return discount;
  }
  return 0;
}

