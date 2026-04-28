import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { Search, MapPin, User, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term)
      || product.region.toLowerCase().includes(term)
      || product.category.toLowerCase().includes(term),
    );
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-themePrimary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading authentic handlooms...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900">Global Collection</h1>
          <p className="max-w-2xl text-lg text-gray-500">
            Discover authentic, handcrafted items. Every purchase directly supports rural artisans.
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-3.5 text-gray-400 transition-colors group-focus-within:text-themePrimary" size={20} />
          <input
            type="text"
            placeholder="Search by name, region, or category..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 shadow-sm transition-all focus:border-themePrimary focus:outline-none focus:ring-2 focus:ring-themePrimary/50"
          />
        </div>
      </div>

      <div className="mb-6 text-sm font-medium text-gray-500">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-themePrimary shadow-sm backdrop-blur-sm">
                  {product.category}
                </div>
              </div>

              <div className="flex flex-grow flex-col p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{product.name}</h3>

                <div className="mb-4 space-y-1.5">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {product.region}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={16} className="mr-2 text-gray-400" />
                    By {product.artisan}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-2xl font-extrabold text-gray-900">{formatCurrency(product.price)}</span>
                  <Link
                    to={`/product/${product.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-themePrimary/10 text-themePrimary transition-colors duration-300 group-hover:bg-themePrimary group-hover:text-white"
                  >
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:-rotate-45" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-100 bg-white py-20 text-center">
          <p className="mb-2 text-xl font-medium text-gray-500">No products found matching "{searchTerm}"</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilteredProducts(products);
            }}
            className="font-bold text-themePrimary hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
