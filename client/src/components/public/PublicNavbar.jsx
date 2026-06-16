import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext.jsx';
import { FaBars, FaTimes, FaCross } from 'react-icons/fa';

const PublicNavbar = () => {
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/events', label: 'Events' },
    { to: '/give', label: 'Give' },
    { to: '/register', label: 'Join Us' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              scrolled ? 'bg-church-600' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <FaCross className={`text-lg ${scrolled ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
              <span className={`font-display font-bold text-lg leading-tight block ${
                scrolled ? 'text-church-800' : 'text-white'
              }`}>
                {settings?.churchName || 'Grace Community Church'}
              </span>
              {settings?.tagline && (
                <span className={`text-xs hidden sm:block ${scrolled ? 'text-gray-500' : 'text-white/80'}`}>
                  {settings.tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? (scrolled ? 'text-church-600 bg-church-50' : 'text-white bg-white/20')
                    : (scrolled ? 'text-gray-600 hover:text-church-600 hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/10')
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/give" className="ml-3 btn-gold text-sm py-2.5">
              Give Now
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-church-600 bg-church-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/give" className="block mt-2 btn-gold text-center text-sm">
              Give via M-Pesa
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
