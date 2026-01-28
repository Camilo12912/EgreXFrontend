import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaGraduationCap, FaBriefcase, FaCheckCircle, FaClipboardCheck } from 'react-icons/fa';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    correo_personal: '',
    nombre: '',
    identificacion: '',
    telefono: '',
    ciudad_residencia: '',
    direccion_domicilio: '',
    barrio: '',
    programa_academico: '',
    sede: '',
    laboralmente_activo: '',
    cargo_actual: '',
    sector_economico: '',
    nombre_empresa: '',
    rango_salarial: '',
    ejerce_perfil_profesional: '',
    profesion: '',
    reconocimientos: '',
    tratamiento_datos: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const programas = [
    "Técnico Procesos Contables", "Tecnología Gestión Financiera", "Administración Financiera",
    "Técnico Mercadotecnia", "Tecnología Gestión Negocios Internacionales", "Administración Negocios Internacionales presencial",
    "Técnico Procesos Diseño Modas", "Tecnología Gestión Diseño Modas", "Diseño Administración Negocios de la Moda",
    "Técnico Procesos Aduaneros", "Tecnología Comercio Internacional", "Administración Negocios internacionales",
    "Técnico Operaciones logísticas", "Tecnología Logística Empresarial",
    "Técnico Operaciones Turísticas", "Tecnología Servicios de bienestar Turísticos", "Administración Turística y Hotelera",
    "Técnico Producción Grafica", "Tecnología Gestión Contenidos Gráficos Publicitarios", "Diseño Gráfico",
    "Técnico Profesional En Soporte informático", "Tecnólogo En Desarrollo De Software", "Ingeniería De Software",
    "Tecnología Administración Redes", "Tecnología Administración Informática",
    "Tecnología Mercadotecnia y Cio. Internacional", "Especialización en Gestión Pública"
  ];

  const sedes = ["Sede FESC Cúcuta", "Sede FESC Ocaña"];
  const opcionesLaborales = ["SI", "NO", "Soy Independiente", "Tengo mi propio Negocio y/o Emprendimiento"];
  const sectores = [
    "Sector Elaboración de bienes o productos de consumo", "Sector Educativo", "Sector Comercial (Ventas)",
    "Sector Financiero y/o Bancario", "Sector Inmobiliario", "Sector Salud", "Sector Investigación y Tecnología",
    "Sector Entretenimiento", "Sector Turistico y Hotelero", "Sector Restaurantes",
    "Sector Público (Servidor Público, Contratista del estado, Cargo Público)", "Sector Agropecuario",
    "Sector Recreacion y Deporte", "Sector de Confección (Ropa, Textil, Calzado)",
    "Sector Belleza (Peluquería, Estéticas, Spa)", "Artes Graficas, Diseño Grafico, Community Manager",
    "No estoy Laborando"
  ];

  const rangosSalarios = [
    "Menos de $800.000", "Entre 801.000 a $908.526", "Entre $908.527 a $1.200.000",
    "Entre $1.201.000 a $1.300.000", "Entre $1.301.000 a $1.500.000", "Entre $1.501.001 a $1.700.000",
    "Entre $1.701.000 a $1.800.000", "Entre $1.800.001 a $2.000.000", "Entre $2.000.001 a $2.500.000",
    "Entre $2.500.00 a $3.000.000", "Mas de $3.001.000", "No laboro actualmente"
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const user = JSON.parse(localStorage.getItem('user'));

      if (response.data) {
        const d = response.data;
        setFormData({
          email: user?.email || '',
          correo_personal: d.correo_personal || '',
          nombre: d.nombre || '',
          identificacion: d.identificacion || '',
          telefono: d.telefono || '',
          ciudad_residencia: d.ciudad_residencia || '',
          direccion_domicilio: d.direccion_domicilio || '',
          barrio: d.barrio || '',
          programa_academico: d.programa_academico || '',
          sede: d.sede || '',
          laboralmente_activo: d.laboralmente_activo || '',
          cargo_actual: d.cargo_actual || '',
          sector_economico: d.sector_economico || '',
          nombre_empresa: d.nombre_empresa || d.empresa || '',
          rango_salarial: d.rango_salarial || '',
          ejerce_perfil_profesional: d.ejerce_perfil_profesional || '',
          profesion: d.profesion || '',
          reconocimientos: d.reconocimientos || '',
          tratamiento_datos: d.tratamiento_datos ? 'SI' : 'NO'
        });
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    // Basic validation for current step
    if (currentStep === 1) {
      const requiredFields = ['correo_personal', 'nombre', 'identificacion', 'telefono', 'ciudad_residencia', 'barrio', 'direccion_domicilio'];
      const missing = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
      if (missing.length > 0) {
        setError('Por favor complete todos los campos obligatorios del paso 1.');
        window.scrollTo(0, 0);
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.profesion || !formData.programa_academico || !formData.sede) {
        setError('Por favor complete todos los campos obligatorios del paso 2.');
        window.scrollTo(0, 0);
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.laboralmente_activo) {
        setError('Por favor responda si está laborando actualmente.');
        window.scrollTo(0, 0);
        return;
      }
      if (formData.laboralmente_activo !== 'NO') {
        if (!formData.ejerce_perfil_profesional || !formData.sector_economico || !formData.rango_salarial || !formData.cargo_actual || !formData.nombre_empresa) {
          setError('Por favor complete todos los campos obligatorios del paso 3.');
          window.scrollTo(0, 0);
          return;
        }
      }
    }

    setError('');
    window.scrollTo(0, 0);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.tratamiento_datos !== 'SI') {
      setError('Debe aceptar y autorizar el tratamiento de datos personales para continuar.');
      setCurrentStep(4);
      return;
    }

    setLoading(true);

    try {
      let payload = {
        ...formData,
        tratamiento_datos: true
      };

      if (formData.laboralmente_activo === 'NO') {
        payload = {
          ...payload,
          cargo_actual: '',
          sector_economico: '',
          nombre_empresa: '',
          rango_salarial: '',
          empresa: '',
          ejerce_perfil_profesional: 'NO'
        };
      }

      await api.put('/profile', payload);
      setMessage('¡Perfil actualizado con éxito! Redirigiendo...');

      // Update local storage user data if name changed
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, nombre: formData.nombre }));

      // Temporary flag to bypass stale cache in Events page
      localStorage.setItem('profileJustUpdated', new Date().getTime().toString());

      setTimeout(() => {
        window.location.href = '/events';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  const StepIndicator = () => {
    const steps = [
      { id: 1, icon: <FaUser />, label: 'Personal' },
      { id: 2, icon: <FaGraduationCap />, label: 'Académica' },
      { id: 3, icon: <FaBriefcase />, label: 'Laboral' },
      { id: 4, icon: <FaClipboardCheck />, label: 'Finalizar' }
    ];

    return (
      <div className="d-flex justify-content-between mb-5 position-relative px-2">
        <div
          className="position-absolute bg-light"
          style={{ height: '2px', top: '20px', left: '10%', right: '10%', zIndex: 0 }}
        />
        <div
          className="position-absolute bg-institutional transition-fast"
          style={{
            height: '2px',
            top: '20px',
            left: '10%',
            width: `${(currentStep - 1) * 26.6}%`,
            zIndex: 0
          }}
        />
        {steps.map(step => (
          <div key={step.id} className="text-center" style={{ zIndex: 1, width: '60px' }}>
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto transition-fast mb-2 shadow-sm
                ${currentStep >= step.id ? 'bg-institutional' : 'bg-white border text-muted'}`}
              style={{
                width: '40px',
                height: '40px',
                color: currentStep >= step.id ? 'white' : 'var(--institutional-red)',
                border: currentStep >= step.id ? 'none' : '2px solid #e2e8f0'
              }}
            >
              {step.icon}
            </div>
            <span className={`small fw-bold ${currentStep >= step.id ? 'text-institutional' : 'text-muted d-none d-md-block'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-serious min-vh-100 py-4 py-md-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold display-6 mb-2">Completar Perfil</h2>
                <p className="text-muted">Mantén tu información al día para recibir beneficios exclusivos.</p>
              </div>

              <StepIndicator />

              {message && <Alert variant="success" className="border-0 shadow-sm rounded-4 mb-4 text-center py-3"><FaCheckCircle className="me-2" /> {message}</Alert>}
              {error && <Alert variant="danger" className="border-0 shadow-sm rounded-4 mb-4 text-center py-3 small">{error}</Alert>}

              <Card className="pro-card border-0 shadow-sm overflow-hidden mb-5">
                <Card.Body className="p-4 p-md-5">
                  <Form onSubmit={handleSubmit}>

                    {currentStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h5 className="fw-bold mb-4">01. Datos Personales</h5>
                        <Row className="g-4">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">CORREO INSTITUCIONAL</Form.Label>
                              <Form.Control type="email" value={formData.email} disabled className="pro-input bg-light" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">CORREO PERSONAL *</Form.Label>
                              <Form.Control required type="email" name="correo_personal" value={formData.correo_personal} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">NOMBRE COMPLETO *</Form.Label>
                              <Form.Control required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">IDENTIFICACIÓN *</Form.Label>
                              <Form.Control required type="text" name="identificacion" value={formData.identificacion} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">TELÉFONO *</Form.Label>
                              <Form.Control required type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">CIUDAD *</Form.Label>
                              <Form.Control required type="text" name="ciudad_residencia" value={formData.ciudad_residencia} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">BARRIO *</Form.Label>
                              <Form.Control required type="text" name="barrio" value={formData.barrio} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">DIRECCIÓN *</Form.Label>
                              <Form.Control required type="text" name="direccion_domicilio" value={formData.direccion_domicilio} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                        </Row>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h5 className="fw-bold mb-4">02. Información Académica</h5>
                        <Row className="g-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">TÍTULO O PROFESIÓN *</Form.Label>
                              <Form.Control required type="text" name="profesion" value={formData.profesion} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">PROGRAMA GRADUADO *</Form.Label>
                              <Form.Select required name="programa_academico" value={formData.programa_academico} onChange={handleChange} className="pro-input">
                                <option value="">Seleccione...</option>
                                {programas.map((p, i) => <option key={i} value={p}>{p}</option>)}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">SEDE *</Form.Label>
                              <Form.Select required name="sede" value={formData.sede} onChange={handleChange} className="pro-input">
                                <option value="">Seleccione...</option>
                                {sedes.map((s, i) => <option key={i} value={s}>{s}</option>)}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h5 className="fw-bold mb-4">03. Situación Laboral</h5>
                        <Row className="g-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary d-block mb-3">¿ESTÁS LABORANDO ACTUALMENTE? *</Form.Label>
                              <div className="d-flex flex-wrap gap-4">
                                {opcionesLaborales.map((opt, i) => (
                                  <Form.Check key={i} type="radio" label={opt} name="laboralmente_activo" value={opt} checked={formData.laboralmente_activo === opt} onChange={handleChange} required />
                                ))}
                              </div>
                            </Form.Group>
                          </Col>

                          {formData.laboralmente_activo !== 'NO' && formData.laboralmente_activo !== '' && (
                            <>
                              <Col md={12}>
                                <Form.Group>
                                  <Form.Label className="small fw-bold text-secondary d-block mb-3">¿EJERZES TU PERFIL PROFESIONAL? *</Form.Label>
                                  <div className="d-flex gap-4">
                                    <Form.Check type="radio" label="SÍ" name="ejerce_perfil_profesional" value="SI" checked={formData.ejerce_perfil_profesional === 'SI'} onChange={handleChange} required />
                                    <Form.Check type="radio" label="NO" name="ejerce_perfil_profesional" value="NO" checked={formData.ejerce_perfil_profesional === 'NO'} onChange={handleChange} />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label className="small fw-bold text-secondary">CARGO ACTUAL *</Form.Label>
                                  <Form.Control required type="text" name="cargo_actual" value={formData.cargo_actual} onChange={handleChange} className="pro-input" />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label className="small fw-bold text-secondary">EMPRESA *</Form.Label>
                                  <Form.Control required type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} className="pro-input" />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label className="small fw-bold text-secondary">SECTOR ECONÓMICO *</Form.Label>
                                  <Form.Select required name="sector_economico" value={formData.sector_economico} onChange={handleChange} className="pro-input">
                                    <option value="">Seleccione...</option>
                                    {sectores.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label className="small fw-bold text-secondary">RANGO SALARIAL *</Form.Label>
                                  <Form.Select required name="rango_salarial" value={formData.rango_salarial} onChange={handleChange} className="pro-input">
                                    <option value="">Seleccione...</option>
                                    {rangosSalarios.map((r, i) => <option key={i} value={r}>{r}</option>)}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </>
                          )}
                        </Row>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h5 className="fw-bold mb-4">04. Consentimiento y Logros</h5>
                        <Row className="g-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary">MÉRITOS Y RECONOCIMIENTOS</Form.Label>
                              <Form.Control as="textarea" rows={3} name="reconocimientos" value={formData.reconocimientos} onChange={handleChange} className="pro-input" placeholder="Opcional..." />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <div className="bg-light p-3 rounded-4 small text-muted mb-4">
                              Autorizo a la FESC para el tratamiento de mis datos personales según su política de privacidad. Esta información será usada exclusivamente para fines institucionales.
                            </div>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-secondary d-block mb-3">¿AUTORIZA EL TRATAMIENTO DE DATOS? *</Form.Label>
                              <div className="d-flex gap-4">
                                <Form.Check type="radio" label="SÍ, AUTORIZO" name="tratamiento_datos" value="SI" checked={formData.tratamiento_datos === 'SI'} onChange={handleChange} required className="fw-bold text-success" />
                                <Form.Check type="radio" label="NO AUTORIZO" name="tratamiento_datos" value="NO" checked={formData.tratamiento_datos === 'NO'} onChange={handleChange} />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </motion.div>
                    )}

                    <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                      <Button variant="light" className={`px-4 fw-bold text-muted ${currentStep === 1 ? 'invisible' : ''}`} onClick={prevStep}>
                        VOLVER
                      </Button>

                      {currentStep < 4 ? (
                        <Button className="btn-institutional px-5 fw-bold" onClick={nextStep}>
                          CONTINUAR
                        </Button>
                      ) : (
                        <Button className="btn-institutional px-5 fw-bold" type="submit" disabled={loading}>
                          {loading ? 'GUARDANDO...' : 'FINALIZAR'}
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
