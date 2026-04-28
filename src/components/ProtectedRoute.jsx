import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, isPublic }) => {
  const { user } = useAuth();

  if (!isPublic && !user) return <Navigate to="/login" replace />;
  if (!isPublic && allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;