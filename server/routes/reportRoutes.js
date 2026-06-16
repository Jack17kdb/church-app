import express from 'express';
import { getDonationReport, getMemberReport } from '../controllers/reportsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/donations', protect, getDonationReport);
router.get('/members', protect, getMemberReport);

export default router;
