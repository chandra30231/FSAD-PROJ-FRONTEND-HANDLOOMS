import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const result = await registerUser(formData);
      if (!result?.ok) {
        setError(result?.message || 'Registration failed.');
        return;
      }

      setSuccess(result.message);
      window.setTimeout(() => navigate('/login'), 1000);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
        <div className="bg-gray-100 p-10">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-4 leading-7 text-gray-600">
            Register as a buyer to shop handloom products or as an artisan to list and manage your inventory.
          </p>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Note for Artisans</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Artisan accounts are created immediately and then shown to the admin portal for approval tracking.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900">Register</h2>
          <p className="mt-2 text-gray-600">Fill in your details to continue.</p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-themePrimary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                minLength={4}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-themePrimary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-themePrimary"
              >
                <option value="buyer">Buyer</option>
                <option value="artisan">Artisan</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-themePrimary px-4 py-3 font-semibold text-white disabled:opacity-70">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-themePrimary">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
