import PublicNavbar from '../components/public/PublicNavbar.jsx';
import Footer from '../components/public/Footer.jsx';

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
