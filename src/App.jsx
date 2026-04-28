import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

// General Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

// Dashboards
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MarketingDashboard from './pages/marketing/MarketingDashboard';

const Layout = () => {
  const { user } = useAuth();
  const themeClass = user && user.role !== 'buyer' ? `theme-${user.role}` : '';

  return (
    <div className={`min-h-screen ${themeClass} bg-themeBg text-themeText flex flex-col transition-colors duration-300`}>
      <Navbar />
      <main className="flex-grow p-4 md:p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes with Layout */}
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute isPublic={true} />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
              </Route>

              {/* Buyer */}
              <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
                <Route path="/buyer" element={<BuyerDashboard />} />
              </Route>

              {/* Artisan */}
              <Route element={<ProtectedRoute allowedRoles={['artisan']} />}>
                <Route path="/artisan" element={<ArtisanDashboard />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Marketing */}
              <Route element={<ProtectedRoute allowedRoles={['marketing']} />}>
                <Route path="/marketing" element={<MarketingDashboard />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;