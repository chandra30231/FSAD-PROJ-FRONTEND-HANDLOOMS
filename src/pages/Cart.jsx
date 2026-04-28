import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
} from '../services/platformStore';
import { checkoutOrder } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      setCartItems([]);
      return undefined;
    }

    const syncCart = () => {
      setCartItems(getCart(user.id));
    };

    syncCart();
    window.addEventListener('handloom:cart-updated', syncCart);
    return () => window.removeEventListener('handloom:cart-updated', syncCart);
  }, [user]);

  const handleQuantityChange = (productId, quantity) => {
    if (!user) {
      return;
    }
    updateCartItemQuantity(user.id, productId, quantity);
  };

  const handleRemoveItem = (productId) => {
    if (!user) {
      return;
    }
    removeCartItem(user.id, productId);
  };

  const handleCheckout = async () => {
    if (!user || user.role !== 'buyer') {
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    setError('');

    try {
      const result = await checkoutOrder(user.id, cartItems);

      if (!result?.ok) {
        setError(result?.message || 'Checkout failed.');
        return;
      }

      clearCart(user.id);
      setOrderComplete(result.order);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-themePrimary/10 text-themePrimary">
            <Lock size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Sign in to view your cart</h2>
          <p className="mt-4 text-slate-500">
            Buyer access is required to review handloom products, complete checkout, and track orders.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="rounded-full bg-themePrimary px-6 py-3 font-semibold text-white">
              Sign In
            </Link>
            <Link to="/products" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'buyer') {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Cart is available for buyer accounts</h2>
          <p className="mt-4 text-slate-500">
            You are currently signed in as {user.role}. Switch to a buyer account to place and track marketplace orders.
          </p>
          <div className="mt-8">
            <Link to={`/${user.role}`} className="rounded-full bg-themePrimary px-6 py-3 font-semibold text-white">
              Return to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-emerald-100 bg-white p-10 text-center shadow-sm">
          <CheckCircle size={72} className="mx-auto mb-6 text-emerald-500" />
          <h2 className="text-3xl font-black text-slate-900">Order confirmed</h2>
          <p className="mt-4 text-slate-500">
            Your order {orderComplete.id} has been created successfully. Weavers and logistics partners can now start fulfillment.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-left">
            <div className="text-sm text-slate-500">Order total</div>
            <div className="text-2xl font-black text-slate-900">{formatCurrency(orderComplete.total)}</div>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/buyer')}
              className="rounded-full bg-themePrimary px-6 py-3 font-semibold text-white"
            >
              Go to buyer dashboard
            </button>
            <Link to="/products" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700">
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag size={42} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Your cart is empty</h2>
        <p className="mt-4 max-w-md text-slate-500">
          Add authentic handloom products to your cart and support artisans directly with each order.
        </p>
        <Link to="/products" className="mt-8 rounded-full bg-themePrimary px-6 py-3 font-semibold text-white">
          Explore the collection
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const grandTotal = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-themePrimary">Buyer checkout</div>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Shopping cart</h1>
          <p className="mt-2 text-slate-500">Review your items, update quantities, and place a marketplace order.</p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-themePrimary">
          Continue shopping
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.55fr_0.9fr]">
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid gap-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[140px_1fr_auto]"
            >
              <img src={item.image} alt={item.name} className="h-32 w-full rounded-2xl object-cover bg-slate-100" />

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-themePrimary">{item.category}</div>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.region} · by {item.artisan}
                </p>
                <div className="mt-4 text-lg font-black text-slate-900">{formatCurrency(item.price)}</div>
              </div>

              <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="rounded-full p-2 text-slate-500 transition-colors hover:text-themePrimary"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-10 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="rounded-full p-2 text-slate-500 transition-colors hover:text-themePrimary"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-24 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm font-medium text-slate-600">
              <div className="flex items-center justify-between">
                <span>Items ({cartItems.length})</span>
                <span className="text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'font-semibold text-emerald-600' : 'text-slate-900'}>
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
                Free shipping is automatically applied on orders above {formatCurrency(5000)}.
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-6">
              <span className="text-base font-semibold text-slate-900">Grand total</span>
              <span className="text-3xl font-black text-themePrimary">{formatCurrency(grandTotal)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-themePrimary px-6 py-3.5 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80"
            >
              {isCheckingOut ? 'Processing order...' : 'Place secure order'}
              {!isCheckingOut && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
