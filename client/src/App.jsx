import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PWAInstallBanner from './components/common/PWAInstallBanner.jsx';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Public pages
import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import EventsPage from './pages/public/EventsPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';
import GivePage from './pages/public/GivePage.jsx';

// Admin pages
import LoginPage from './pages/admin/LoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import MembersPage from './pages/admin/MembersPage.jsx';
import MemberDetailPage from './pages/admin/MemberDetailPage.jsx';
import DonationsPage from './pages/admin/DonationsPage.jsx';
import NotificationsPage from './pages/admin/NotificationsPage.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';
import UsersPage from './pages/admin/UsersPage.jsx';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } }
          }}
        />
        <PWAInstallBanner />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="/give" element={<PublicLayout><GivePage /></PublicLayout>} />

          {/* Admin login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/members" element={
            <ProtectedRoute><AdminLayout><MembersPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/members/:id" element={
            <ProtectedRoute><AdminLayout><MemberDetailPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/donations" element={
            <ProtectedRoute roles={['admin', 'staff']}><AdminLayout><DonationsPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute roles={['admin', 'pastor']}><AdminLayout><NotificationsPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute roles={['admin']}><AdminLayout><ReportsPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute roles={['admin']}><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={
            <PublicLayout>
              <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                  <h1 className="font-display text-6xl font-bold text-church-600 mb-4">404</h1>
                  <p className="text-gray-500 text-lg">Page not found</p>
                </div>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
