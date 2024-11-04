import exp from 'constants';
import express from 'express';
import { AdminOrders, getSingleOrder, MyOrders, newOrder } from '../controllers/order.controller.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/new',newOrder);
router.get('/my',MyOrders);
router.get('/all',adminOnly,AdminOrders);
router.route('/:id').get(getSingleOrder)

export default router;