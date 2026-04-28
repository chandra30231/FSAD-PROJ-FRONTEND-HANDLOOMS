import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await loginUser(credentials);
      if (!result?.ok) {
        setError(result?.message || 'Login failed.');
        return;
      }

      login(result.user);
      navigate(`/${result.user.role}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
        <div className="bg-themePrimary p-10 text-white">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-4 leading-7 text-white/90">
            Sign in to access the correct dashboard for buyer, artisan, admin, or marketing specialist.
          </p>

          <div className="mt-8 rounded-xl bg-white/10 p-5">
            <h2 className="text-lg font-semibold">Demo Credentials</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p>Buyer: `buyer@handlooms.com` / `buyer`</p>
              <p>Artisan: `raju@handlooms.com` / `artisan`</p>
              <p>Admin: `admin@handlooms.com` / `admin`</p>
              <p>Marketing: `marketing@handlooms.com` / `marketing`</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="mt-2 text-gray-600">Enter your email and password.</p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-themePrimary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-themePrimary"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-themePrimary px-4 py-3 font-semibold text-white disabled:opacity-70">
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-themePrimary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
