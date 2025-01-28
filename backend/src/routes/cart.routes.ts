import express from 'express';
import { addCart, deleteCart, deleteCartItem, getCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.route('/').get(getCart).post(addCart).delete(deleteCartItem);
router.route('/:userId').delete(deleteCart);

export default router;