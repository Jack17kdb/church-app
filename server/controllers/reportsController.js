import Donation from '../models/Donation.js';
import Member from '../models/Member.js';

// @desc    Generate donation report
// @route   GET /api/reports/donations
export const getDonationReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const match = { status: 'Successful' };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
    }
    if (category) match.category = category;

    const [byCategory, byMonth, topDonors, recent] = await Promise.all([
      Donation.aggregate([
        { $match: match },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Donation.aggregate([
        { $match: match },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Donation.aggregate([
        { $match: match },
        { $group: { _id: { name: '$memberName', phone: '$phone' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]),
      Donation.find(match).sort({ createdAt: -1 }).limit(50)
    ]);

    const grandTotal = byCategory.reduce((sum, c) => sum + c.total, 0);

    res.json({ success: true, report: { grandTotal, byCategory, byMonth, topDonors, recent } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate member report
// @route   GET /api/reports/members
export const getMemberReport = async (req, res) => {
  try {
    const [total, byGender, byMaritalStatus, byMonth, recent] = await Promise.all([
      Member.countDocuments({ isActive: true }),
      Member.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ]),
      Member.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$maritalStatus', count: { $sum: 1 } } }
      ]),
      Member.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: { year: { $year: '$joinDate' }, month: { $month: '$joinDate' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
      Member.find({ isActive: true }).sort({ createdAt: -1 }).limit(10).select('firstName lastName phone email joinDate gender')
    ]);

    res.json({ success: true, report: { total, byGender, byMaritalStatus, byMonth, recent } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
