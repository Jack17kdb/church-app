import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  memberName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, trim: true },
  note: { type: String, trim: true },
  mpesaReceipt: { type: String, trim: true },
  transactionId: { type: String, trim: true },
  checkoutRequestId: { type: String, trim: true },
  merchantRequestId: { type: String, trim: true },
  status: { type: String, enum: ['Pending', 'Successful', 'Failed'], default: 'Pending' },
  failureReason: { type: String },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);
