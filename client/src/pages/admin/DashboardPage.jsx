import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationAPI, memberAPI } from '../../services/api.js';
import StatCard from '../../components/admin/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import {
  FaUsers, FaDonate, FaCalendarCheck, FaClock, FaCheckCircle,
  FaArrowRight, FaUserPlus
} from 'react-icons/fa';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#7c3aed', '#a78bfa', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DashboardPage = () => {
  const [donationStats, setDonationStats] = useState(null);
  const [memberStats, setMemberStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      donationAPI.getStats(),
      memberAPI.getStats(),
      donationAPI.getAll({ limit: 5 })
    ]).then(([dRes, mRes, rRes]) => {
      setDonationStats(dRes.data.stats);
      setMemberStats(mRes.data.stats);
      setRecentDonations(rRes.data.donations);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const categoryData = (donationStats?.byCategory || []).map(c => ({ name: c._id, value: c.total }));
  const monthlyTrendData = (donationStats?.monthlyTrend || []).map(m => ({
    month: MONTH_NAMES[m._id.month - 1],
    total: m.total
  }));

  const monthChange = donationStats?.lastMonthDonations > 0
    ? ((donationStats.monthlyDonations - donationStats.lastMonthDonations) / donationStats.lastMonthDonations * 100).toFixed(1)
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your church's activities</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/members" className="btn-secondary text-sm flex items-center gap-2">
            <FaUserPlus /> Members
          </Link>
          <Link to="/admin/donations" className="btn-primary text-sm flex items-center gap-2">
            <FaDonate /> Donations
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        <StatCard icon={FaUsers} label="Total Members" value={memberStats?.total ?? 0} color="church" />
        <StatCard icon={FaDonate} label="Total Donations" value={`KES ${(donationStats?.totalDonations || 0).toLocaleString()}`} color="green" />
        <StatCard
          icon={FaCalendarCheck}
          label="This Month"
          value={`KES ${(donationStats?.monthlyDonations || 0).toLocaleString()}`}
          color="gold"
          trend={monthChange !== null ? { positive: monthChange >= 0, text: `${Math.abs(monthChange)}% vs last month` } : null}
        />
        <StatCard icon={FaClock} label="Pending Payments" value={donationStats?.pendingPayments ?? 0} color="red" />
        <StatCard icon={FaCheckCircle} label="Successful Payments" value={donationStats?.successfulPayments ?? 0} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Donations by category */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Donations By Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No donation data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly trend */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Giving Trends</h3>
          {monthlyTrendData.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No donation data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Bar dataKey="total" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent donations */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Donations</h3>
          <Link to="/admin/donations" className="text-church-600 text-sm font-medium flex items-center gap-1 hover:underline">
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>
        {recentDonations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No donations recorded yet</p>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Donor</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDonations.map(d => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{d.memberName}</td>
                    <td className="px-6 py-3 text-gray-500">{d.category}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800">KES {d.amount.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <span className={
                        d.status === 'Successful' ? 'badge-success' :
                        d.status === 'Pending' ? 'badge-pending' : 'badge-failed'
                      }>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
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

export default DashboardPage;
