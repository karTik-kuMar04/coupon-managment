import express from 'express';
import {
  createCouponHandler,
  getAllCouponsHandler,
  getBestCouponHandler
} from '../controllers/couponController.js';

const router = express.Router();

router.post('/', createCouponHandler);

router.get('/', getAllCouponsHandler);

router.post('/best-coupon', getBestCouponHandler);

export default router;


