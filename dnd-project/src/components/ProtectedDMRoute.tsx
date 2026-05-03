import { Navigate } from 'react-router-dom';
import { useDM } from '../context/DMContext';

interface ProtectedDMRouteProps {
  element: React.ReactNode;
}

export function ProtectedDMRoute({ element }: ProtectedDMRouteProps) {
  const { isLoggedIn, isDM } = useDM();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isDM) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
}
