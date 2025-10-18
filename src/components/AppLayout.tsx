import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FullPageLoader from './FullPageLoader';

const AppLayout: React.FC = () => {
  const { authReady } = useAuth();

  if (!authReady) {
    return <FullPageLoader />;
  }

  return <Outlet />;
};

export default AppLayout;
