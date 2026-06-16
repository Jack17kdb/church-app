import { useSettings } from '../../context/SettingsContext.jsx';
import { Link } from 'react-router-dom';
import { FaCross, FaEye, FaBullseye, FaHeart, FaUsers, FaHandsHelping, FaPray } from 'react-icons/fa';

const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-church-700 via-church-800 to-church-900 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
          <FaCross className="text-gold-400 text-3xl mx-auto mb-5" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About {settings?.churchName || 'Our Church'}</h1>
          <p className="text-church-200 text-lg max-w-2xl mx-auto">
            {settings?.tagline || 'A Place to Belong, A Community to Grow'}
          </p>
        </div>
      </section>

      {/* About story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
            <h2 className="section-heading">Who We Are</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed text-center">
            {settings?.aboutText || 'We are a vibrant, Spirit-filled church committed to transforming lives through the power of the Gospel. Founded on the principles of love, faith, and community, we welcome everyone into our family. Our doors are open to people from all walks of life, and we believe everyone has a place in God\'s house.'}
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 rounded-2xl bg-church-100 flex items-center justify-center mx-auto mb-5">
                <FaEye className="text-church-600 text-2xl" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                {settings?.visionText || 'To be a beacon of hope and transformation in our community and beyond, raising disciples who impact every sphere of society.'}
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold-100 flex items-center justify-center mx-auto mb-5">
                <FaBullseye className="text-gold-600 text-2xl" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                {settings?.missionText || 'To worship God wholeheartedly, grow together in His Word, and serve our community with love and compassion.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-3">What Drives Us</p>
            <h2 className="section-heading">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaHeart, title: 'Love', desc: 'We love God and one another unconditionally' },
              { icon: FaPray, title: 'Faith', desc: 'We trust God in every season of life' },
              { icon: FaUsers, title: 'Community', desc: 'We grow stronger together as family' },
              { icon: FaHandsHelping, title: 'Service', desc: 'We serve our community with compassion' }
            ].map((value, i) => (
              <div key={i} className="card-hover text-center">
                <div className="w-14 h-14 rounded-2xl bg-church-50 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-church-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-gray-500 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor */}
      {settings?.pastorMessage && (
        <section className="py-20 bg-church-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-1 flex justify-center">
                <div className="w-40 h-40 rounded-full bg-church-600 flex items-center justify-center shadow-xl">
                  <span className="text-white text-5xl font-bold font-display">
                    {settings?.pastorName?.charAt(0) || 'P'}
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 text-center md:text-left">
                <p className="text-church-600 font-semibold text-sm uppercase tracking-wider mb-2">A Message From</p>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">{settings?.pastorName || 'Our Pastor'}</h3>
                <p className="text-gray-600 leading-relaxed italic">"{settings.pastorMessage}"</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-6">Ready to Take the Next Step?</h2>
          <p className="text-gray-600 text-lg mb-8">We'd love to welcome you into our church family.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">Become a Member</Link>
            <Link to="/give" className="btn-secondary">Give via M-Pesa</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
