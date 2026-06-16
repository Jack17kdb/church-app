import express from 'express';
import {
  initiateSTKPush, mpesaCallback, getDonations,
  getDonationStats, updateDonation, checkDonationStatus
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/stkpush', initiateSTKPush);
router.post('/callback', mpesaCallback);
router.get('/stats', protect, getDonationStats);
router.get('/', protect, getDonations);
router.get('/:id/status', checkDonationStatus);
router.put('/:id', protect, authorize('admin'), updateDonation);

export default router;
