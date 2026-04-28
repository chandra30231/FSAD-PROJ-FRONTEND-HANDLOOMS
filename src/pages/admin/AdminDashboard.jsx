import { useEffect, useState } from 'react';
import { Shield, Users, Activity, PackageCheck, AlertCircle, Trash2, Ban, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPlatformMetrics,
  fetchUsersForAdmin,
  updateUserStatus,
  deleteUserAccount,
  fetchAllOrders,
} from '../../services/api';
import { formatCurrency, formatDate, titleCase } from '../../utils/formatters';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [platformUsers, setPlatformUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshDashboard = async () => {
      try {
        const [platformMetrics, users, allOrders] = await Promise.all([
          fetchPlatformMetrics(),
          fetchUsersForAdmin(),
          fetchAllOrders(),
        ]);
        setMetrics(platformMetrics);
        setPlatformUsers(users);
        setOrders(allOrders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load admin dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    refreshDashboard();
    window.addEventListener('handloom:data-updated', refreshDashboard);
    return () => window.removeEventListener('handloom:data-updated', refreshDashboard);
  }, []);

  const refreshData = async () => {
    const [platformMetrics, users, allOrders] = await Promise.all([
      fetchPlatformMetrics(),
      fetchUsersForAdmin(),
      fetchAllOrders(),
    ]);
    setMetrics(platformMetrics);
    setPlatformUsers(users);
    setOrders(allOrders.slice(0, 5));
  };

  const handleStatusChange = async (userId, status) => {
    await updateUserStatus(userId, status);
    await refreshData();
  };

  const handleDelete = async (userId) => {
    await deleteUserAccount(userId);
    await refreshData();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">Loading admin dashboard...</p>
      </div>
    );
  }

  const pendingArtisans = platformUsers.filter((platformUser) => platformUser.role === 'artisan' && platformUser.status === 'pending');
  const pausedProducts = metrics ? Number(metrics.products || 0) - Number(metrics.activeListings || 0) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Administration</div>
          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-slate-900">
            <Shield className="text-themePrimary" size={34} />
            Platform command center
          </h1>
          <p className="mt-2 max-w-3xl text-slate-500">
            Monitor users, approve artisan accounts, keep listings accurate, and make sure the marketplace stays healthy for global buyers.
          </p>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Signed in as {user?.name}
        </div>
      </div>

      {metrics && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">Total users</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics.users}</div>
              </div>
              <Users className="text-themePrimary" size={24} />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">Approved artisans</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics.activeArtisans}</div>
              </div>
              <PackageCheck className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">Pending approvals</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics.pendingApprovals}</div>
              </div>
              <AlertCircle className="text-amber-600" size={24} />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">Orders</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics.orders}</div>
              </div>
              <Activity className="text-sky-600" size={24} />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">Revenue</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{formatCurrency(metrics.revenue)}</div>
              </div>
              <Shield className="text-slate-600" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Users and roles</div>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Manage marketplace accounts</h2>
            </div>
            <div className="text-sm text-slate-500">{platformUsers.length} total accounts</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-4">User</th>
                  <th className="px-4">Role</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Type</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {platformUsers.map((platformUser) => {
                  const isInternal = platformUser.source === 'internal';
                  return (
                    <tr key={platformUser.id} className="bg-slate-50 text-sm text-slate-700">
                      <td className="rounded-l-2xl px-4 py-4">
                        <div className="font-semibold text-slate-900">{platformUser.name}</div>
                        <div className="text-xs text-slate-500">{platformUser.email}</div>
                      </td>
                      <td className="px-4 py-4">{titleCase(platformUser.role)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          platformUser.status === 'active' || platformUser.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : platformUser.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {titleCase(platformUser.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">{isInternal ? 'Internal' : 'Registered'}</td>
                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex justify-end gap-2">
                          {!isInternal && platformUser.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(platformUser.id, 'approved')}
                              className="rounded-full border border-emerald-200 p-2 text-emerald-700 transition-colors hover:bg-emerald-100"
                              title="Approve artisan"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {!isInternal && platformUser.status !== 'blocked' && (
                            <button
                              onClick={() => handleStatusChange(platformUser.id, 'blocked')}
                              className="rounded-full border border-amber-200 p-2 text-amber-700 transition-colors hover:bg-amber-100"
                              title="Block user"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                          {!isInternal && platformUser.status === 'blocked' && (
                            <button
                              onClick={() => handleStatusChange(platformUser.id, platformUser.role === 'artisan' ? 'approved' : 'active')}
                              className="rounded-full border border-sky-200 p-2 text-sky-700 transition-colors hover:bg-sky-100"
                              title="Restore user"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {!isInternal && (
                            <button
                              onClick={() => handleDelete(platformUser.id)}
                              className="rounded-full border border-red-200 p-2 text-red-700 transition-colors hover:bg-red-100"
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Operational alerts</div>
            <h2 className="mt-2 text-2xl font-black text-slate-900">What needs attention</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-500">Pending artisan approvals</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{pendingArtisans.length}</div>
                <div className="mt-2 text-sm text-slate-500">Approve new artisan registrations so they can publish inventory.</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-500">Paused listings</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{pausedProducts}</div>
                <div className="mt-2 text-sm text-slate-500">Review listings that are out of stock or intentionally paused.</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-500">Catalog size</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics?.products || 0}</div>
                <div className="mt-2 text-sm text-slate-500">Keep product content clean, accurate, and globally ready.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Recent commerce</div>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Latest orders</h2>

            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-900">{order.id}</div>
                      <div className="mt-1 text-sm text-slate-500">{order.buyerName} · {formatDate(order.date)}</div>
                    </div>
                    <div className="text-sm font-semibold text-themePrimary">{formatCurrency(order.total)}</div>
                  </div>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {titleCase(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
