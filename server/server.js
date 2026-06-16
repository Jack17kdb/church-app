import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import User from './models/User.js';
import ChurchSettings from './models/ChurchSettings.js';

const PORT = process.env.PORT || 5000;

const seedDatabase = async () => {
  try {
    // Create default admin if none exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      await User.create({
        name: 'Church Admin',
        email: 'admin@church.com',
        password: 'Admin@1234',
        role: 'admin'
      });
      console.log('✅ Default admin created: admin@church.com / Admin@1234');
    }

    // Create default pastor account if none exists
    const pastorCount = await User.countDocuments({ role: 'pastor' });
    if (pastorCount === 0) {
      await User.create({
        name: 'Senior Pastor',
        email: 'pastor@church.com',
        password: 'Pastor@1234',
        role: 'pastor'
      });
      console.log('✅ Default pastor created: pastor@church.com / Pastor@1234');
    }

    // Create default church settings if none exists
    const settingsCount = await ChurchSettings.countDocuments();
    if (settingsCount === 0) {
      await ChurchSettings.create({
        churchName: 'Grace Community Church',
        tagline: 'A Place to Belong, A Community to Grow',
        phone: '+254 700 000 000',
        email: 'info@gracechurch.co.ke',
        address: 'Nairobi, Kenya',
        mpesaPaybill: '123456',
        servicesTimes: [
          { day: 'Sunday', time: '8:00 AM', name: 'Early Morning Service' },
          { day: 'Sunday', time: '10:30 AM', name: 'Main Service' },
          { day: 'Wednesday', time: '6:00 PM', name: 'Midweek Service' },
          { day: 'Friday', time: '7:00 PM', name: 'Youth Service' }
        ],
        aboutText: 'We are a vibrant, Spirit-filled church committed to transforming lives through the power of the Gospel. Founded on the principles of love, faith, and community, we welcome everyone into our family.',
        visionText: 'To be a beacon of hope and transformation in our community and beyond, raising disciples who impact every sphere of society.',
        missionText: 'To worship God wholeheartedly, grow together in His Word, and serve our community with love and compassion.',
        pastorName: 'Pastor John Kamau',
        pastorMessage: 'Welcome to Grace Community Church! We believe that God has a wonderful plan for your life. Whatever season you find yourself in, you are not alone. We invite you to come as you are and discover the transforming love of Jesus Christ.'
      });
      console.log('✅ Default church settings created');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
