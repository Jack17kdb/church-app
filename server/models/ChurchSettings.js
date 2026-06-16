import mongoose from 'mongoose';

const churchSettingsSchema = new mongoose.Schema({
  churchName: { type: String, default: 'Grace Community Church', trim: true },
  tagline: { type: String, default: 'A Place to Belong, A Community to Grow', trim: true },
  logo: { type: String },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
  website: { type: String, trim: true },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    instagram: { type: String }
  },
  mpesaPaybill: { type: String, trim: true },
  mpesaAccountNumber: { type: String, trim: true },
  servicesTimes: [{
    day: String,
    time: String,
    name: String
  }],
  donationCategories: {
    type: [String],
    default: ['Tithe', 'Offering', 'Building Fund', 'Thanksgiving', 'Missions', 'Youth Ministry', "Children's Ministry", 'Special Seed', 'Other']
  },
  ministries: {
    type: [String],
    default: ['Worship', 'Youth', "Children's", 'Ushering', 'Choir', 'Media', 'Intercessory Prayer', 'Evangelism', 'Women', 'Men']
  },
  aboutText: { type: String },
  visionText: { type: String },
  missionText: { type: String },
  pastorName: { type: String },
  pastorMessage: { type: String },
  pastorImage: { type: String }
}, { timestamps: true });

export default mongoose.model('ChurchSettings', churchSettingsSchema);
