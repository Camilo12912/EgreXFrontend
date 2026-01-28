import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// No icons used in this component currently
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import api from '../services/api';

const Login = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { identificacion, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('loginTimestamp', Date.now().toString());

      if (user.needs_password_change) {
        navigate('/change-password');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas. Intente de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-serious p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pro-card p-4 p-md-5"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ maxHeight: '60px', width: 'auto' }}
              className="mb-4"
            />
            <h5 className="fw-bold text-serious mb-1" style={{ letterSpacing: '1px' }}>
              BIENESTAR
            </h5>
            <div
              style={{ width: '20px', height: '2px', background: 'var(--institutional-red)', margin: '10px auto' }}
              className="rounded"
            />
            <p className="text-secondary small text-uppercase fw-medium mb-0" style={{ letterSpacing: '1.5px', fontSize: '0.65rem', opacity: 0.6 }}>
              Sistema de Egresados
            </p>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="danger" className="border-0 bg-transparent text-danger small py-1 mb-4 text-center">
              {error}
            </Alert>
          </motion.div>
        )}

        <Form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Número de Cédula"
                required
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                className="pro-input py-2"
                style={{ fontSize: '0.9rem' }}
              />
            </Form.Group>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pro-input py-2"
                style={{ fontSize: '0.9rem' }}
              />
            </Form.Group>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="d-grid mt-4"
          >
            <Button
              type="submit"
              className="btn-institutional py-2 tracking-widest uppercase transition-fast d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
              style={{ fontSize: '0.8rem', letterSpacing: '1px', width: '100%' }}
            >
              {loading ? 'CARGANDO...' : 'INGRESAR'}
            </Button>
          </motion.div>
        </Form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-5"
        >
          <span
            className="text-institutional cursor-pointer small fw-medium text-decoration-none"
            onClick={() => setShowSupportModal(true)}
            style={{ fontSize: '0.7rem', opacity: 0.8 }}
          >
            Soporte Técnico
          </span>
        </motion.div>

        {/* Modal de Soporte */}
        <Modal show={showSupportModal} onHide={() => setShowSupportModal(true)} centered className="minimal-modal" size="sm">
          <Modal.Body className="p-4 text-center">
            <div className="mb-3 text-institutional">
              <img src={logo} alt="Logo" style={{ maxHeight: '40px' }} className="mb-2" />
            </div>
            <h6 className="fw-bold mb-3">Soporte Técnico</h6>
            <p className="text-muted small mb-4">
              Si presentas problemas con tu acceso, por favor contacta a la oficina de Bienestar Institucional o escribe a:
              <br /><strong className="text-serious">sistemas@fesc.edu.co</strong>
            </p>
            <Button variant="dark" className="w-100 fw-bold small" onClick={() => setShowSupportModal(false)}>
              ENTENDIDO
            </Button>
          </Modal.Body>
        </Modal>
      </motion.div>

      <p className="position-absolute bottom-0 mb-4 small text-secondary opacity-25" style={{ fontSize: '0.65rem' }}>
        &copy; 2026 Admin Panel
      </p>
    </div>
  );
};

export default Login;
