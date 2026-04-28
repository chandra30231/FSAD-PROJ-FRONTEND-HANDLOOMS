import { useEffect, useState } from 'react';
import { Megaphone, Target, TrendingUp, Globe, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCampaigns,
  createCampaign,
  fetchMarketingMetrics,
  fetchProducts,
} from '../../services/api';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const emptyCampaign = {
  name: '',
  channel: 'Social Media',
  targetMarket: '',
  budget: '',
  status: 'draft',
  reach: '',
  conversionRate: '',
};

const MarketingDashboard = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [formData, setFormData] = useState(emptyCampaign);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshDashboard = async () => {
      try {
        const [campaignData, marketingMetrics, products] = await Promise.all([
          fetchCampaigns(),
          fetchMarketingMetrics(),
          fetchProducts(),
        ]);
        setCampaigns(campaignData);
        setMetrics(marketingMetrics);
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to load marketing dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    refreshDashboard();
    window.addEventListener('handloom:data-updated', refreshDashboard);
    return () => window.removeEventListener('handloom:data-updated', refreshDashboard);
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createCampaign(formData);
      const [campaignData, marketingMetrics] = await Promise.all([
        fetchCampaigns(),
        fetchMarketingMetrics(),
      ]);
      setCampaigns(campaignData);
      setMetrics(marketingMetrics);
      setFormData(emptyCampaign);
      setMessage('Campaign saved successfully.');
      window.setTimeout(() => setMessage(''), 2400);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">Loading marketing dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#164e63_55%,#0f766e)] px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <Megaphone size={18} />
            Marketing specialist portal
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight">Promote artisan stories to global buyers.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
            Build campaigns, highlight best-performing products, and translate marketplace activity into audience growth.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <div className="text-sm text-white/70">Signed in analyst</div>
            <div className="mt-2 text-2xl font-black">{user?.name}</div>
            <div className="mt-1 text-sm text-white/70">Campaign strategy, audience reach, and product promotion</div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Performance pulse</div>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Marketplace visibility</h2>
            </div>
            <Globe className="text-themePrimary" size={28} />
          </div>

          {metrics && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Total reach</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics.totalReach.toLocaleString('en-IN')}</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Campaign spend</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{formatCurrency(metrics.totalSpend)}</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Average conversion</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{formatPercent(metrics.avgConversion)}</div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Live campaigns</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{metrics.liveCampaigns}</div>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Campaign board</div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Current promotions</h2>
              </div>
              <TrendingUp className="text-themePrimary" size={26} />
            </div>

            <div className="mt-6 grid gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-[1.75rem] border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{campaign.id}</div>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">{campaign.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {campaign.channel} · {campaign.targetMarket}
                      </p>
                    </div>
                    <div className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                      campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {campaign.status === 'active' ? 'Active' : 'Draft'}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Budget</div>
                      <div className="mt-2 font-bold text-slate-900">{formatCurrency(campaign.budget)}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reach</div>
                      <div className="mt-2 font-bold text-slate-900">{Number(campaign.reach).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Conversion</div>
                      <div className="mt-2 font-bold text-slate-900">{formatPercent(campaign.conversionRate)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Product spotlight</div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Promote these stories next</h2>
              </div>
              <Sparkles className="text-themePrimary" size={26} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {featuredProducts.map((product) => (
                <div key={product.id} className="rounded-[1.5rem] border border-slate-200 p-4">
                  <img src={product.image} alt={product.name} className="h-40 w-full rounded-2xl object-cover" />
                  <div className="mt-4">
                    <div className="font-semibold text-slate-900">{product.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{product.region} · {product.artisan}</div>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-themePrimary">
                      Heritage angle ready
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Campaign setup</div>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Create a promotion</h2>
            </div>
            <Target className="text-themePrimary" size={26} />
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Campaign name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
            />

            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
            >
              <option value="Social Media">Social Media</option>
              <option value="Email">Email</option>
              <option value="Marketplace Banner">Marketplace Banner</option>
              <option value="Influencer Collaboration">Influencer Collaboration</option>
            </select>

            <input
              name="targetMarket"
              value={formData.targetMarket}
              onChange={handleChange}
              required
              placeholder="Target market"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="budget"
                type="number"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                required
                placeholder="Budget"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="reach"
                type="number"
                min="0"
                value={formData.reach}
                onChange={handleChange}
                placeholder="Projected reach"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
              />
              <input
                name="conversionRate"
                type="number"
                min="0"
                step="0.1"
                value={formData.conversionRate}
                onChange={handleChange}
                placeholder="Conversion rate"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-themePrimary"
              />
            </div>

            <button type="submit" className="mt-2 rounded-full bg-themePrimary px-6 py-3 font-semibold text-white">
              Save campaign
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MarketingDashboard;
