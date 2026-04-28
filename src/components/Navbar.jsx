import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCartCount } from '../services/platformStore';
import { Store, ShoppingBag, UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCartCount = () => {
      if (user?.role === 'buyer') {
        setCartCount(getCartCount(user.id));
      } else {
        setCartCount(0);
      }
    };

    syncCartCount();
    window.addEventListener('handloom:cart-updated', syncCartCount);
    return () => window.removeEventListener('handloom:cart-updated', syncCartCount);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-themePrimary text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Store size={24} />
          <span>Global Handlooms</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className="hover:text-white/80">Home</Link>
          <Link to="/products" className="hover:text-white/80">Products</Link>
          <Link to="/register" className="hover:text-white/80">Join</Link>
        </div>

        <div className="flex items-center gap-3">
          {(!user || user.role === 'buyer') && (
            <Link to="/cart" className="relative rounded-full p-2 hover:bg-white/10">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 border-l border-white/30 pl-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs capitalize text-white/80">{user.role}</div>
              </div>
              <Link to={`/${user.role}`} className="rounded-full p-2 hover:bg-white/10">
                <UserCircle size={24} />
              </Link>
              <button onClick={handleLogout} className="rounded-full p-2 hover:bg-white/10">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-white/30 pl-3">
              <Link to="/login" className="text-sm font-semibold hover:text-white/80">
                Login
              </Link>
              <Link to="/register" className="rounded bg-white px-4 py-2 text-sm font-semibold text-themePrimary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
