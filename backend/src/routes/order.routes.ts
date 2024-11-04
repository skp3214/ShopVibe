import express from 'express';
import { AdminOrders, deleteOrder, getSingleOrder, MyOrders, newOrder, processOrder } from '../controllers/order.controller.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/new',newOrder);
router.get('/my',MyOrders);
router.get('/all',adminOnly,AdminOrders);
router.route('/:id').get(getSingleOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder);

export default router;