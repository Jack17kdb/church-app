import express from 'express';
import {
  registerMember, getMembers, getMember,
  updateMember, deleteMember, getMemberStats
} from '../controllers/memberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerMember);
router.get('/stats', protect, getMemberStats);
router.get('/', protect, getMembers);
router.get('/:id', protect, getMember);
router.put('/:id', protect, authorize('admin', 'pastor', 'staff'), updateMember);
router.delete('/:id', protect, authorize('admin'), deleteMember);

export default router;
