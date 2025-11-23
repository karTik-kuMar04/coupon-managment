import { calculateDiscount } from './couponStorage.js';

export function compareCoupons(coupon1, coupon2, cartTotal) {
  const discount1 = calculateDiscount(coupon1, cartTotal);
  const discount2 = calculateDiscount(coupon2, cartTotal);
  
  if (discount1 !== discount2) {
    return discount2 - discount1;
  }
  
  const expiry1 = coupon1.expiryDate ? new Date(coupon1.expiryDate) : new Date('9999-12-31');
  const expiry2 = coupon2.expiryDate ? new Date(coupon2.expiryDate) : new Date('9999-12-31');
  
  if (expiry1.getTime() !== expiry2.getTime()) {
    return expiry1.getTime() - expiry2.getTime();
  }
  
  const code1 = coupon1.code || '';
  const code2 = coupon2.code || '';
  
  if (code1 < code2) return -1;
  if (code1 > code2) return 1;
  return 0;
}

export function findBestCoupon(applicableCoupons, cartTotal) {
  if (!applicableCoupons || applicableCoupons.length === 0) {
    return null;
  }
  
  const sorted = [...applicableCoupons].sort((a, b) => 
    compareCoupons(a, b, cartTotal)
  );
  
  return sorted[0];
}


