import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { memberAPI } from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';
import {
  FaArrowLeft, FaSave, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaBriefcase, FaHeart, FaCalendarAlt, FaShieldAlt, FaDonate
} from 'react-icons/fa';

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    memberAPI.getOne(id)
      .then(res => {
        setMember(res.data.member);
        setDonations(res.data.donations);
        setForm(res.data.member);
      })
      .catch(() => toast.error('Failed to load member'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setForm(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await memberAPI.update(id, form);
      setMember(res.data.member);
      setEditMode(false);
      toast.success('Member updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!member) return null;

  const totalDonated = donations.filter(d => d.status === 'Successful').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button onClick={() => navigate('/admin/members')} className="btn-ghost flex items-center gap-2 text-gray-500">
          <FaArrowLeft /> Back to Members
        </button>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button onClick={() => { setEditMode(false); setForm(member); }} className="btn-ghost border border-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSave />}
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn-primary">Edit Member</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="card text-center sticky top-6">
            <div className="w-24 h-24 rounded-full bg-church-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-church-600 font-display">
                {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">{member.firstName} {member.lastName}</h2>
            <p className="text-gray-500 text-sm mb-4">Member since {new Date(member.joinDate || member.createdAt).toLocaleDateString()}</p>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-church-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Total Given</p>
                <p className="font-bold text-church-700">KES {totalDonated.toLocaleString()}</p>
              </div>
              <div className="bg-gold-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Donations</p>
                <p className="font-bold text-gold-700">{donations.filter(d => d.status === 'Successful').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-church-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} editMode={editMode} />
              <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} editMode={editMode} />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} editMode={editMode} icon={FaPhone} />
              <Field label="Email" name="email" value={form.email} onChange={handleChange} editMode={editMode} icon={FaEnvelope} />
              <Field label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth ? form.dateOfBirth.split('T')[0] : ''} onChange={handleChange} editMode={editMode} />
              <Field label="Gender" name="gender" value={form.gender} onChange={handleChange} editMode={editMode} type="select" options={['Male', 'Female', 'Other']} />
              <Field label="Marital Status" name="maritalStatus" value={form.maritalStatus} onChange={handleChange} editMode={editMode} type="select" options={['Single', 'Married', 'Divorced', 'Widowed', 'Other']} />
              <Field label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} editMode={editMode} icon={FaBriefcase} />
              <Field label="Address" name="address" value={form.address} onChange={handleChange} editMode={editMode} icon={FaMapMarkerAlt} className="sm:col-span-2" />
            </div>
          </div>

          {/* Emergency contact */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-church-500" /> Emergency Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Name" name="emergency.name" value={form.emergencyContact?.name} onChange={handleChange} editMode={editMode} />
              <Field label="Phone" name="emergency.phone" value={form.emergencyContact?.phone} onChange={handleChange} editMode={editMode} />
              <Field label="Relationship" name="emergency.relationship" value={form.emergencyContact?.relationship} onChange={handleChange} editMode={editMode} />
            </div>
          </div>

          {/* Ministry interest */}
          {member.ministryInterest?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeart className="text-church-500" /> Ministry Interest
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.ministryInterest.map(m => (
                  <span key={m} className="badge-info">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Donation history */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaDonate className="text-church-500" /> Donation History
            </h3>
            {donations.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No donation records found</p>
            ) : (
              <div className="space-y-2">
                {donations.map(d => (
                  <div key={d._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{d.category}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <FaCalendarAlt /> {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">KES {d.amount.toLocaleString()}</p>
                      <span className={
                        d.status === 'Successful' ? 'badge-success' :
                        d.status === 'Pending' ? 'badge-pending' : 'badge-failed'
                      }>{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, editMode, type = 'text', icon: Icon, options, className = '' }) => (
  <div className={className}>
    <label className="input-label">{label}</label>
    {editMode ? (
      type === 'select' ? (
        <select name={name} value={value || ''} onChange={onChange} className="input-field">
          <option value="">Select</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value || ''} onChange={onChange} className="input-field" />
      )
    ) : (
      <div className="flex items-center gap-2 text-gray-700 py-2.5">
        {Icon && <Icon className="text-gray-400 text-sm" />}
        <span>{value || '—'}</span>
      </div>
    )}
  </div>
);

export default MemberDetailPage;
