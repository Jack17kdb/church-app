import express from 'express';
import {
  getPublicNotifications, getAllNotifications,
  createNotification, updateNotification,
  deleteNotification, togglePublish
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicNotifications);
router.get('/', protect, getAllNotifications);
router.post('/', protect, authorize('admin', 'pastor'), createNotification);
router.put('/:id', protect, authorize('admin', 'pastor'), updateNotification);
router.patch('/:id/publish', protect, authorize('admin', 'pastor'), togglePublish);
router.delete('/:id', protect, authorize('admin'), deleteNotification);

export default router;
