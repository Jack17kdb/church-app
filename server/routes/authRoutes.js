import express from 'express';
import { login, getMe, updatePassword, createUser, getUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.post('/users', protect, authorize('admin'), createUser);
router.get('/users', protect, authorize('admin'), getUsers);

export default router;
