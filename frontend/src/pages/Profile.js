import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
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
          reconocimientos: d.reconocimientos || '',
          tratamiento_datos: d.tratamiento_datos ? 'SI' : 'NO'
        });
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.tratamiento_datos !== 'SI') {
      setError('Debe aceptar y autorizar el tratamiento de datos personales para continuar.');
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);

    try {
      let payload = {
        ...formData,
        profesion: formData.cargo_actual,
        empresa: formData.nombre_empresa,
        tratamiento_datos: true
      };

      if (formData.laboralmente_activo === 'NO') {
        payload = {
          ...payload,
          cargo_actual: '',
          sector_economico: '',
          nombre_empresa: '',
          rango_salarial: '',
          profesion: '',
          empresa: ''
        };
      }

      await api.put('/profile', payload);
      setMessage('¡Información actualizada correctamente!');
      window.scrollTo(0, 0);

      setTimeout(() => {
        navigate('/events');
      }, 2000);

    } catch (err) {
      setError('Error al actualizar la información. Intente nuevamente.');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-serious min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-5">
                <span className="text-institutional fw-bold small text-uppercase tracking-widest mb-2 d-block">Actualización Obligatoria</span>
                <h2 className="fw-bold display-6 mb-2">Perfil del Graduado</h2>
                <p className="text-muted small">Tu información nos ayuda a brindarte mejores beneficios y oportunidades.</p>
              </div>

              {message && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Alert variant="success" className="border-0 shadow-sm text-center py-3 mb-4 d-flex align-items-center justify-content-center gap-2">
                    <FaCheckCircle className="text-success" /> {message}
                  </Alert>
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Alert variant="danger" className="border-0 shadow-sm text-center py-3 mb-4 small text-danger">
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Card className="pro-card border-0 overflow-hidden shadow-none">
                <Card.Body className="p-4 p-md-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Section 1: Personal Info */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <div style={{ width: '4px', height: '24px', background: 'var(--institutional-red)' }} className="rounded"></div>
                        <h5 className="fw-bold mb-0">Información Personal</h5>
                      </div>

                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">CORREO INSTITUCIONAL</Form.Label>
                            <Form.Control type="email" value={formData.email} disabled className="pro-input bg-light opacity-75" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">CORREO PERSONAL <span className="text-institutional">*</span></Form.Label>
                            <Form.Control required type="email" name="correo_personal" value={formData.correo_personal} onChange={handleChange} className="pro-input" />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">NOMBRE COMPLETO <span className="text-institutional">*</span></Form.Label>
                            <Form.Control required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="pro-input text-start" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">IDENTIFICACIÓN <span className="text-institutional">*</span></Form.Label>
                            <Form.Control required type="text" maxLength="10" name="identificacion" value={formData.identificacion} onChange={handleChange} className="pro-input" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">TELÉFONO <span className="text-institutional">*</span></Form.Label>
                            <Form.Control required type="text" maxLength="10" name="telefono" value={formData.telefono} onChange={handleChange} className="pro-input" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">CIUDAD DE RESIDENCIA <span className="text-institutional">*</span></Form.Label>
                            <Form.Control required type="text" name="ciudad_residencia" value={formData.ciudad_residencia} onChange={handleChange} className="pro-input" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">DIRECCIÓN <span className="text-institutional">*</span></Form.Label>
                            <Form.Control required type="text" name="direccion_domicilio" value={formData.direccion_domicilio} onChange={handleChange} className="pro-input" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Section 2: Academic Info */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <div style={{ width: '4px', height: '24px', background: 'var(--institutional-red)' }} className="rounded"></div>
                        <h5 className="fw-bold mb-0">Información Académica</h5>
                      </div>
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">PROGRAMA GRADUADO <span className="text-institutional">*</span></Form.Label>
                            <Form.Select required name="programa_academico" value={formData.programa_academico} onChange={handleChange} className="pro-input">
                              <option value="">Seleccione...</option>
                              {programas.map((p, i) => <option key={i} value={p}>{p}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary">SEDE <span className="text-institutional">*</span></Form.Label>
                            <Form.Select required name="sede" value={formData.sede} onChange={handleChange} className="pro-input">
                              <option value="">Seleccione...</option>
                              {sedes.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Section 3: Labor Info */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <div style={{ width: '4px', height: '24px', background: 'var(--institutional-red)' }} className="rounded"></div>
                        <h5 className="fw-bold mb-0">Situación Laboral</h5>
                      </div>
                      <Row className="g-4">
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-secondary d-block mb-3">ACTUALMENTE LABORA <span className="text-institutional">*</span></Form.Label>
                            <div className="d-flex flex-wrap gap-4">
                              {opcionesLaborales.map((opt, i) => (
                                <Form.Check
                                  key={i}
                                  type="radio"
                                  label={opt}
                                  name="laboralmente_activo"
                                  value={opt}
                                  checked={formData.laboralmente_activo === opt}
                                  onChange={handleChange}
                                  required
                                  className="small"
                                />
                              ))}
                            </div>
                          </Form.Group>
                        </Col>

                        {formData.laboralmente_activo !== 'NO' && (
                          <>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small fw-bold text-secondary">CARGO ACTUAL</Form.Label>
                                <Form.Control type="text" name="cargo_actual" value={formData.cargo_actual} onChange={handleChange} className="pro-input" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small fw-bold text-secondary">SECTOR ECONÓMICO <span className="text-institutional">*</span></Form.Label>
                                <Form.Select required name="sector_economico" value={formData.sector_economico} onChange={handleChange} className="pro-input">
                                  <option value="">Seleccione...</option>
                                  {sectores.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small fw-bold text-secondary">EMPRESA / EMPRENDIMIENTO</Form.Label>
                                <Form.Control type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} className="pro-input" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small fw-bold text-secondary">RANGO SALARIAL <span className="text-institutional">*</span></Form.Label>
                                <Form.Select required name="rango_salarial" value={formData.rango_salarial} onChange={handleChange} className="pro-input">
                                  <option value="">Seleccione...</option>
                                  {rangosSalarios.map((r, i) => <option key={i} value={r}>{r}</option>)}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </>
                        )}
                      </Row>
                    </div>

                    {/* Section 4: Consent */}
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <div style={{ width: '4px', height: '24px', background: 'var(--institutional-red)' }} className="rounded"></div>
                        <h5 className="fw-bold mb-0">Consentimiento</h5>
                      </div>
                      <Col xs={12} className="mb-4">
                        <Alert variant="light" className="small border-0 rounded-4 bg-light p-4 text-muted" style={{ lineHeight: '1.6' }}>
                          Autorizo de manera voluntaria y previa a la FESC para tratar mis datos personales de acuerdo con su Política de Tratamiento de Datos. Mi información será utilizada para fines académicos, estadísticos y de seguimiento.
                        </Alert>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-secondary d-block mb-3">¿ACEPTA EL TRATAMIENTO DE DATOS? <span className="text-institutional">*</span></Form.Label>
                          <div className="d-flex gap-4">
                            <Form.Check
                              type="radio"
                              label="SÍ, ACEPTO"
                              name="tratamiento_datos"
                              value="SI"
                              checked={formData.tratamiento_datos === 'SI'}
                              onChange={handleChange}
                              required
                              className="small fw-bold text-success"
                            />
                            <Form.Check
                              type="radio"
                              label="NO ACEPTO"
                              name="tratamiento_datos"
                              value="NO"
                              checked={formData.tratamiento_datos === 'NO'}
                              onChange={handleChange}
                              className="small"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </div>

                    <div className="d-grid gap-2 mt-5 pt-4 border-top">
                      <Button className="btn-institutional py-3 shadow-none" type="submit" disabled={loading}>
                        {loading ? 'PROCESANDO...' : 'ACTUALIZAR INFORMACIÓN'}
                      </Button>
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
