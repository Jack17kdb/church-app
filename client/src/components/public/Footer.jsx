import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext.jsx';
import { FaCross, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-church-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Church info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-church-600 flex items-center justify-center">
                <FaCross className="text-white" />
              </div>
              <h3 className="font-display text-xl font-bold">{settings?.churchName || 'Grace Community Church'}</h3>
            </div>
            <p className="text-church-200 text-sm leading-relaxed mb-6 max-w-sm">
              {settings?.aboutText?.slice(0, 150) || 'A Spirit-filled community committed to transforming lives through the power of the Gospel.'}...
            </p>
            <div className="flex gap-3">
              {settings?.socialMedia?.facebook && (
                <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-church-800 hover:bg-church-600 flex items-center justify-center transition-colors">
                  <FaFacebook size={16} />
                </a>
              )}
              {settings?.socialMedia?.twitter && (
                <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-church-800 hover:bg-church-600 flex items-center justify-center transition-colors">
                  <FaTwitter size={16} />
                </a>
              )}
              {settings?.socialMedia?.youtube && (
                <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-church-800 hover:bg-church-600 flex items-center justify-center transition-colors">
                  <FaYoutube size={16} />
                </a>
              )}
              {settings?.socialMedia?.instagram && (
                <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-church-800 hover:bg-church-600 flex items-center justify-center transition-colors">
                  <FaInstagram size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase text-xs tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/events', label: 'Events' },
                { to: '/give', label: 'Give Online' },
                { to: '/register', label: 'Become a Member' }
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-church-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase text-xs tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              {settings?.phone && (
                <li className="flex items-center gap-3 text-church-300 text-sm">
                  <FaPhone size={14} className="text-church-400 flex-shrink-0" />
                  {settings.phone}
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-3 text-church-300 text-sm">
                  <FaEnvelope size={14} className="text-church-400 flex-shrink-0" />
                  {settings.email}
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-3 text-church-300 text-sm">
                  <FaMapMarkerAlt size={14} className="text-church-400 flex-shrink-0 mt-0.5" />
                  {settings.address}
                </li>
              )}
            </ul>

            {settings?.mpesaPaybill && (
              <div className="mt-5 p-4 bg-church-800 rounded-xl">
                <p className="text-xs text-church-300 mb-1">M-Pesa Paybill</p>
                <p className="text-white font-bold text-lg">{settings.mpesaPaybill}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-church-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-church-400 text-sm">© {year} {settings?.churchName || 'Grace Community Church'}. All rights reserved.</p>
          <Link to="/admin/login" className="text-church-500 hover:text-church-300 text-xs transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
