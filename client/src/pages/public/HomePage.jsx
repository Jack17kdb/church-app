import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext.jsx';
import { notificationAPI } from '../../services/api.js';
import {
  FaArrowRight, FaPlay, FaCross, FaHeart, FaPray,
  FaUsers, FaBell, FaCalendarAlt, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaChevronDown, FaBullhorn
} from 'react-icons/fa';
import { format } from 'date-fns';

const NOTIFICATION_PRIORITY_COLORS = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  normal: 'bg-church-600',
  low: 'bg-gray-500'
};

const NOTIFICATION_TYPE_ICONS = {
  announcement: FaBullhorn,
  event: FaCalendarAlt,
  project: FaHeart,
  prayer: FaPray,
  urgent: FaBell,
  general: FaBell
};

const HomePage = () => {
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationAPI.getPublic()
      .then(res => setNotifications(res.data.notifications))
      .catch(() => {});
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-pattern z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/hero.jpeg)",
          }}
        />

        {/* Animated particles */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`
              }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-8">
            <FaCross className="text-gold-300 text-sm" />
            <span className="text-sm font-medium text-white/90">Welcome to Our Church Community</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            {settings?.churchName || 'Grace Community Church'}
          </h1>

          <p className="text-xl md:text-2xl text-white/85 font-light mb-4 max-w-2xl mx-auto">
            {settings?.tagline || 'A Place to Belong, A Community to Grow'}
          </p>

          <p className="text-white/70 text-lg mb-12 max-w-xl mx-auto">
            Join thousands of believers growing in faith, love, and purpose.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register" className="btn-gold text-base px-8 py-4 flex items-center gap-2 shadow-2xl">
              <FaUsers /> Become a Member
            </Link>
            <Link to="/give" className="btn-secondary text-base px-8 py-4 flex items-center gap-2 bg-white/10 border-white/40 text-white hover:bg-white/20">
              <FaHeart /> Give via M-Pesa
            </Link>
          </div>

          {/* Service times quick view */}
          {settings?.servicesTimes?.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {settings.servicesTimes.slice(0, 3).map((svc, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
                  <p className="text-white font-semibold text-sm">{svc.name}</p>
                  <p className="text-white/70 text-xs">{svc.day} · {svc.time}</p>
                </div>
              ))}
            </div>
          )}

          {/* Scroll indicator */}
          <button
            onClick={() => scrollToSection('about')}
            className="mt-16 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors mx-auto"
          >
            <span className="text-xs uppercase tracking-wider">Explore</span>
            <FaChevronDown className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* NOTIFICATIONS BANNER */}
      {notifications.length > 0 && (
        <section className="bg-church-900 py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <FaBell className="text-gold-400 animate-pulse" />
                <span className="text-white text-sm font-semibold">Latest Announcements:</span>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-1">
                {notifications.slice(0, 5).map(notif => {
                  const priorityColor = NOTIFICATION_PRIORITY_COLORS[notif.priority] || 'bg-church-600';
                  return (
                    <div key={notif._id} className="flex items-center gap-2 flex-shrink-0">
                      <span className={`w-2 h-2 rounded-full ${priorityColor} flex-shrink-0`} />
                      <span className="text-white/90 text-sm">{notif.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-3">About Our Church</p>
              <h2 className="section-heading mb-6">
                A Community Built on <span className="gradient-text">Faith & Love</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {settings?.aboutText || 'We are a vibrant, Spirit-filled church committed to transforming lives through the power of the Gospel. Founded on the principles of love, faith, and community, we welcome everyone into our family.'}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-church-50 rounded-2xl p-5">
                  <h4 className="font-bold text-church-800 mb-2 font-display">Our Vision</h4>
                  <p className="text-gray-600 text-sm">{settings?.visionText || 'To be a beacon of hope and transformation in our community and beyond.'}</p>
                </div>
                <div className="bg-gold-50 rounded-2xl p-5">
                  <h4 className="font-bold text-gold-800 mb-2 font-display">Our Mission</h4>
                  <p className="text-gray-600 text-sm">{settings?.missionText || 'To worship God wholeheartedly, grow together in His Word, and serve our community.'}</p>
                </div>
              </div>

              <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                Learn More <FaArrowRight />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/edwin.jpg"
                  alt="Church community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-church-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-4xl font-bold font-display">20+</p>
                <p className="text-church-200 text-sm">Years of Ministry</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gradient-to-r from-church-700 to-church-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Church Members', value: '500+' },
              { label: 'Years of Service', value: '20+' },
              { label: 'Weekly Services', value: '4' },
              { label: 'Active Ministries', value: (settings?.ministries?.length || 10) + '+' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-bold font-display text-white mb-2">{stat.value}</p>
                <p className="text-church-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE TIMES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-3">Join Us</p>
            <h2 className="section-heading">Service Times</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(settings?.servicesTimes?.length > 0
              ? settings.servicesTimes
              : [
                { day: 'Sunday', time: '8:00 AM', name: 'Early Morning Service' },
                { day: 'Sunday', time: '10:30 AM', name: 'Main Service' },
                { day: 'Wednesday', time: '6:00 PM', name: 'Midweek Service' },
                { day: 'Friday', time: '7:00 PM', name: 'Youth Service' }
              ]
            ).map((svc, i) => (
              <div key={i} className="card-hover text-center group">
                <div className="w-14 h-14 rounded-2xl bg-church-50 group-hover:bg-church-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <FaPray className="text-church-600 group-hover:text-white text-xl transition-colors" />
                </div>
                <p className="font-semibold text-church-800 text-lg mb-1">{svc.day}</p>
                <p className="text-3xl font-bold font-display text-church-600 mb-2">{svc.time}</p>
                <p className="text-gray-500 text-sm">{svc.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS / ANNOUNCEMENTS */}
      {notifications.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-3">Stay Updated</p>
              <h2 className="section-heading">Church Announcements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notifications.map(notif => {
                const Icon = NOTIFICATION_TYPE_ICONS[notif.type] || FaBell;
                const priorityColor = NOTIFICATION_PRIORITY_COLORS[notif.priority] || 'bg-church-600';
                return (
                  <div key={notif._id} className="card-hover group">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${priorityColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="text-white text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {notif.priority === 'urgent' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">URGENT</span>
                          )}
                          <span className="text-xs text-gray-400 capitalize">{notif.type}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-church-600 transition-colors">{notif.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{notif.message}</p>
                        {notif.expiresAt && (
                          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-300" />
                            Until {format(new Date(notif.expiresAt), 'dd MMM yyyy')}
                          </p>
                        )}
                        {notif.createdBy?.name && (
                          <p className="text-xs text-church-500 mt-2">— {notif.createdBy.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PASTOR MESSAGE */}
      {settings?.pastorMessage && (
        <section className="py-24 bg-church-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <FaCross className="text-church-600 text-3xl mx-auto mb-6" />
            <blockquote className="font-display text-2xl md:text-3xl text-church-900 font-medium italic leading-relaxed mb-8">
              "{settings.pastorMessage}"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-church-600 flex items-center justify-center">
                <span className="text-white font-bold">
                  {settings.pastorName?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{settings?.pastorName || 'Senior Pastor'}</p>
                <p className="text-gray-500 text-sm">{settings?.churchName}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GIVING CTA */}
      <section className="py-24 bg-gradient-to-br from-church-700 via-church-800 to-church-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FaHeart className="text-gold-400 text-3xl mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Partner With Us
          </h2>
          <p className="text-church-200 text-xl mb-10 max-w-2xl mx-auto">
            Your generosity enables us to serve our community and spread the Gospel. Give securely via M-Pesa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/give" className="btn-gold text-lg px-10 py-4 flex items-center justify-center gap-2 shadow-2xl">
              <FaHeart /> Give via M-Pesa
            </Link>
            <Link to="/register" className="btn-secondary border-white/40 text-white text-lg px-10 py-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20">
              <FaUsers /> Join Our Family
            </Link>
          </div>
          {settings?.mpesaPaybill && (
            <p className="text-church-300 mt-8 text-sm">
              Paybill: <span className="text-white font-bold text-lg">{settings.mpesaPaybill}</span>
            </p>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-3">Get In Touch</p>
            <h2 className="section-heading">Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaPhone,
                label: 'Phone',
                value: settings?.phone || '+254 700 000 000',
                color: 'bg-blue-50 text-blue-600'
              },
              {
                icon: FaEnvelope,
                label: 'Email',
                value: settings?.email || 'info@church.co.ke',
                color: 'bg-green-50 text-green-600'
              },
              {
                icon: FaMapMarkerAlt,
                label: 'Location',
                value: settings?.address || 'Nairobi, Kenya',
                color: 'bg-red-50 text-red-600'
              }
            ].map((item, i) => (
              <div key={i} className="card text-center">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="text-2xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{item.label}</h4>
                <p className="text-gray-500">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
