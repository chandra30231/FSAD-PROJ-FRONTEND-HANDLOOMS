import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const RoleLayout = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  const themeClass = user.role !== 'buyer' ? `theme-${user.role}` : '';

  return (
    <div className={`min-h-screen ${themeClass} bg-themeBg text-themeText font-sans transition-colors duration-300 flex flex-col`}>
      <Navbar />
      <main className="p-8 flex-grow">
        <Outlet /> 
      </main>
    </div>
  );
};

export default RoleLayout;