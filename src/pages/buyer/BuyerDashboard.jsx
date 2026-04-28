import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Globe,
  Clock3,
  CheckCircle2,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCartCount } from '../../services/platformStore';
import { fetchBuyerOrders, fetchProducts } from '../../services/api';
import { formatCurrency, formatDate, titleCase } from '../../utils/formatters';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const loadDashboard = async () => {
      try {
        const [buyerOrders, products] = await Promise.all([
          fetchBuyerOrders(user.id),
          fetchProducts(),
        ]);
        setOrders(buyerOrders);
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        console.error('Failed to load buyer dashboard', error);
      } finally {
        setCartCount(getCartCount(user.id));
        setLoading(false);
      }
    };

    loadDashboard();
    window.addEventListener('handloom:data-updated', loadDashboard);
    window.addEventListener('handloom:cart-updated', loadDashboard);

    return () => {
      window.removeEventListener('handloom:data-updated', loadDashboard);
      window.removeEventListener('handloom:cart-updated', loadDashboard);
    };
  }, [user]);

  const totalSpend = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const activeOrders = orders.filter((order) => order.status !== 'delivered').length;
  const latestOrder = orders[0];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">Loading buyer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#111827,#7c2d12_58%,#d97706)] px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">Buyer portal</div>
            <h1 className="mt-3 text-4xl font-black leading-tight">
              Welcome back, {user?.name}.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/80">
              Track your purchases, discover new handloom collections, and keep supporting artisan communities around the world.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-sm text-white/70">Total spend</div>
              <div className="mt-2 text-3xl font-black">{formatCurrency(totalSpend)}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-sm text-white/70">Active orders</div>
              <div className="mt-2 text-3xl font-black">{activeOrders}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-sm text-white/70">Cart items</div>
              <div className="mt-2 text-3xl font-black">{cartCount}</div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Quick actions</div>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Stay on top of your journey</h2>
            </div>
            <Globe className="text-themePrimary" size={28} />
          </div>

          <div className="mt-6 grid gap-4">
            <Link to="/products" className="rounded-[1.5rem] border border-slate-200 px-5 py-4 transition-colors hover:border-themePrimary hover:bg-themePrimary/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Browse new arrivals</div>
                  <div className="mt-1 text-sm text-slate-500">Explore fresh artisan listings across the catalog.</div>
                </div>
                <ArrowRight size={18} className="text-themePrimary" />
              </div>
            </Link>

            <Link to="/cart" className="rounded-[1.5rem] border border-slate-200 px-5 py-4 transition-colors hover:border-themePrimary hover:bg-themePrimary/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Review cart</div>
                  <div className="mt-1 text-sm text-slate-500">{cartCount} items ready for checkout.</div>
                </div>
                <ShoppingBag size={18} className="text-themePrimary" />
              </div>
            </Link>

            {latestOrder && (
              <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Latest order</div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{latestOrder.id}</div>
                    <div className="text-sm text-slate-500">{formatDate(latestOrder.date)}</div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-themePrimary">
                    {titleCase(latestOrder.status)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Orders</div>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Your marketplace orders</h2>
            </div>
            <Package className="text-themePrimary" size={26} />
          </div>

          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 px-6 py-10 text-center">
                <p className="text-slate-500">You have not placed any orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{order.id}</div>
                      <div className="mt-2 text-lg font-bold text-slate-900">{formatCurrency(order.total)}</div>
                      <div className="mt-1 text-sm text-slate-500">Placed on {formatDate(order.date)}</div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                      {order.status === 'delivered' ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
                      {titleCase(order.status)}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-sm text-slate-500">
                            Qty {item.quantity} · {item.region} · {item.artisan}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-700">{formatCurrency(item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Account</div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Buyer profile</h2>
              </div>
              <CreditCard className="text-themePrimary" size={26} />
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{user?.name}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{user?.email}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Delivery focus</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Global shipping is enabled for all public listings. Checkout automatically includes free delivery over qualifying order values.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Recommended</div>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Featured handlooms</h2>

            <div className="mt-6 space-y-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="flex gap-4 rounded-2xl border border-slate-100 p-3 transition-colors hover:border-themePrimary">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{product.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{product.region} · {product.artisan}</div>
                    <div className="mt-2 text-sm font-semibold text-themePrimary">{formatCurrency(product.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BuyerDashboard;
