import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';

import logo from '../assets/logo.png';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 50;
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return '??';
    if (user.nombre) {
      const names = user.nombre.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  const isActive = (path) => location.pathname === path;

  if (!token) return null;

  return (
    <Navbar
      expand="lg"
      className={`navbar-minimalist sticky-top transition-fast ${scrolled ? 'py-2 shadow-sm' : 'py-3'}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/events" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            style={{
              transition: 'all 0.3s ease-in-out',
              height: scrolled ? "36px" : "46px",
              width: 'auto'
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/events"
              className={`nav-link-pro px-3 ${isActive('/events') ? 'active' : ''}`}
            >
              Eventos
            </Nav.Link>

            {user && user.role !== 'admin' && (
              <Nav.Link
                as={Link}
                to="/profile"
                className={`nav-link-pro px-3 ${isActive('/profile') ? 'active' : ''}`}
              >
                Perfil
              </Nav.Link>
            )}

            {user && user.role === 'admin' && (
              <Nav.Link
                as={Link}
                to="/admin/dashboard"
                className={`nav-link-pro px-3 ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                Panel Admin
              </Nav.Link>
            )}

            <div className="ms-lg-4 mt-3 mt-lg-0">
              <Dropdown align="end">
                <Dropdown.Toggle variant="transparent" className="p-0 border-0 d-flex align-items-center gap-2 no-caret">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm transition-fast"
                    style={{
                      width: '38px',
                      height: '38px',
                      background: 'var(--institutional-red)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {getInitials()}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="border-0 shadow-lg mt-2 py-2 dropdown-menu-minimal">
                  <div className="px-3 py-2 border-bottom mb-2 d-lg-none">
                    <div className="fw-bold small text-serious">{user?.nombre || 'Usuario'}</div>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{user?.email}</div>
                  </div>

                  {user?.role !== 'admin' && (
                    <Dropdown.Item as={Link} to="/profile" className="py-2 d-flex align-items-center gap-2 small fw-medium">
                      <FaUser className="opacity-50" /> Mi Perfil
                    </Dropdown.Item>
                  )}

                  <Dropdown.Divider />

                  <Dropdown.Item onClick={handleLogout} className="py-2 d-flex align-items-center gap-2 small fw-medium text-danger">
                    <FaSignOutAlt /> Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
