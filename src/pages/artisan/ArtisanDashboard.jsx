import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Edit3,
  Trash2,
  ArrowUpRight,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchArtisanProducts,
  createArtisanProduct,
  updateArtisanProduct,
  deleteArtisanProduct,
  fetchArtisanOrders,
  updateOrderStatus,
} from '../../services/api';
import { formatCurrency, formatDate, titleCase } from '../../utils/formatters';

const emptyProductForm = {
  name: '',
  category: '',
  region: '',
  price: '',
  stock: '',
  image: '',
  description: '',
  status: 'active',
};

const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(emptyProductForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const refreshDashboard = async () => {
      try {
        const [artisanProducts, artisanOrders] = await Promise.all([
          fetchArtisanProducts(user.id),
          fetchArtisanOrders(user.id),
        ]);
        setProducts(artisanProducts);
        setOrders(artisanOrders);
      } catch (error) {
        console.error('Failed to load artisan dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    refreshDashboard();
    window.addEventListener('handloom:data-updated', refreshDashboard);
    return () => window.removeEventListener('handloom:data-updated', refreshDashboard);
  }, [user]);

  const resetForm = () => {
    setFormData(emptyProductForm);
    setEditingId(null);
  };

  const showMessage = (value) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 2500);
  };

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const refreshAfterMutation = async () => {
    if (!user) {
      return;
    }
    const [artisanProducts, artisanOrders] = await Promise.all([
      fetchArtisanProducts(user.id),
      fetchArtisanOrders(user.id),
    ]);
    setProducts(artisanProducts);
    setOrders(artisanOrders);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (editingId) {
        await updateArtisanProduct(user.id, editingId, payload);
        showMessage('Product updated successfully.');
      } else {
        await createArtisanProduct(user.id, payload);
        showMessage('Product added to your storefront.');
      }

      resetForm();
      await refreshAfterMutation();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const handleEdit = (product) => {
    setActiveTab('inventory');
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      region: product.region,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
      status: product.status,
    });
  };

  const handleDelete = async (productId) => {
    if (!user) {
      return;
    }

    try {
      await deleteArtisanProduct(user.id, productId);
      showMessage('Product removed from your storefront.');
      await refreshAfterMutation();
      if (editingId === productId) {
        resetForm();
      }
    } catch (error) {
      showMessage(error.message);
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await refreshAfterMutation();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => {
    const artisanContribution = order.items
      .filter((item) => item.artisanId === user?.id)
      .reduce((itemTotal, item) => itemTotal + Number(item.price) * Number(item.quantity), 0);
    return sum + artisanContribution;
  }, 0);

  const lowStockProducts = products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 5).length;
  const activeProducts = products.filter((product) => product.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">Loading artisan dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Artisan portal</div>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Storefront management</h1>
          <p className="mt-2 max-w-3xl text-slate-500">
            Manage your catalog, respond to buyer demand, and keep your handloom inventory ready for global buyers.
          </p>
        </div>
        {message && (
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold transition-colors ${
                activeTab === 'overview' ? 'bg-themePrimary text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold transition-colors ${
                activeTab === 'inventory' ? 'bg-themePrimary text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package size={18} />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold transition-colors ${
                activeTab === 'orders' ? 'bg-themePrimary text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingCart size={18} />
                Orders
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === 'orders' ? 'bg-white/20' : 'bg-slate-100 text-slate-700'}`}>
                {orders.length}
              </span>
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-sm text-slate-500">Store revenue</div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{formatCurrency(totalRevenue)}</div>
                  <div className="mt-2 text-sm text-slate-500">Based on recorded marketplace orders.</div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-sm text-slate-500">Active products</div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{activeProducts}</div>
                  <div className="mt-2 text-sm text-slate-500">Listings currently visible to buyers.</div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-sm text-slate-500">Low stock alerts</div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{lowStockProducts}</div>
                  <div className="mt-2 text-sm text-slate-500">Products with 5 or fewer units remaining.</div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Recent orders</div>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">Latest buyer activity</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    View all
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="rounded-[1.5rem] bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{order.id}</div>
                          <div className="mt-2 text-lg font-bold text-slate-900">{order.buyerName}</div>
                          <div className="mt-1 text-sm text-slate-500">{formatDate(order.date)}</div>
                        </div>
                        <div className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-themePrimary">
                          {titleCase(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 px-6 py-10 text-center text-slate-500">
                      Orders will appear here when buyers start purchasing your products.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'inventory' && (
            <>
              <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Product editor</div>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                      {editingId ? 'Update listing' : 'Add a new handloom product'}
                    </h2>
                  </div>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input name="name" value={formData.name} onChange={handleChange} required placeholder="Product name" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                  <input name="category" value={formData.category} onChange={handleChange} required placeholder="Category" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                  <input name="region" value={formData.region} onChange={handleChange} required placeholder="Region" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                  <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                  <input name="price" value={formData.price} onChange={handleChange} required min="1" type="number" placeholder="Price in INR" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                  <input name="stock" value={formData.stock} onChange={handleChange} required min="0" type="number" placeholder="Stock quantity" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                  <select name="status" value={formData.status} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary">
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                  <div className="hidden md:block" />
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Describe the weave, origin, and value for buyers." className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary" />
                </div>

                <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-themePrimary px-6 py-3 font-semibold text-white">
                  {editingId ? <Save size={18} /> : <Plus size={18} />}
                  {editingId ? 'Save changes' : 'Add product'}
                </button>
              </form>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Inventory</div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Your published catalog</h2>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left text-sm text-slate-500">
                        <th className="px-4">Product</th>
                        <th className="px-4">Category</th>
                        <th className="px-4">Price</th>
                        <th className="px-4">Stock</th>
                        <th className="px-4">Status</th>
                        <th className="px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                          <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">{product.name}</td>
                          <td className="px-4 py-4">{product.category}</td>
                          <td className="px-4 py-4">{formatCurrency(product.price)}</td>
                          <td className="px-4 py-4">{product.stock}</td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {titleCase(product.status)}
                            </span>
                          </td>
                          <td className="rounded-r-2xl px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:border-themePrimary hover:text-themePrimary"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:border-red-200 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {products.length === 0 && (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 px-6 py-10 text-center text-slate-500">
                    Start by adding your first product listing.
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Fulfillment</div>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Buyer orders for your products</h2>

              <div className="mt-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 px-6 py-10 text-center text-slate-500">
                    No orders yet. As buyers purchase your items, you can update their status here.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-[1.75rem] border border-slate-200 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{order.id}</div>
                          <div className="mt-2 text-lg font-bold text-slate-900">{order.buyerName}</div>
                          <div className="mt-1 text-sm text-slate-500">{formatDate(order.date)}</div>
                        </div>
                        <select
                          value={order.status}
                          onChange={(event) => handleOrderStatusChange(order.id, event.target.value)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-themePrimary"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>

                      <div className="mt-4 space-y-3">
                        {order.items
                          .filter((item) => item.artisanId === user?.id)
                          .map((item) => (
                            <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                              <div className="flex-1">
                                <div className="font-semibold text-slate-900">{item.name}</div>
                                <div className="text-sm text-slate-500">
                                  Qty {item.quantity} · {formatCurrency(item.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
