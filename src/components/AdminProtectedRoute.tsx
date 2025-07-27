import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  isAdmin?: boolean;
  exp?: number;
  // các trường khác nếu cần
}

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.isAdmin) return <Navigate to="/admin/login" replace />;
    // Kiểm tra hạn token (nếu có exp)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtectedRoute; 