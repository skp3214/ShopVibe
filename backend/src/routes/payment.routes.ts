import express from 'express';

import { adminOnly } from '../middleware/auth.js';
import { allCoupons, applyDiscount, deleteCoupons, newCoupon } from '../controllers/payment.controller.js';

const router=express.Router();

router.post("/coupon/new",adminOnly,newCoupon);
router.get("/discount",applyDiscount);
router.get("/coupon/all",adminOnly,allCoupons);
router.delete("/coupon/:id",adminOnly,deleteCoupons);
export default router;