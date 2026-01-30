import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Modal, Table, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaUsers, FaClock, FaArrowRight, FaChartLine, FaListUl, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import api from '../services/api'; // Keep for events/history
import { useAlumni } from '../presentation/hooks/useAlumni';

const Dashboard = () => {
  const navigate = useNavigate();

  // Clean Architecture Hook
  const {
    metrics,
    recentUsers,
    loading: loadingAlumni,
    fetchMetrics,
    fetchRecentUsers,
    fetchVerifiedUsers,
    setRecentUsers
  } = useAlumni();

  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [showActiveUsersModal, setShowActiveUsersModal] = useState(false);
  const [activeUsersTab, setActiveUsersTab] = useState('recent'); // 'recent' or 'verified'
  const [statMode, setStatMode] = useState('program'); // 'program' or 'employment'

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      setShowHistoryModal(true);
      const response = await api.getGlobalHistory();
      setHistory(response.data);
      setLoadingHistory(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setLoadingHistory(false);
    }
  };

  // Wrappers for UI interactions to handle Modal state + Hook logic
  const handleFetchRecentUsers = async () => {
    setRecentUsers([]);
    setShowActiveUsersModal(true);
    setActiveUsersTab('recent');
    await fetchRecentUsers();
  };

  const handleFetchVerifiedUsers = async () => {
    setRecentUsers([]);
    setShowActiveUsersModal(true);
    setActiveUsersTab('verified');
    await fetchVerifiedUsers();
  };

  const StatCard = ({ title, value, showValue = true, icon: Icon, onClick, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="h-100"
    >
      <Card
        className="pro-card pro-card-hover h-100 border-0"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <Card.Body className="p-4 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="text-institutional" style={{ background: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '12px' }}>
                <Icon size={20} />
              </div>
              {onClick && <FaArrowRight className="text-muted opacity-25" size={12} />}
            </div>
            <div className="text-muted small fw-bold text-uppercase tracking-widest mb-1">{title}</div>
          </div>
          <div style={{ minHeight: '40px' }} className="d-flex align-items-end">
            {showValue && <div className="h2 fw-bold mb-0 text-serious">{value}</div>}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  return (
    <div className="bg-serious min-vh-100 py-5">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-institutional fw-bold small text-uppercase tracking-widest mb-2 d-block">Administración</span>
            <h1 className="fw-bold display-6 mb-2">Panel de Control</h1>
            <p className="text-muted mb-0 small uppercase">Resumen operativo del sistema de egresados</p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button className="btn-institutional px-4 shadow-none" onClick={() => navigate('/admin/users')}>
              <FaUsers className="me-2" size={14} /> GESTIONAR USUARIOS
            </Button>
          </motion.div>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <StatCard
              title="Total Egresados"
              value={metrics.totalAlumni}
              icon={FaUserGraduate}
              onClick={() => navigate('/admin/users')}
              delay={0.1}
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Usuarios Activos"
              value={metrics.activeUsers}
              showValue={false}
              icon={FaUsers}
              onClick={handleFetchRecentUsers}
              delay={0.2}
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Actividad Reciente"
              value={metrics.recentlyUpdated}
              showValue={false}
              icon={FaClock}
              onClick={fetchHistory}
              delay={0.3}
            />
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="h-100"
            >
              <Card className="pro-card h-100 border-0">
                <Card.Header className="bg-card-pro border-0 py-4 px-4 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-institutional" style={{ background: 'rgba(230, 57, 70, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <FaChartLine size={14} />
                    </div>
                    <h5 className="mb-0 fw-bold text-serious">Estadísticas de la Comunidad</h5>
                  </div>
                  <div className="d-flex gap-2">
                    <Badge
                      bg={statMode === 'program' ? 'danger' : 'light'}
                      className={`cursor-pointer px-3 py-2 transition-all ${statMode === 'program' ? 'shadow-sm scale-hover' : 'text-muted border hover-light-bg'}`}
                      onClick={() => setStatMode('program')}
                    >
                      CARRERAS
                    </Badge>
                    <Badge
                      bg={statMode === 'employment' ? 'danger' : 'light'}
                      className={`cursor-pointer px-3 py-2 transition-all ${statMode === 'employment' ? 'shadow-sm scale-hover' : 'text-muted border hover-light-bg'}`}
                      onClick={() => setStatMode('employment')}
                    >
                      EMPLEO
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="px-4 pb-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={statMode}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {(statMode === 'program' ? metrics.programStats : metrics.employmentStats).map((item, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-serious small fw-bold text-uppercase">{item.label}</span>
                            <span className="small text-muted">{item.value}%</span>
                          </div>
                          <ProgressBar
                            variant="danger"
                            now={item.value}
                            style={{ height: '6px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)' }}
                          />
                        </div>
                      ))}
                      {(statMode === 'program' ? metrics.programStats : metrics.employmentStats).length === 0 && (
                        <div className="text-center py-5 text-muted small">No hay suficientes datos para generar estadísticas</div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="h-100"
            >
              <Card className="pro-card h-100 border-0">
                <Card.Header className="bg-card-pro border-0 py-4 px-4">
                  <h5 className="mb-0 fw-bold text-serious">Accesos Directos</h5>
                </Card.Header>
                <Card.Body className="px-4">
                  <div className="d-grid gap-3">
                    <div
                      className="quick-access-tile d-flex align-items-center p-3 cursor-pointer"
                      onClick={() => navigate('/admin/users')}
                    >
                      <div className="icon-wrapper me-3">
                        <FaListUl size={18} />
                      </div>
                      <div>
                        <div className="tile-title">Lista de Usuarios</div>
                        <div className="tile-subtitle">Gestionar base de datos</div>
                      </div>
                      <FaArrowRight className="ms-auto arrow-icon" size={12} />
                    </div>

                    <div
                      className="quick-access-tile d-flex align-items-center p-3 cursor-pointer"
                      onClick={() => navigate('/events')}
                    >
                      <div className="icon-wrapper me-3">
                        <FaCalendarAlt size={18} />
                      </div>
                      <div>
                        <div className="tile-title">Eventos</div>
                        <div className="tile-subtitle">Publicar nuevas actividades</div>
                      </div>
                      <FaArrowRight className="ms-auto arrow-icon" size={12} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Global History Modal */}
        <AnimatePresence>
          {showHistoryModal && (
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg" centered className="minimal-modal">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Modal.Body className="p-4 p-md-5">
                  <div className="mb-4 d-flex align-items-center gap-3">
                    <div className="bg-light-pro text-institutional p-2 rounded-circle">
                      <FaHistory size={20} />
                    </div>
                    <h4 className="fw-bold mb-0">Historial de Cambios Recientes</h4>
                  </div>

                  {loadingHistory ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="danger" />
                    </div>
                  ) : (
                    <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                      <Table hover responsive className="small align-middle">
                        <thead>
                          <tr>
                            <th className="text-muted uppercase fw-bold border-0">Fecha</th>
                            <th className="text-muted uppercase fw-bold border-0">Usuario</th>
                            <th className="text-muted uppercase fw-bold border-0">Campo</th>
                            <th className="text-muted uppercase fw-bold border-0">Anterior</th>
                            <th className="text-muted uppercase fw-bold border-0">Nuevo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.length > 0 ? history.map((log) => {
                            const formatFieldName = (field) => {
                              const map = {
                                'nombre': 'Nombre',
                                'telefono': 'Teléfono',
                                'correo_personal': 'Correo',
                                'direccion_domicilio': 'Dirección',
                                'barrio': 'Barrio',
                                'ciudad': 'Ciudad',
                                'cargo_actual': 'Cargo',
                                'nombre_empresa': 'Empresa',
                                'sector_economico': 'Sector',
                                'rango_salarial': 'Salario',
                                'estudios_adicionales': 'Estudios',
                                'profesion': 'Profesión',
                                'programa_academico': 'Programa',
                                'fecha_actualizacion': 'Fecha Act.',
                                'laboralmente_activo': 'Laboral',
                                'ejerce_perfil_profesional': 'Ejerce',
                                'reconocimientos': 'Méritos'
                              };
                              return map[field] || field.replace(/_/g, ' ');
                            };

                            const formatValue = (val, field) => {
                              if (!val) return '-';
                              if (field === 'estudios_adicionales') return 'Actualizado (Lista)';
                              if (field.includes('fecha')) return new Date(val).toLocaleDateString();
                              return val;
                            };

                            return (
                              <tr key={log.id}>
                                <td>{new Date(log.created_at).toLocaleString()}</td>
                                <td className="fw-bold">{log.changed_by_nombre || log.changed_by_email || 'Admin'}</td>
                                <td className="text-institutional text-capitalize">{formatFieldName(log.field_name)}</td>
                                <td className="text-muted text-truncate" style={{ maxWidth: '150px' }} title={log.old_value}>{formatValue(log.old_value, log.field_name)}</td>
                                <td className="fw-bold text-truncate" style={{ maxWidth: '150px' }} title={log.new_value}>{formatValue(log.new_value, log.field_name)}</td>
                              </tr>
                            );
                          }) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4 text-muted">No hay actividad reciente</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  <div className="mt-4 text-end">
                    <Button variant="link" className="text-serious fw-bold text-decoration-none" onClick={() => setShowHistoryModal(false)}>
                      CERRAR
                    </Button>
                  </div>
                </Modal.Body>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
        {/* Active Users Modal */}
        <AnimatePresence>
          {showActiveUsersModal && (
            <Modal show={showActiveUsersModal} onHide={() => setShowActiveUsersModal(false)} size="lg" centered className="minimal-modal">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Modal.Body className="p-4 p-md-5">
                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light-pro text-institutional p-2 rounded-circle">
                        <FaUsers size={20} />
                      </div>
                      <h4 className="fw-bold mb-0">Gestión de Accesos</h4>
                    </div>
                    <div className="d-flex gap-2">
                      <Badge
                        bg={activeUsersTab === 'recent' ? 'danger' : 'light'}
                        className={`cursor-pointer px-3 py-2 transition-all ${activeUsersTab === 'recent' ? 'shadow-sm scale-hover' : 'text-muted border hover-light-bg'}`}
                        onClick={() => handleFetchRecentUsers()}
                      >
                        RECIENTES
                      </Badge>
                      <Badge
                        bg={activeUsersTab === 'verified' ? 'danger' : 'light'}
                        className={`cursor-pointer px-3 py-2 transition-all ${activeUsersTab === 'verified' ? 'shadow-sm scale-hover' : 'text-muted border hover-light-bg'}`}
                        onClick={() => handleFetchVerifiedUsers()}
                      >
                        VERIFICADOS
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted small mb-4">
                    {activeUsersTab === 'recent'
                      ? 'Últimos 10 usuarios que han ingresado al sistema.'
                      : 'Listado de egresados que ya completaron su cambio de contraseña inicial.'}
                  </p>

                  {loadingAlumni ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="danger" />
                    </div>
                  ) : (
                    <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                      <Table hover responsive className="small align-middle">
                        <thead>
                          <tr>
                            <th className="text-muted uppercase fw-bold border-0">Nombre</th>
                            <th className="text-muted uppercase fw-bold border-0">Identificación</th>
                            <th className="text-muted uppercase fw-bold border-0">Programa</th>
                            <th className="text-muted uppercase fw-bold border-0">Último Acceso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.length > 0 ? recentUsers.map((u) => (
                            <tr key={u.id}>
                              <td className="fw-bold text-serious">{u.nombre || 'Sin perfil'}</td>
                              <td>{u.identificacion || u.documento || '-'}</td>
                              <td className="text-institutional">{u.programa_academico || '-'}</td>
                              <td className="text-muted">
                                {u.last_login ? new Date(u.last_login).toLocaleString() : 'Nunca'}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="4" className="text-center py-4 text-muted">Aún no hay actividad de inicio de sesión registrada</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  <div className="mt-4 text-end">
                    <Button variant="link" className="text-serious fw-bold text-decoration-none" onClick={() => setShowActiveUsersModal(false)}>
                      CERRAR
                    </Button>
                  </div>
                </Modal.Body>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Dashboard;
