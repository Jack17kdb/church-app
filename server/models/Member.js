import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String, trim: true },
  occupation: { type: String, trim: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'] },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true }
  },
  ministryInterest: [{ type: String }],
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, { timestamps: true });

memberSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

memberSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Member', memberSchema);
