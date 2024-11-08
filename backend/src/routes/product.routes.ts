import express from 'express';
import { deleteProduct, getAdminProducts, getAllCategory, getLatestProducts, getSingleProduct, newProduct, searchProduct, updateProduct } from '../controllers/product.controller.js';
import { singleUpload } from '../middleware/multer.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/new',adminOnly,singleUpload,newProduct);
router.get('/all',searchProduct);
router.get('/latest',getLatestProducts);
router.get('/categories',getAllCategory);
router.get('/admin-products',getAdminProducts);
router.route('/:id').get(getSingleProduct).put(adminOnly,singleUpload,updateProduct).delete(adminOnly,deleteProduct);

export default router;