import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, ShoppingBag, Users, Megaphone } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Authentic Handloom Products',
    description: 'Every product highlights traditional weaving techniques and artisan craftsmanship.',
  },
  {
    icon: Globe,
    title: 'Reach Global Buyers',
    description: 'The platform helps local artisans present their products to audiences around the world.',
  },
  {
    icon: Users,
    title: 'Role-Based Portals',
    description: 'Buyers, artisans, admins, and marketing specialists each get their own working dashboard.',
  },
];

const Home = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="grid gap-8 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-block rounded-full bg-themePrimary/10 px-4 py-1 text-sm font-semibold text-themePrimary">
            FSAD-PS12 Handloom Marketplace
          </span>
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Promote handloom fashion products to global buyers
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">
            A web application that helps artisans showcase handloom products, lets buyers shop with confidence,
            gives admins control over operations, and supports marketing campaigns for global growth.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-themePrimary px-6 py-3 font-semibold text-white">
              <ShoppingBag size={18} />
              Explore Products
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700">
              Join as Buyer or Artisan
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900">Platform Roles</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Buyer</h3>
              <p className="mt-1 text-sm text-gray-600">Browse, add to cart, place orders, and track purchases.</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Artisan</h3>
              <p className="mt-1 text-sm text-gray-600">List products, manage inventory, and fulfill buyer orders.</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Admin</h3>
              <p className="mt-1 text-sm text-gray-600">Approve users, manage platform health, and monitor activity.</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Marketing Specialist</h3>
              <p className="mt-1 text-sm text-gray-600">Create campaigns and promote artisan stories to wider audiences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-full bg-themePrimary/10 p-3 text-themePrimary">
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-3 leading-7 text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Promote culture, commerce, and craftsmanship</h2>
            <p className="mt-2 text-gray-600">
              Discover products, onboard artisans, and run campaigns from one unified handloom marketplace.
            </p>
          </div>
          <Link to="/marketing" className="inline-flex items-center gap-2 rounded-lg bg-themePrimary px-5 py-3 font-semibold text-white">
            <Megaphone size={18} />
            View Marketing Portal
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
