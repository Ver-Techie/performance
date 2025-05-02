import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { LoadingState } from './components/LoadingState';
import { useAuth } from './hooks/useAuth';
import React from 'react';

// Lazy load pages
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box minH="100vh">
      <React.Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/profile" element={user ? <Profile /> : <Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Box>
  );
}

export default App; 