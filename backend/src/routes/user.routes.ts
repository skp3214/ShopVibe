// FILE: routes/user.routes.ts
import express from 'express';
const router = express.Router();
import { newUser,getAllUsers,getUser,deleteUser } from '../controllers/user.controller.js';
import { adminOnly } from '../middleware/auth.js';

router.post('/new', newUser);
router.get('/all',adminOnly ,getAllUsers);
router.route('/:id').get(getUser).delete(adminOnly,deleteUser);

export default router;