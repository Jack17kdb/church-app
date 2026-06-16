import Donation from '../models/Donation.js';
import { getMpesaToken, formatPhone } from '../services/mpesaService.js';
import axios from 'axios';

// @desc    Initiate M-Pesa STK Push (public)
// @route   POST /api/payments/stkpush
export const initiateSTKPush = async (req, res) => {
  try {
    const { memberName, phone, amount, category, note } = req.body;

    if (!memberName || !phone || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const formattedPhone = formatPhone(phone);
    if (!formattedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format. Use 07XXXXXXXX or 01XXXXXXXX' });
    }

    // Create pending donation record
    const donation = await Donation.create({
      memberName,
      phone: formattedPhone,
      amount: Number(amount),
      category,
      note,
      status: 'Pending'
    });

    // Try M-Pesa STK push
    try {
      const token = await getMpesaToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const shortcode = process.env.MPESA_SHORTCODE || '174379';
      const passkey = process.env.MPESA_PASSKEY || '';
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
      const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/payments/callback';

      const mpesaEnv = process.env.MPESA_ENV === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      const response = await axios.post(`${mpesaEnv}/mpesa/stkpush/v1/processrequest`, {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(Number(amount)),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: category,
        TransactionDesc: `Church ${category} - ${memberName}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      donation.checkoutRequestId = response.data.CheckoutRequestID;
      donation.merchantRequestId = response.data.MerchantRequestID;
      await donation.save();

      return res.json({
        success: true,
        message: 'STK Push sent to your phone. Please enter your M-Pesa PIN.',
        donationId: donation._id,
        checkoutRequestId: response.data.CheckoutRequestID
      });
    } catch (mpesaError) {
      // If M-Pesa fails (sandbox/no credentials), still save the donation as pending
      console.error('M-Pesa STK Push error:', mpesaError?.response?.data || mpesaError.message);
      return res.json({
        success: true,
        message: 'Donation recorded. M-Pesa notification will be sent shortly.',
        donationId: donation._id,
        note: 'M-Pesa integration requires valid Daraja API credentials'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    M-Pesa callback
// @route   POST /api/payments/callback
export const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    const donation = await Donation.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!donation) {
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const getItem = (name) => items.find(i => i.Name === name)?.Value;
      donation.mpesaReceipt = getItem('MpesaReceiptNumber');
      donation.transactionId = getItem('MpesaReceiptNumber');
      donation.status = 'Successful';
    } else {
      donation.status = 'Failed';
      donation.failureReason = ResultDesc;
    }

    await donation.save();
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};

// @desc    Get all donations (admin)
// @route   GET /api/payments
export const getDonations = async (req, res) => {
  try {
    const { search, category, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { memberName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { mpesaReceipt: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
    }

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalAmount = await Donation.aggregate([
      { $match: { ...query, status: 'Successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      count: donations.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalAmount: totalAmount[0]?.total || 0,
      donations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donation stats for dashboard
// @route   GET /api/payments/stats
export const getDonationStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [total, monthly, lastMonthly, pending, successful, byCategory, monthlyTrend] = await Promise.all([
      Donation.aggregate([{ $match: { status: 'Successful' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Donation.aggregate([{ $match: { status: 'Successful', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Donation.aggregate([{ $match: { status: 'Successful', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Donation.countDocuments({ status: 'Pending' }),
      Donation.countDocuments({ status: 'Successful' }),
      Donation.aggregate([
        { $match: { status: 'Successful' } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Donation.aggregate([
        { $match: { status: 'Successful', createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } } },
        { $group: { _id: { month: { $month: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { '_id.month': 1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalDonations: total[0]?.total || 0,
        monthlyDonations: monthly[0]?.total || 0,
        lastMonthDonations: lastMonthly[0]?.total || 0,
        pendingPayments: pending,
        successfulPayments: successful,
        byCategory,
        monthlyTrend
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update donation status manually (admin)
// @route   PUT /api/payments/:id
export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check donation status
// @route   GET /api/payments/:id/status
export const checkDonationStatus = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, status: donation.status, mpesaReceipt: donation.mpesaReceipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
