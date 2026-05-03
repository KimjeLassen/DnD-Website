import { Navigate } from 'react-router-dom';
import { useDM } from '../context/DMContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { isLoggedIn } = useDM();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
}
