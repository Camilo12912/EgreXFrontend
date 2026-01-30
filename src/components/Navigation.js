import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaUser, FaMoon, FaSun } from 'react-icons/fa';

import logo from '../assets/logo.png';
import Credits from './Credits';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [showCredits, setShowCredits] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const lastClickRef = React.useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Optimized Scroll Handler with Debounce/Hysteresis
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll > 60) {
            setScrolled(true);
          } else if (currentScroll < 40) {
            setScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
        setShowCredits(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current > 2000) {
      setLogoClicks(1);
    } else {
      setLogoClicks(prev => {
        const next = prev + 1;
        if (next >= 5) {
          setShowCredits(true);
          return 0;
        }
        return next;
      });
    }
    lastClickRef.current = now;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
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
    return 'U';
  };

  const isActive = (path) => location.pathname === path;

  if (!token) return null;

  return (
    <>
      <Navbar
        expand="lg"
        className={`navbar-minimalist sticky-top transition-fast py-3 ${scrolled ? 'shadow-sm bg-glass' : ''}`}
        style={{ minHeight: '80px', transition: 'all 0.3s ease' }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/events"
            className="d-flex align-items-center"
            onClick={(e) => {
              if (location.pathname === '/events' || location.pathname === '/admin/dashboard') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: scrolled ? "40px" : "48px",
                width: 'auto',
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
                cursor: 'pointer',
                display: 'block'
              }}
            />
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-3 d-lg-none">
            <button
              onClick={toggleTheme}
              className="btn btn-link p-0 border-0 text-muted transition-fast"
              style={{ fontSize: '1.2rem' }}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun className="text-warning" />}
            </button>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none p-0" />
          </div>

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

              <button
                onClick={toggleTheme}
                className="btn btn-link p-0 border-0 text-muted transition-fast d-none d-lg-block ms-lg-3"
                style={{ fontSize: '1.1rem' }}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun className="text-warning" />}
              </button>

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
      <Credits show={showCredits} onHide={() => setShowCredits(false)} theme={theme} />
    </>
  );
};

export default Navigation;
