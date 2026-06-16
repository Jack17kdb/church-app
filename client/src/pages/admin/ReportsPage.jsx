import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { FaPrint, FaUsers, FaDonate, FaTrophy } from 'react-icons/fa';

const COLORS = ['#7c3aed', '#a78bfa', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ReportsPage = () => {
  const [donationReport, setDonationReport] = useState(null);
  const [memberReport, setMemberReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [dRes, mRes] = await Promise.all([
        reportsAPI.donations({ startDate, endDate }),
        reportsAPI.members()
      ]);
      setDonationReport(dRes.data.report);
      setMemberReport(mRes.data.report);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleFilter = () => fetchReports();
  const handlePrint = () => window.print();

  if (loading) return <LoadingSpinner fullScreen />;

  const categoryData = (donationReport?.byCategory || []).map(c => ({ name: c._id, value: c.total, count: c.count }));
  const monthlyData = (donationReport?.byMonth || []).map(m => ({
    month: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
    total: m.total
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 no-print">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Financial and membership insights</p>
        </div>
        <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
          <FaPrint /> Print Report
        </button>
      </div>

      {/* Date filter */}
      <div className="card mb-6 no-print">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="input-label">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex-1 w-full">
            <label className="input-label">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleFilter} className="btn-primary">Apply Filter</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="card text-center">
          <FaDonate className="text-church-600 text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 font-display">KES {(donationReport?.grandTotal || 0).toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Total Donations</p>
        </div>
        <div className="card text-center">
          <FaUsers className="text-church-600 text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 font-display">{memberReport?.total || 0}</p>
          <p className="text-gray-500 text-sm">Total Members</p>
        </div>
        <div className="card text-center">
          <FaTrophy className="text-gold-500 text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 font-display">{categoryData.length}</p>
          <p className="text-gray-500 text-sm">Active Categories</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Donations By Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Donations By Month</h3>
          {monthlyData.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Bar dataKey="total" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category breakdown table */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Category Breakdown</h3>
        {categoryData.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No donations recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Transactions</th>
                  <th className="px-4 py-2 font-medium">Total Amount</th>
                  <th className="px-4 py-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryData.map(c => (
                  <tr key={c.name}>
                    <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.count}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">KES {c.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {donationReport.grandTotal > 0 ? ((c.value / donationReport.grandTotal) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New members */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Recent New Members</h3>
        {memberReport?.recent?.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No members yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Phone</th>
                  <th className="px-4 py-2 font-medium">Gender</th>
                  <th className="px-4 py-2 font-medium">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {memberReport?.recent?.map(m => (
                  <tr key={m._id}>
                    <td className="px-4 py-3 font-medium text-gray-800">{m.firstName} {m.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{m.phone}</td>
                    <td className="px-4 py-3 text-gray-500">{m.gender || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{new Date(m.joinDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
