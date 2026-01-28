import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import Events from './pages/Events';
import PrivateRoute from './routes/PrivateRoute';
import Navigation from './components/Navigation';

import AdminUsers from './pages/AdminUsers';
import SessionTimeout from './components/SessionTimeout';

function App() {
  return (
    <Router>
      <SessionTimeout>
        <Navigation />
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
      </SessionTimeout>
    </Router>
  );
}

export default App;
