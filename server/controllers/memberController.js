import Member from '../models/Member.js';
import Donation from '../models/Donation.js';

// @desc    Register new member (public)
// @route   POST /api/members/register
export const registerMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to our church family.',
      member: { id: member._id, firstName: member.firstName, lastName: member.lastName }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A member with this email already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all members (admin)
// @route   GET /api/members
export const getMembers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20, gender, maritalStatus } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (gender) query.gender = gender;
    if (maritalStatus) query.maritalStatus = maritalStatus;

    const total = await Member.countDocuments(query);
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: members.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      members
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single member with donation history (admin)
// @route   GET /api/members/:id
export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const donations = await Donation.find({ phone: member.phone }).sort({ createdAt: -1 }).limit(10);

    res.json({ success: true, member, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update member (admin)
// @route   PUT /api/members/:id
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member updated successfully', member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete member (admin)
// @route   DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member stats
// @route   GET /api/members/stats
export const getMemberStats = async (req, res) => {
  try {
    const total = await Member.countDocuments({ isActive: true });
    const thisMonth = await Member.countDocuments({
      isActive: true,
      joinDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const byGender = await Member.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, stats: { total, thisMonth, byGender } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
