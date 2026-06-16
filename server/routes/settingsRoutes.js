import express from 'express';
import {
  getSettings, updateSettings,
  addCategory, removeCategory,
  addMinistry, removeMinistry
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, authorize('admin'), updateSettings);
router.post('/categories', protect, authorize('admin'), addCategory);
router.delete('/categories/:category', protect, authorize('admin'), removeCategory);
router.post('/ministries', protect, authorize('admin'), addMinistry);
router.delete('/ministries/:ministry', protect, authorize('admin'), removeMinistry);

export default router;
