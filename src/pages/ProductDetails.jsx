import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { addCartItem } from '../services/platformStore';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  MapPin,
  User,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user || user.role !== 'buyer') {
      navigate('/login');
      return;
    }

    addCartItem(user.id, product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-themePrimary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The handloom item you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-themePrimary text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-themePrimary transition-colors mb-8 group font-medium">
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-themePrimary shadow-sm z-10">
            {product.category}
          </div>
          <img src={product.image} alt={product.name} className="w-full max-w-md h-auto object-cover rounded-2xl shadow-xl" />
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>

          <div className="text-3xl font-black text-themePrimary mb-6">INR {Number(product.price).toLocaleString('en-IN')}</div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-8 border border-gray-100">
            <div className="flex items-center text-gray-700 font-medium">
              <User size={20} className="mr-3 text-themePrimary" />
              <span>
                Crafted by: <span className="font-bold">{product.artisan}</span>
              </span>
            </div>
            <div className="flex items-center text-gray-700 font-medium">
              <MapPin size={20} className="mr-3 text-themePrimary" />
              <span>
                Origin: <span className="font-bold">{product.region}</span>
              </span>
            </div>
            <p className="text-sm text-gray-500">Stock available: {product.stock}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white w-full sm:w-1/3">
              <button
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-themePrimary rounded-l-xl"
              >
                -
              </button>
              <div className="flex-1 text-center font-bold text-lg text-gray-800">{quantity}</div>
              <button
                onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-themePrimary rounded-r-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedToCart || product.stock <= 0}
              className={`flex-1 flex items-center justify-center gap-2 font-bold text-lg py-3 px-6 rounded-xl transition-all duration-300 ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-themePrimary text-white hover:-translate-y-1'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={24} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={24} /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>

            <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 text-gray-400 rounded-xl hover:text-red-500 hover:border-red-500 transition-all group shrink-0">
              <Heart size={24} className="group-hover:fill-red-500 transition-colors" />
            </button>
          </div>

          {!user && (
            <p className="text-sm text-gray-500 mb-5">
              Buyer login required for checkout. <Link to="/login" className="text-themePrimary font-bold">Sign in</Link>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="flex flex-col items-center text-center p-3">
              <ShieldCheck size={28} className="text-green-600 mb-2" />
              <span className="text-xs font-bold text-gray-800">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <Truck size={28} className="text-blue-600 mb-2" />
              <span className="text-xs font-bold text-gray-800">Global Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <RotateCcw size={28} className="text-themePrimary mb-2" />
              <span className="text-xs font-bold text-gray-800">7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
