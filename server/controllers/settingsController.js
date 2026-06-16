import ChurchSettings from '../models/ChurchSettings.js';

// @desc    Get church settings (public)
// @route   GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await ChurchSettings.findOne();
    if (!settings) {
      settings = await ChurchSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update church settings (admin)
// @route   PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await ChurchSettings.findOne();
    if (!settings) {
      settings = await ChurchSettings.create(req.body);
    } else {
      settings = await ChurchSettings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    }
    res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add donation category (admin)
// @route   POST /api/settings/categories
export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    let settings = await ChurchSettings.findOne();
    if (!settings) settings = await ChurchSettings.create({});

    if (settings.donationCategories.includes(category.trim())) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    settings.donationCategories.push(category.trim());
    await settings.save();

    res.json({ success: true, message: 'Category added successfully', categories: settings.donationCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove donation category (admin)
// @route   DELETE /api/settings/categories/:category
export const removeCategory = async (req, res) => {
  try {
    const categoryToRemove = decodeURIComponent(req.params.category);
    const settings = await ChurchSettings.findOne();
    if (!settings) return res.status(404).json({ success: false, message: 'Settings not found' });

    settings.donationCategories = settings.donationCategories.filter(c => c !== categoryToRemove);
    await settings.save();

    res.json({ success: true, message: 'Category removed successfully', categories: settings.donationCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add ministry (admin)
// @route   POST /api/settings/ministries
export const addMinistry = async (req, res) => {
  try {
    const { ministry } = req.body;
    if (!ministry || !ministry.trim()) {
      return res.status(400).json({ success: false, message: 'Ministry name is required' });
    }

    let settings = await ChurchSettings.findOne();
    if (!settings) settings = await ChurchSettings.create({});

    if (settings.ministries.includes(ministry.trim())) {
      return res.status(400).json({ success: false, message: 'Ministry already exists' });
    }

    settings.ministries.push(ministry.trim());
    await settings.save();

    res.json({ success: true, message: 'Ministry added', ministries: settings.ministries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove ministry (admin)
// @route   DELETE /api/settings/ministries/:ministry
export const removeMinistry = async (req, res) => {
  try {
    const ministryToRemove = decodeURIComponent(req.params.ministry);
    const settings = await ChurchSettings.findOne();
    if (!settings) return res.status(404).json({ success: false, message: 'Settings not found' });

    settings.ministries = settings.ministries.filter(m => m !== ministryToRemove);
    await settings.save();

    res.json({ success: true, message: 'Ministry removed', ministries: settings.ministries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
