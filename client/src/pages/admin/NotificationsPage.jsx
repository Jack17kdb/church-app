import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  FaBell, FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash,
  FaCalendarAlt, FaTimes
} from 'react-icons/fa';

const TYPE_OPTIONS = ['announcement', 'event', 'project', 'prayer', 'urgent', 'general'];
const PRIORITY_OPTIONS = ['low', 'normal', 'high', 'urgent'];

const PRIORITY_COLORS = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  normal: 'bg-church-100 text-church-700',
  low: 'bg-gray-100 text-gray-600'
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      title: '', message: '', type: 'announcement', priority: 'normal',
      isPublished: false, expiresAt: '', actionLink: '', actionText: ''
    };
  }

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getAll({ limit: 50 });
      setNotifications(res.data.notifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (notif) => {
    setEditing(notif);
    setForm({
      title: notif.title,
      message: notif.message,
      type: notif.type,
      priority: notif.priority,
      isPublished: notif.isPublished,
      expiresAt: notif.expiresAt ? notif.expiresAt.split('T')[0] : '',
      actionLink: notif.actionLink || '',
      actionText: notif.actionText || ''
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error('Title and message are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, expiresAt: form.expiresAt || null };
      if (editing) {
        await notificationAPI.update(editing._id, payload);
        toast.success('Notification updated');
      } else {
        await notificationAPI.create(payload);
        toast.success('Notification created');
      }
      setModalOpen(false);
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save notification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await notificationAPI.delete(deleteTarget._id);
      toast.success('Notification deleted');
      setDeleteTarget(null);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const togglePublish = async (notif) => {
    try {
      await notificationAPI.togglePublish(notif._id);
      toast.success(notif.isPublished ? 'Unpublished' : 'Published to website');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Share announcements and updates with your congregation</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FaPlus /> New Notification
        </button>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : notifications.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaBell}
            title="No notifications yet"
            message="Create your first announcement for the congregation"
            action={<button onClick={openCreate} className="btn-primary">Create Notification</button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notifications.map(notif => (
            <div key={notif._id} className="card flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${PRIORITY_COLORS[notif.priority]}`}>
                  {notif.priority}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  notif.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {notif.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{notif.title}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-3 flex-1">{notif.message}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span className="capitalize">{notif.type}</span>
                <span>·</span>
                <span>{notif.createdBy?.name}</span>
                {notif.expiresAt && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><FaCalendarAlt /> {format(new Date(notif.expiresAt), 'dd MMM')}</span>
                  </>
                )}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => togglePublish(notif)} className="flex-1 btn-ghost border border-gray-200 text-sm flex items-center justify-center gap-2">
                  {notif.isPublished ? <FaEyeSlash /> : <FaEye />}
                  {notif.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(notif)} className="p-2.5 text-church-600 hover:bg-church-50 rounded-lg transition-colors">
                  <FaEdit />
                </button>
                <button onClick={() => setDeleteTarget(notif)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-display text-xl font-bold text-gray-900">
                {editing ? 'Edit Notification' : 'New Notification'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="input-label">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. New Building Project Launch" required />
              </div>

              <div>
                <label className="input-label">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="input-field resize-none"
                  placeholder="Share details about this announcement..." required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Type</label>
                  <select name="type" value={form.type} onChange={handleChange} className="input-field capitalize">
                    {TYPE_OPTIONS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange} className="input-field capitalize">
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Expires On (optional)</label>
                <input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange} className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Action Link (optional)</label>
                  <input name="actionLink" value={form.actionLink} onChange={handleChange} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="input-label">Action Text</label>
                  <input name="actionText" value={form.actionText} onChange={handleChange} className="input-field" placeholder="Learn more" />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-church-50 rounded-xl cursor-pointer">
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange}
                  className="w-5 h-5 rounded text-church-600 focus:ring-church-500" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Publish to website</p>
                  <p className="text-gray-500 text-xs">Visible to all visitors immediately</p>
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost border border-gray-200 flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {editing ? 'Save Changes' : 'Create Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Notification"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default NotificationsPage;
