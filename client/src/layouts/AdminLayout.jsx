import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import {
  FaTachometerAlt, FaUsers, FaDonate, FaChartBar,
  FaCog, FaBell, FaSignOutAlt, FaBars, FaTimes,
  FaCross, FaChevronRight, FaUserShield
} from 'react-icons/fa';

const AdminSidebar = ({ children }) => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const allNavItems = [
    { to: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard', roles: ['admin', 'pastor', 'staff'] },
    { to: '/admin/members', icon: FaUsers, label: 'Members', roles: ['admin', 'pastor', 'staff'] },
    { to: '/admin/donations', icon: FaDonate, label: 'Donations', roles: ['admin', 'staff'] },
    { to: '/admin/notifications', icon: FaBell, label: 'Notifications', roles: ['admin', 'pastor'] },
    { to: '/admin/reports', icon: FaChartBar, label: 'Reports', roles: ['admin'] },
    { to: '/admin/settings', icon: FaCog, label: 'Settings', roles: ['admin'] },
    { to: '/admin/users', icon: FaUserShield, label: 'Users', roles: ['admin'] }
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-church-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <div className="w-9 h-9 rounded-full bg-church-500 flex items-center justify-center flex-shrink-0">
            <FaCross className="text-white text-sm" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              {settings?.churchName || 'Grace Church'}
            </p>
            <p className="text-church-400 text-xs">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
              isActive(to)
                ? 'bg-church-600 text-white shadow-md'
                : 'text-church-300 hover:bg-church-800 hover:text-white'
            }`}
          >
            <Icon className={`text-base flex-shrink-0 ${isActive(to) ? 'text-white' : 'text-church-400 group-hover:text-white'}`} />
            <span className="flex-1">{label}</span>
            {isActive(to) && <FaChevronRight className="text-xs opacity-70" />}
          </Link>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="px-3 py-4 border-t border-church-800">
        <div className="flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-church-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-church-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-church-300 hover:bg-church-800 hover:text-white transition-all text-sm font-medium"
        >
          <FaSignOutAlt className="text-base flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-church-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-church-900 flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaBars size={20} />
          </button>
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-church-600 flex items-center justify-center">
              <FaCross className="text-white text-xs" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">{settings?.churchName?.split(' ')[0] || 'Church'} Admin</span>
          </Link>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;
