import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;