import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext.jsx';
import { donationAPI } from '../../services/api.js';
import toast from 'react-hot-toast';
import { FaHeart, FaCheckCircle, FaSpinner, FaMobile, FaInfoCircle } from 'react-icons/fa';

const AMOUNT_PRESETS = [100, 500, 1000, 2000, 5000, 10000];

const GivePage = () => {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [donationId, setDonationId] = useState(null);
  const [statusCheck, setStatusCheck] = useState(null);
  const [form, setForm] = useState({
    memberName: '', phone: '', amount: '', category: '', note: ''
  });

  const categories = settings?.donationCategories || ['Tithe', 'Offering', 'Building Fund', 'Thanksgiving', 'Missions'];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAmountPreset = (amount) => {
    setForm(prev => ({ ...prev, amount: String(amount) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.memberName || !form.phone || !form.amount || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (Number(form.amount) < 1) {
      toast.error('Amount must be at least KES 1');
      return;
    }

    setLoading(true);
    try {
      const res = await donationAPI.initiate(form);
      setDonationId(res.data.donationId);
      setSubmitted(true);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Poll for status after submission
  useEffect(() => {
    if (!donationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await donationAPI.checkStatus(donationId);
        if (res.data.status !== 'Pending') {
          setStatusCheck(res.data.status);
          clearInterval(interval);
        }
      } catch {}
    }, 5000);
    const timeout = setTimeout(() => clearInterval(interval), 120000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [donationId]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            {statusCheck === 'Successful' ? (
              <>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your donation of <strong>KES {form.amount}</strong> for <strong>{form.category}</strong> has been received. God bless you!</p>
              </>
            ) : statusCheck === 'Failed' ? (
              <>
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                  <span className="text-red-500 text-4xl">✕</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Payment Failed</h2>
                <p className="text-gray-600 mb-6">The payment was not completed. Please try again.</p>
                <button onClick={() => { setSubmitted(false); setStatusCheck(null); setDonationId(null); }} className="btn-primary w-full">
                  Try Again
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-church-100 flex items-center justify-center mx-auto mb-5">
                  <FaMobile className="text-church-600 text-4xl" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Check Your Phone</h2>
                <p className="text-gray-600 mb-4">
                  An M-Pesa STK push has been sent to <strong>{form.phone}</strong>. Enter your PIN to complete the payment.
                </p>
                <div className="bg-church-50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-church-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-church-700 space-y-1">
                      <p><strong>Amount:</strong> KES {Number(form.amount).toLocaleString()}</p>
                      <p><strong>Category:</strong> {form.category}</p>
                      <p><strong>Paybill:</strong> {settings?.mpesaPaybill || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
                  <FaSpinner className="animate-spin" />
                  Waiting for payment confirmation...
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-white text-2xl" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Give Securely</h1>
          <p className="text-gray-600 text-lg">Through M-Pesa</p>
          {settings?.mpesaPaybill && (
            <div className="inline-flex items-center gap-3 mt-4 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6" />
              <span className="text-green-800 font-semibold">Paybill: {settings.mpesaPaybill}</span>
            </div>
          )}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Full Name *</label>
                <input name="memberName" value={form.memberName} onChange={handleChange}
                  className="input-field" placeholder="Your full name" required />
              </div>
              <div>
                <label className="input-label">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="input-field" placeholder="07XXXXXXXX" required />
                <p className="text-xs text-gray-400 mt-1">M-Pesa registered number</p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="input-label">Donation Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                      form.category === cat
                        ? 'border-church-600 bg-church-600 text-white shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-church-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="input-label">Amount (KES) *</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {AMOUNT_PRESETS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAmountPreset(preset)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      form.amount === String(preset)
                        ? 'border-gold-500 bg-gold-50 text-gold-700'
                        : 'border-gray-200 text-gray-600 hover:border-gold-300'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}K` : preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input-field text-lg font-semibold"
                placeholder="Or enter custom amount"
                min="1"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="input-label">Note (Optional)</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Any special note or purpose..."
              />
            </div>

            {/* Summary */}
            {form.amount && form.category && (
              <div className="bg-church-50 border border-church-200 rounded-xl p-4">
                <p className="text-church-700 font-semibold text-sm mb-2">Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{form.category}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-church-700 text-lg">KES {Number(form.amount).toLocaleString()}</span>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full text-base py-4 flex items-center justify-center gap-3">
              {loading ? (
                <><FaSpinner className="animate-spin" /> Processing...</>
              ) : (
                <><FaHeart /> Pay with M-Pesa</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Secured by Safaricom M-Pesa. Your transaction is encrypted and safe.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GivePage;
