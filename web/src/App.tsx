import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { UserRole } from './types';

// Pages
const Login = () => <div>Login Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const Attendance = () => <div>Attendance Page</div>;
const EODReports = () => <div>EOD Reports Page</div>;
const JobSubmissions = () => <div>Job Submissions Page</div>;
const TeamManagement = () => <div>Team Management Page</div>;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={Object.values(UserRole)}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.RECRUITER, UserRole.CONSULTANT]}>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eod-reports"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.RECRUITER, UserRole.CONSULTANT]}>
                    <EODReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job-submissions"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.RECRUITER, UserRole.CONSULTANT]}>
                    <JobSubmissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team-management"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      UserRole.SUPER_ADMIN,
                      UserRole.ONSHORE_LEAD,
                      UserRole.OFFSHORE_MANAGER,
                      UserRole.OFFSHORE_LEAD,
                    ]}
                  >
                    <TeamManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App; 