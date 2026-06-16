import { useState, useEffect } from 'react';
import { donationAPI, settingsAPI } from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import toast from 'react-hot-toast';
import { FaSearch, FaDonate, FaFilter, FaDownload } from 'react-icons/fa';

const STATUS_OPTIONS = ['Pending', 'Successful', 'Failed'];

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    settingsAPI.get().then(res => setCategories(res.data.settings.donationCategories || []));
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = { search, category, status, startDate, endDate, page, limit: 15 };
      const res = await donationAPI.getAll(params);
      setDonations(res.data.donations);
      setPages(res.data.pages);
      setTotal(res.data.total);
      setTotalAmount(res.data.totalAmount);
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchDonations, 300);
    return () => clearTimeout(timer);
  }, [search, category, status, startDate, endDate, page]);

  const exportCSV = () => {
    const headers = ['Donor', 'Phone', 'Category', 'Amount', 'Status', 'Receipt', 'Date'];
    const rows = donations.map(d => [
      d.memberName, d.phone, d.category, d.amount, d.status, d.mpesaReceipt || '', new Date(d.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations.csv';
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-500 mt-1">{total} total · KES {totalAmount.toLocaleString()} successful</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary text-sm flex items-center gap-2">
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search donor, phone, receipt..."
              className="input-field pl-11"
            />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="input-field">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input-field">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} className="input-field" />
          <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} className="input-field" />
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : donations.length === 0 ? (
          <EmptyState icon={FaDonate} title="No donations found" message="Donations will appear here once received" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 font-medium">Donor</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Receipt</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.map(d => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{d.memberName}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{d.phone}</td>
                    <td className="px-6 py-4">
                      <span className="badge-info">{d.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">KES {d.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">{d.mpesaReceipt || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={
                        d.status === 'Successful' ? 'badge-success' :
                        d.status === 'Pending' ? 'badge-pending' : 'badge-failed'
                      }>{d.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-ghost border border-gray-200 disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-500 px-4">Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="btn-ghost border border-gray-200 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
};

export default DonationsPage;
