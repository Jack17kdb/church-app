import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext.jsx';
import { memberAPI } from '../../services/api.js';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaUsers, FaCross, FaArrowLeft } from 'react-icons/fa';

const RegisterPage = () => {
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    dateOfBirth: '', gender: '', address: '', occupation: '',
    maritalStatus: '', ministryInterest: [],
    emergencyContact: { name: '', phone: '', relationship: '' },
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setForm(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    } else if (name === 'ministryInterest') {
      setForm(prev => ({
        ...prev,
        ministryInterest: checked
          ? [...prev.ministryInterest, value]
          : prev.ministryInterest.filter(m => m !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await memberAPI.register(form);
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ministries = settings?.ministries || ['Worship', 'Youth', "Children's", 'Ushering', 'Choir', 'Media', 'Intercessory Prayer', 'Evangelism', 'Women', 'Men'];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-church-50 to-white flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Welcome to Our Family!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for registering with {settings?.churchName || 'our church'}. We're excited to have you join our community!
          </p>
          <div className="bg-church-50 rounded-2xl p-6 mb-8">
            <p className="text-church-700 font-medium">What's next?</p>
            <p className="text-gray-600 text-sm mt-2">Our team will reach out to you shortly to complete your onboarding and introduce you to our community.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/" className="btn-primary">Go to Home</Link>
            <Link to="/give" className="btn-secondary">Give via M-Pesa</Link>
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
          <div className="w-16 h-16 rounded-2xl bg-church-600 flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-white text-2xl" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Become a Member</h1>
          <p className="text-gray-600">Join our church community today</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-church-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-16 h-0.5 ${step > s ? 'bg-church-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange}
                      className="input-field" placeholder="John" required />
                  </div>
                  <div>
                    <label className="input-label">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange}
                      className="input-field" placeholder="Doe" required />
                  </div>
                  <div>
                    <label className="input-label">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="input-field" placeholder="07XXXXXXXX" required />
                  </div>
                  <div>
                    <label className="input-label">Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      className="input-field" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="input-label">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Marital Status</label>
                    <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="input-field">
                      <option value="">Select status</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Occupation</label>
                    <input name="occupation" value={form.occupation} onChange={handleChange}
                      className="input-field" placeholder="Your occupation" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="input-label">Home Address</label>
                    <input name="address" value={form.address} onChange={handleChange}
                      className="input-field" placeholder="Area, City" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Emergency Contact */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency Contact</h3>
                <p className="text-gray-500 text-sm mb-6">Someone we can reach in case of emergency</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">Contact Name</label>
                    <input name="emergency.name" value={form.emergencyContact.name} onChange={handleChange}
                      className="input-field" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="input-label">Contact Phone</label>
                    <input name="emergency.phone" value={form.emergencyContact.phone} onChange={handleChange}
                      className="input-field" placeholder="07XXXXXXXX" />
                  </div>
                  <div>
                    <label className="input-label">Relationship</label>
                    <input name="emergency.relationship" value={form.emergencyContact.relationship} onChange={handleChange}
                      className="input-field" placeholder="e.g. Spouse, Parent" />
                  </div>
                  <div>
                    <label className="input-label">Join Date</label>
                    <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange}
                      className="input-field" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ministry Interest */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ministry Interest</h3>
                <p className="text-gray-500 text-sm mb-6">Which ministries would you like to be part of?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ministries.map(ministry => (
                    <label key={ministry} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form.ministryInterest.includes(ministry)
                        ? 'border-church-600 bg-church-50'
                        : 'border-gray-200 hover:border-church-300'
                    }`}>
                      <input
                        type="checkbox"
                        name="ministryInterest"
                        value={ministry}
                        checked={form.ministryInterest.includes(ministry)}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                        form.ministryInterest.includes(ministry) ? 'border-church-600 bg-church-600' : 'border-gray-300'
                      }`}>
                        {form.ministryInterest.includes(ministry) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{ministry}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="btn-ghost flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
              ) : (
                <Link to="/" className="btn-ghost flex items-center gap-2 text-gray-500">
                  <FaArrowLeft /> Cancel
                </Link>
              )}

              {step < 3 ? (
                <button type="button" onClick={() => {
                  if (step === 1 && (!form.firstName || !form.lastName || !form.phone)) {
                    toast.error('Please fill in required fields (First Name, Last Name, Phone)');
                    return;
                  }
                  setStep(s => s + 1);
                }}
                  className="btn-primary">
                  Continue
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><FaCross /> Complete Registration</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
