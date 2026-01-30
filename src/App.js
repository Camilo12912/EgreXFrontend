import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';
import Navigation from './components/Navigation';
import SessionTimeout from './components/SessionTimeout';
import Loading from './components/Loading';

// Lazy load pages for performance and loading state
const Login = React.lazy(() => import('./pages/Login'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ChangePassword = React.lazy(() => import('./pages/ChangePassword'));
const Events = React.lazy(() => import('./pages/Events'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers'));

function App() {
  return (
    <Router>
      <SessionTimeout>
        <Navigation />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={['egresado', 'admin']} />}>
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </SessionTimeout>
    </Router>
  );
}

export default App;
