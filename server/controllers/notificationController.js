import Notification from '../models/Notification.js';

// @desc    Get published notifications (public)
// @route   GET /api/notifications/public
export const getPublicNotifications = async (req, res) => {
  try {
    const now = new Date();
    const notifications = await Notification.find({
      isPublished: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    })
      .populate('createdBy', 'name role')
      .sort({ priority: -1, publishedAt: -1 })
      .limit(20);

    // Increment view count
    const ids = notifications.map(n => n._id);
    await Notification.updateMany({ _id: { $in: ids } }, { $inc: { viewCount: 1 } });

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notifications (admin)
// @route   GET /api/notifications
export const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isPublished } = req.query;
    const query = {};
    if (type) query.type = type;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create notification (admin/pastor)
// @route   POST /api/notifications
export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      createdBy: req.user._id,
      publishedAt: req.body.isPublished ? new Date() : null
    });

    await notification.populate('createdBy', 'name role');
    res.status(201).json({ success: true, message: 'Notification created', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notification (admin)
// @route   PUT /api/notifications/:id
export const updateNotification = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.body.isPublished && !req.body.publishedAt) {
      update.publishedAt = new Date();
    }

    const notification = await Notification.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('createdBy', 'name role');

    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification updated', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification (admin)
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish/Unpublish notification (admin)
// @route   PATCH /api/notifications/:id/publish
export const togglePublish = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });

    notification.isPublished = !notification.isPublished;
    if (notification.isPublished) notification.publishedAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: notification.isPublished ? 'Notification published' : 'Notification unpublished',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
