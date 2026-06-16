import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memberAPI } from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
import { FaSearch, FaEye, FaTrash, FaUsers, FaUserPlus } from 'react-icons/fa';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await memberAPI.getAll({ search, page, limit: 15 });
      setMembers(res.data.members);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchMembers, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async () => {
    try {
      await memberAPI.delete(deleteTarget._id);
      toast.success('Member removed successfully');
      setDeleteTarget(null);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 mt-1">{total} registered members</p>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, or email..."
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* Members table */}
      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : members.length === 0 ? (
          <EmptyState
            icon={FaUsers}
            title="No members found"
            message={search ? "Try a different search term" : "Members will appear here once they register"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Gender</th>
                  <th className="px-6 py-3 font-medium">Join Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map(m => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-church-100 flex items-center justify-center text-church-600 font-semibold text-sm flex-shrink-0">
                          {m.firstName?.charAt(0)}{m.lastName?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{m.firstName} {m.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{m.phone}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{m.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{m.gender || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{m.joinDate ? new Date(m.joinDate).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/members/${m._id}`} className="p-2 text-church-600 hover:bg-church-50 rounded-lg transition-colors">
                          <FaEye />
                        </Link>
                        <button onClick={() => setDeleteTarget(m)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Member"
        message={`Are you sure you want to remove ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action can be reversed by an administrator.`}
        confirmText="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MembersPage;
