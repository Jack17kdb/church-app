import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api.js';
import { FaCalendarAlt, FaBell, FaBullhorn, FaHeart, FaPray, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';

const TYPE_ICONS = {
  announcement: FaBullhorn,
  event: FaCalendarAlt,
  project: FaHeart,
  prayer: FaPray,
  urgent: FaBell,
  general: FaBell
};

const TYPE_COLORS = {
  announcement: 'bg-blue-100 text-blue-700',
  event: 'bg-purple-100 text-purple-700',
  project: 'bg-gold-100 text-gold-700',
  prayer: 'bg-green-100 text-green-700',
  urgent: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700'
};

const PRIORITY_BORDER = {
  urgent: 'border-l-4 border-red-500',
  high: 'border-l-4 border-orange-500',
  normal: 'border-l-4 border-church-500',
  low: 'border-l-4 border-gray-300'
};

const EventsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    notificationAPI.getPublic()
      .then(res => setNotifications(res.data.notifications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const types = ['all', 'event', 'announcement', 'project', 'prayer'];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-church-700 via-church-800 to-church-900 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
          <FaCalendarAlt className="text-gold-400 text-3xl mx-auto mb-5" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Events & Announcements</h1>
          <p className="text-church-200 text-lg">Stay connected with what's happening in our church</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                  filter === type
                    ? 'bg-church-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <FaSpinner className="text-church-600 text-3xl animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FaBell className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No announcements right now</h3>
              <p className="text-gray-400">Check back soon for updates on church events and news.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(notif => {
                const Icon = TYPE_ICONS[notif.type] || FaBell;
                return (
                  <div key={notif._id} className={`card ${PRIORITY_BORDER[notif.priority] || PRIORITY_BORDER.normal}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${TYPE_COLORS[notif.type] || TYPE_COLORS.general} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{notif.title}</h3>
                          {notif.priority === 'urgent' && (
                            <span className="badge-urgent">Urgent</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[notif.type] || TYPE_COLORS.general}`}>
                            {notif.type}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-3">{notif.message}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                          {notif.publishedAt && (
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt /> {format(new Date(notif.publishedAt), 'dd MMM yyyy')}
                            </span>
                          )}
                          {notif.expiresAt && (
                            <span>Until {format(new Date(notif.expiresAt), 'dd MMM yyyy')}</span>
                          )}
                          {notif.createdBy?.name && (
                            <span>by {notif.createdBy.name}</span>
                          )}
                        </div>
                        {notif.actionLink && (
                          <a href={notif.actionLink} target="_blank" rel="noopener noreferrer"
                            className="inline-block mt-3 text-church-600 font-medium text-sm hover:underline">
                            {notif.actionText || 'Learn more'} →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
