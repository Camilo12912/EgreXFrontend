import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// No icons used in this component currently

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
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!token) return null;

  return (
    <Navbar
      expand="lg"
      className={`navbar-minimalist sticky-top transition-fast ${scrolled ? 'py-2' : 'py-3'}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            height={scrolled ? "40" : "50"}
            className="d-inline-block align-top me-2"
            style={{ transition: 'all 0.3s ease' }}
          />
          <span className="fw-bold text-serious tracking-tighter" style={{ fontSize: '1.2rem' }}>
            BIENESTAR
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {user && user.role === 'admin' && (
              <Nav.Link
                as={Link}
                to="/admin/dashboard"
                className={`nav-link-pro px-3 ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                Panel Admin
              </Nav.Link>
            )}

            <Nav.Link
              as={Link}
              to="/profile"
              className={`nav-link-pro px-3 ${isActive('/profile') ? 'active' : ''}`}
            >
              Mi Perfil
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/events"
              className={`nav-link-pro px-3 ${isActive('/events') ? 'active' : ''}`}
            >
              Eventos
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            <div className="d-none d-lg-flex flex-column align-items-end me-4">
              <span className="text-serious small fw-bold" style={{ fontSize: '0.75rem' }}>{user ? user.role.toUpperCase() : ''}</span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>{user ? user.email : ''}</span>
            </div>
            <Button
              variant="link"
              className="text-muted p-0 ms-lg-2 hover-institutional transition-fast text-decoration-none small fw-bold"
              onClick={handleLogout}
              style={{ fontSize: '0.8rem' }}
            >
              CERRAR SESIÓN
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
