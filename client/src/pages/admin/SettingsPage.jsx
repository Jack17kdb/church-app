import { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
import {
  FaSave, FaPlus, FaTrash, FaChurch, FaPhone, FaMobile,
  FaClock, FaTags, FaHandsHelping, FaUserTie
} from 'react-icons/fa';

const SettingsPage = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newMinistry, setNewMinistry] = useState('');
  const [removeTarget, setRemoveTarget] = useState(null); // { type: 'category'|'ministry', value }

  useEffect(() => {
    settingsAPI.get()
      .then(res => setSettings(res.data.settings))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const field = name.split('.')[1];
      setSettings(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, [field]: value } }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...settings.servicesTimes];
    updated[index] = { ...updated[index], [field]: value };
    setSettings(prev => ({ ...prev, servicesTimes: updated }));
  };

  const addServiceTime = () => {
    setSettings(prev => ({ ...prev, servicesTimes: [...(prev.servicesTimes || []), { day: 'Sunday', time: '', name: '' }] }));
  };

  const removeServiceTime = (index) => {
    setSettings(prev => ({ ...prev, servicesTimes: prev.servicesTimes.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await settingsAPI.update(settings);
      setSettings(res.data.settings);
      refreshSettings();
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await settingsAPI.addCategory(newCategory.trim());
      setSettings(prev => ({ ...prev, donationCategories: res.data.categories }));
      setNewCategory('');
      toast.success('Category added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleRemoveCategory = async (category) => {
    try {
      const res = await settingsAPI.removeCategory(category);
      setSettings(prev => ({ ...prev, donationCategories: res.data.categories }));
      setRemoveTarget(null);
      toast.success('Category removed');
    } catch (error) {
      toast.error('Failed to remove category');
    }
  };

  const handleAddMinistry = async () => {
    if (!newMinistry.trim()) return;
    try {
      const res = await settingsAPI.addMinistry(newMinistry.trim());
      setSettings(prev => ({ ...prev, ministries: res.data.ministries }));
      setNewMinistry('');
      toast.success('Ministry added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add ministry');
    }
  };

  const handleRemoveMinistry = async (ministry) => {
    try {
      const res = await settingsAPI.removeMinistry(ministry);
      setSettings(prev => ({ ...prev, ministries: res.data.ministries }));
      setRemoveTarget(null);
      toast.success('Ministry removed');
    } catch (error) {
      toast.error('Failed to remove ministry');
    }
  };

  if (loading || !settings) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your church information and configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSave />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Church Information */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChurch className="text-church-500" /> Church Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Church Name</label>
              <input name="churchName" value={settings.churchName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Tagline</label>
              <input name="tagline" value={settings.tagline || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">About Text</label>
              <textarea name="aboutText" value={settings.aboutText || ''} onChange={handleChange} rows={3} className="input-field resize-none" />
            </div>
            <div>
              <label className="input-label">Vision</label>
              <textarea name="visionText" value={settings.visionText || ''} onChange={handleChange} rows={2} className="input-field resize-none" />
            </div>
            <div>
              <label className="input-label">Mission</label>
              <textarea name="missionText" value={settings.missionText || ''} onChange={handleChange} rows={2} className="input-field resize-none" />
            </div>
            <div>
              <label className="input-label">Pastor Name</label>
              <input name="pastorName" value={settings.pastorName || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Pastor's Message</label>
              <textarea name="pastorMessage" value={settings.pastorMessage || ''} onChange={handleChange} rows={3} className="input-field resize-none" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaPhone className="text-church-500" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Phone Number</label>
              <input name="phone" value={settings.phone || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input name="email" value={settings.email || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Physical Address</label>
              <input name="address" value={settings.address || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Facebook URL</label>
              <input name="social.facebook" value={settings.socialMedia?.facebook || ''} onChange={handleChange} className="input-field" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="input-label">YouTube URL</label>
              <input name="social.youtube" value={settings.socialMedia?.youtube || ''} onChange={handleChange} className="input-field" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="input-label">Twitter/X URL</label>
              <input name="social.twitter" value={settings.socialMedia?.twitter || ''} onChange={handleChange} className="input-field" placeholder="https://x.com/..." />
            </div>
            <div>
              <label className="input-label">Instagram URL</label>
              <input name="social.instagram" value={settings.socialMedia?.instagram || ''} onChange={handleChange} className="input-field" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        {/* M-Pesa Settings */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaMobile className="text-church-500" /> M-Pesa Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">M-Pesa Paybill Number</label>
              <input name="mpesaPaybill" value={settings.mpesaPaybill || ''} onChange={handleChange} className="input-field" placeholder="e.g. 123456" />
            </div>
            <div>
              <label className="input-label">Account Number (optional)</label>
              <input name="mpesaAccountNumber" value={settings.mpesaAccountNumber || ''} onChange={handleChange} className="input-field" placeholder="e.g. CHURCH" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Note: For Daraja API STK Push integration, configure MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY and MPESA_SHORTCODE in the server's environment variables.
          </p>
        </div>

        {/* Service Times */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaClock className="text-church-500" /> Service Times
          </h3>
          <div className="space-y-3">
            {(settings.servicesTimes || []).map((svc, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="input-label">Day</label>
                  <select value={svc.day} onChange={e => handleServiceChange(i, 'day', e.target.value)} className="input-field">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="input-label">Time</label>
                  <input value={svc.time} onChange={e => handleServiceChange(i, 'time', e.target.value)} className="input-field" placeholder="e.g. 10:30 AM" />
                </div>
                <div className="flex-1 w-full">
                  <label className="input-label">Service Name</label>
                  <input value={svc.name} onChange={e => handleServiceChange(i, 'name', e.target.value)} className="input-field" placeholder="e.g. Main Service" />
                </div>
                <button onClick={() => removeServiceTime(i)} className="btn-danger px-3 py-3 flex-shrink-0">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addServiceTime} className="btn-secondary mt-4 flex items-center gap-2 text-sm">
            <FaPlus /> Add Service Time
          </button>
        </div>

        {/* Donation Categories - dynamic management */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaTags className="text-church-500" /> Donation Categories
          </h3>
          <p className="text-gray-500 text-sm mb-4">These categories appear on the public Giving page. Add or remove categories as needed.</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {settings.donationCategories.map(cat => (
              <div key={cat} className="flex items-center gap-2 bg-church-50 border border-church-200 rounded-full pl-4 pr-2 py-1.5">
                <span className="text-sm text-church-800 font-medium">{cat}</span>
                <button
                  onClick={() => setRemoveTarget({ type: 'category', value: cat })}
                  className="w-5 h-5 rounded-full bg-church-200 hover:bg-red-200 text-church-700 hover:text-red-600 flex items-center justify-center transition-colors"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              placeholder="New category name (e.g. Sunday School)"
              className="input-field flex-1"
            />
            <button onClick={handleAddCategory} className="btn-primary flex items-center gap-2 px-5">
              <FaPlus /> Add
            </button>
          </div>
        </div>

        {/* Ministries - dynamic management */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaHandsHelping className="text-church-500" /> Ministries
          </h3>
          <p className="text-gray-500 text-sm mb-4">Ministries shown on the member registration form.</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {settings.ministries.map(min => (
              <div key={min} className="flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-full pl-4 pr-2 py-1.5">
                <span className="text-sm text-gold-800 font-medium">{min}</span>
                <button
                  onClick={() => setRemoveTarget({ type: 'ministry', value: min })}
                  className="w-5 h-5 rounded-full bg-gold-200 hover:bg-red-200 text-gold-700 hover:text-red-600 flex items-center justify-center transition-colors"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newMinistry}
              onChange={e => setNewMinistry(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMinistry())}
              placeholder="New ministry name (e.g. Drama Team)"
              className="input-field flex-1"
            />
            <button onClick={handleAddMinistry} className="btn-primary flex items-center gap-2 px-5">
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        title={`Remove ${removeTarget?.type === 'category' ? 'Category' : 'Ministry'}`}
        message={`Are you sure you want to remove "${removeTarget?.value}"? This won't affect existing records that already use it.`}
        confirmText="Remove"
        danger
        onConfirm={() => removeTarget?.type === 'category' ? handleRemoveCategory(removeTarget.value) : handleRemoveMinistry(removeTarget.value)}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
};

export default SettingsPage;
