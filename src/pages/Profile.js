import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaGraduationCap, FaBriefcase, FaCheckCircle, FaClipboardCheck, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import { CAREERS } from '../utils/constants';

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
    tratamiento_datos: '',
    has_estudios_adicionales: 'NO',
    estudios_adicionales: [], // Array of { id, es_fesc, programa, institucion }
    detalles_laborales: null,
    nombre_negocio: '',
    tiempo_negocio: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const programas = CAREERS;

  const sedes = ["Sede FESC Cúcuta", "Sede FESC Ocaña"];
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

        // Parse estudios_adicionales flexibly
        let estudios = [];
        if (d.estudios_adicionales) {
          if (Array.isArray(d.estudios_adicionales)) {
            estudios = d.estudios_adicionales.map((e, i) => ({ ...e, id: i }));
          } else if (typeof d.estudios_adicionales === 'object') {
            // Legacy single object support
            estudios = [{ ...d.estudios_adicionales, id: 0 }];
          }
        }

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
          tratamiento_datos: d.tratamiento_datos ? 'SI' : 'NO',
          has_estudios_adicionales: estudios.length > 0 ? 'SI' : 'NO',
          estudios_adicionales: estudios,
          detalles_laborales: d.detalles_laborales || null,
          nombre_negocio: d.detalles_laborales?.nombre_negocio || '',
          tiempo_negocio: d.detalles_laborales?.tiempo_negocio || ''
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

  // Studies Management
  const addStudy = () => {
    setFormData(prev => ({
      ...prev,
      estudios_adicionales: [
        ...prev.estudios_adicionales,
        { id: Date.now(), es_fesc: '', programa: '', institucion: '' }
      ]
    }));
  };

  const removeStudy = (id) => {
    setFormData(prev => ({
      ...prev,
      estudios_adicionales: prev.estudios_adicionales.filter(s => s.id !== id)
    }));
  };

  const updateStudy = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      estudios_adicionales: prev.estudios_adicionales.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  const nextStep = () => {
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
      if (formData.has_estudios_adicionales === 'SI') {
        if (formData.estudios_adicionales.length === 0) {
          setError('Si indicó tener estudios adicionales, por favor agregue al menos uno.');
          window.scrollTo(0, 0);
          return;
        }
        const incomplete = formData.estudios_adicionales.some(s =>
          !s.es_fesc ||
          (s.es_fesc === 'SI' && !s.programa) ||
          (s.es_fesc === 'NO' && (!s.programa || !s.institucion))
        );
        if (incomplete) {
          setError('Por favor complete la información de todos los estudios adicionales agregados.');
          window.scrollTo(0, 0);
          return;
        }
      }
    } else if (currentStep === 3) {
      if (!formData.laboralmente_activo) {
        setError('Por favor responda si está laborando actualmente.');
        window.scrollTo(0, 0);
        return;
      }
      if (formData.laboralmente_activo !== 'NO') {
        const isEmployee = formData.laboralmente_activo === 'SI';
        if (isEmployee) {
          if (!formData.ejerce_perfil_profesional || !formData.sector_economico || !formData.rango_salarial || !formData.cargo_actual || !formData.nombre_empresa) {
            setError('Por favor complete todos los campos obligatorios del paso 3.');
            window.scrollTo(0, 0);
            return;
          }
        } else {
          if (!formData.nombre_negocio || !formData.sector_economico) {
            setError('Por favor complete los datos de su negocio/actividad.');
            window.scrollTo(0, 0);
            return;
          }
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
        tratamiento_datos: true,
        estudios_adicionales: formData.has_estudios_adicionales === 'SI' ? formData.estudios_adicionales.map(({ id, ...rest }) => rest) : null,
        detalles_laborales: (formData.laboralmente_activo.includes('Independiente') || formData.laboralmente_activo.includes('Negocio')) ? {
          nombre_negocio: formData.nombre_negocio,
          tiempo_negocio: formData.tiempo_negocio
        } : null
      };

      if (formData.laboralmente_activo === 'NO') {
        payload = {
          ...payload,
          cargo_actual: '',
          sector_economico: '',
          nombre_empresa: '',
          rango_salarial: '',
          empresa: '',
          ejerce_perfil_profesional: 'NO',
          detalles_laborales: null
        };
      } else if (formData.laboralmente_activo !== 'SI') {
        // Independent / Business
        payload = {
          ...payload,
          cargo_actual: 'Independiente / Dueño',
          nombre_empresa: formData.nombre_negocio,
          rango_salarial: formData.rango_salarial || 'Variable',
          empresa: formData.nombre_negocio // Mapping for compatibility
        };
      }

      await api.put('/profile', payload);
      setMessage('¡Perfil actualizado con éxito! Redirigiendo...');

      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, nombre: formData.nombre }));
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
        <div className="position-absolute bg-light-pro" style={{ height: '2px', top: '20px', left: '10%', right: '10%', zIndex: 0 }} />
        <div
          className="position-absolute bg-institutional transition-fast"
          style={{ height: '2px', top: '20px', left: '10%', width: `${(currentStep - 1) * 26.6}%`, zIndex: 0 }}
        />
        {steps.map(step => (
          <div key={step.id} className="text-center" style={{ zIndex: 1, width: '60px' }}>
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto transition-fast mb-2 shadow-sm
                                ${currentStep >= step.id ? 'bg-institutional' : 'bg-card-pro border opacity-50'}`}
              style={{
                width: '40px', height: '40px',
                color: currentStep >= step.id ? 'white' : 'var(--institutional-red)',
                border: currentStep >= step.id ? 'none' : '2px solid var(--border-light)'
              }}
            >
              {step.icon}
            </div>
            <span className={`small fw-bold ${currentStep >= step.id ? 'text-institutional' : 'text-muted d-none d-md-block'}`}>{step.label}</span>
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
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">CORREO PERSONAL *</Form.Label>
                              <Form.Control required type="email" name="correo_personal" value={formData.correo_personal} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">NOMBRE COMPLETO *</Form.Label>
                              <Form.Control required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">IDENTIFICACIÓN *</Form.Label>
                              <Form.Control required type="text" name="identificacion" value={formData.identificacion} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">TELÉFONO *</Form.Label>
                              <Form.Control required type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">CIUDAD *</Form.Label>
                              <Form.Control required type="text" name="ciudad_residencia" value={formData.ciudad_residencia} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">BARRIO *</Form.Label>
                              <Form.Control required type="text" name="barrio" value={formData.barrio} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">DIRECCIÓN *</Form.Label>
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
                              <Form.Label className="small fw-bold">TÍTULO O PROFESIÓN *</Form.Label>
                              <Form.Control required type="text" name="profesion" value={formData.profesion} onChange={handleChange} className="pro-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">PROGRAMA GRADUADO {formData.programa_academico && '(Solo Lectura)'} *</Form.Label>
                              <Form.Select required name="programa_academico" value={formData.programa_academico} onChange={handleChange} className={`pro-input ${formData.programa_academico ? 'bg-light' : ''}`} disabled={!!formData.programa_academico}>
                                <option value="">Seleccione...</option>
                                {programas.map((p, i) => <option key={i} value={p}>{p}</option>)}
                              </Form.Select>
                            </Form.Group>
                          </Col>

                          {/* Multiple Studies Section */}
                          <Col md={12} className="mt-5 border-top pt-4">
                            <h6 className="fw-bold mb-3 text-institutional">Estudios Adicionales</h6>
                            <Form.Group className="mb-4">
                              <div className="d-flex gap-4">
                                <Form.Check type="radio" label="SÍ" name="has_estudios_adicionales" value="SI" checked={formData.has_estudios_adicionales === 'SI'} onChange={handleChange} />
                                <Form.Check type="radio" label="NO" name="has_estudios_adicionales" value="NO" checked={formData.has_estudios_adicionales === 'NO'} onChange={handleChange} />
                              </div>
                            </Form.Group>

                            {formData.has_estudios_adicionales === 'SI' && (
                              <div className="d-flex flex-column gap-3">
                                <AnimatePresence>
                                  {formData.estudios_adicionales.map((study, index) => (
                                    <motion.div
                                      key={study.id}
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="bg-light-pro p-4 rounded-4 border position-relative"
                                    >
                                      <Button variant="link" className="position-absolute top-0 end-0 p-3 text-danger" onClick={() => removeStudy(study.id)}>
                                        <FaTrash size={14} />
                                      </Button>

                                      <h6 className="fw-bold small text-muted mb-3 uppercase">Estudio #{index + 1}</h6>

                                      <Row className="g-3">
                                        <Col md={12}>
                                          <Form.Group>
                                            <Form.Label className="small fw-bold">¿ES DE LA FESC?</Form.Label>
                                            <div className="d-flex gap-4">
                                              <Form.Check type="radio" label="SÍ" name={`es_fesc_${study.id}`} checked={study.es_fesc === 'SI'} onChange={() => updateStudy(study.id, 'es_fesc', 'SI')} />
                                              <Form.Check type="radio" label="NO" name={`es_fesc_${study.id}`} checked={study.es_fesc === 'NO'} onChange={() => updateStudy(study.id, 'es_fesc', 'NO')} />
                                            </div>
                                          </Form.Group>
                                        </Col>

                                        {study.es_fesc === 'SI' ? (
                                          <Col md={12}>
                                            <Form.Group>
                                              <Form.Label className="small fw-bold">PROGRAMA FESC</Form.Label>
                                              <Form.Select value={study.programa} onChange={(e) => updateStudy(study.id, 'programa', e.target.value)} className="pro-input">
                                                <option value="">Seleccione...</option>
                                                {programas.map((p, i) => <option key={i} value={p}>{p}</option>)}
                                              </Form.Select>
                                            </Form.Group>
                                          </Col>
                                        ) : study.es_fesc === 'NO' && (
                                          <>
                                            <Col md={6}>
                                              <Form.Group>
                                                <Form.Label className="small fw-bold">INSTITUCIÓN</Form.Label>
                                                <Form.Control value={study.institucion} onChange={(e) => updateStudy(study.id, 'institucion', e.target.value)} className="pro-input" placeholder="Ej: Universidad..." />
                                              </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                              <Form.Group>
                                                <Form.Label className="small fw-bold">PROGRAMA / CURSO</Form.Label>
                                                <Form.Control value={study.programa} onChange={(e) => updateStudy(study.id, 'programa', e.target.value)} className="pro-input" placeholder="Ej: Diplomado..." />
                                              </Form.Group>
                                            </Col>
                                          </>
                                        )}
                                      </Row>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>

                                <Button variant="outline-institutional" onClick={addStudy} className="d-flex align-items-center justify-content-center gap-2 py-3 border-dashed">
                                  <FaPlus /> AGREGAR OTRO ESTUDIO
                                </Button>
                              </div>
                            )}
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">SEDE *</Form.Label>
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
                        <h5 className="fw-bold mb-4">03. Información Laboral</h5>
                        <Form.Group className="mb-4 bg-light-pro p-4 rounded-4 border">
                          <Form.Label className="small fw-bold mb-3">¿LABORALMENTE ACTIVO? *</Form.Label>
                          <div className="d-flex flex-column gap-2">
                            {["SI", "NO", "Soy Independiente", "Tengo mi propio Negocio y/o Emprendimiento"].map((op, i) => (
                              <Form.Check key={i} type="radio" label={op} name="laboralmente_activo" value={op} checked={formData.laboralmente_activo === op} onChange={handleChange} className="mb-2" />
                            ))}
                          </div>
                        </Form.Group>

                        {formData.laboralmente_activo === 'SI' && (
                          <Row className="g-4">
                            <Col md={12}><Form.Group><Form.Label className="small fw-bold">CARGO ACTUAL *</Form.Label><Form.Control required name="cargo_actual" value={formData.cargo_actual} onChange={handleChange} className="pro-input" /></Form.Group></Col>
                            <Col md={12}><Form.Group><Form.Label className="small fw-bold">EMPRESA *</Form.Label><Form.Control required name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} className="pro-input" /></Form.Group></Col>
                            <Col md={6}><Form.Group><Form.Label className="small fw-bold">SECTOR ECONÓMICO *</Form.Label><Form.Select required name="sector_economico" value={formData.sector_economico} onChange={handleChange} className="pro-input"><option value="">Seleccione...</option>{sectores.map((s, i) => <option key={i} value={s}>{s}</option>)}</Form.Select></Form.Group></Col>
                            <Col md={6}><Form.Group><Form.Label className="small fw-bold">RANGO SALARIAL *</Form.Label><Form.Select required name="rango_salarial" value={formData.rango_salarial} onChange={handleChange} className="pro-input"><option value="">Seleccione...</option>{rangosSalarios.map((r, i) => <option key={i} value={r}>{r}</option>)}</Form.Select></Form.Group></Col>
                            <Col md={12}><Form.Group><Form.Label className="small fw-bold">¿EJERCE SU PERFIL PROFESIONAL? *</Form.Label><div className="d-flex gap-4"><Form.Check type="radio" label="SÍ" name="ejerce_perfil_profesional" value="SI" checked={formData.ejerce_perfil_profesional === 'SI'} onChange={handleChange} /><Form.Check type="radio" label="NO" name="ejerce_perfil_profesional" value="NO" checked={formData.ejerce_perfil_profesional === 'NO'} onChange={handleChange} /></div></Form.Group></Col>
                          </Row>
                        )}

                        {(formData.laboralmente_activo === 'Soy Independiente' || formData.laboralmente_activo === 'Tengo mi propio Negocio y/o Emprendimiento') && (
                          <Row className="g-4">
                            <Col md={12}><Form.Group><Form.Label className="small fw-bold">NOMBRE DEL NEGOCIO / ACTIVIDAD *</Form.Label><Form.Control required name="nombre_negocio" value={formData.nombre_negocio} onChange={handleChange} className="pro-input" /></Form.Group></Col>
                            <Col md={6}><Form.Group><Form.Label className="small fw-bold">SECTOR ECONÓMICO *</Form.Label><Form.Select required name="sector_economico" value={formData.sector_economico} onChange={handleChange} className="pro-input"><option value="">Seleccione...</option>{sectores.map((s, i) => <option key={i} value={s}>{s}</option>)}</Form.Select></Form.Group></Col>
                            <Col md={6}><Form.Group><Form.Label className="small fw-bold">TIEMPO DE OPERACIÓN</Form.Label><Form.Control name="tiempo_negocio" value={formData.tiempo_negocio} onChange={handleChange} className="pro-input" placeholder="Ej: 2 años" /></Form.Group></Col>
                          </Row>
                        )}

                        <Col md={12} className="mt-4"><Form.Group><Form.Label className="small fw-bold">RECONOCIMIENTOS / LOGROS (Opcional)</Form.Label><Form.Control as="textarea" rows={3} name="reconocimientos" value={formData.reconocimientos} onChange={handleChange} className="pro-input" /></Form.Group></Col>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                        <div className="mb-4 text-institutional"><FaCheckCircle size={64} /></div>
                        <h4 className="fw-bold mb-3">¡Todo listo para actualizar!</h4>
                        <p className="text-muted mb-4">Por favor revisa que toda la información sea correcta antes de enviar.</p>
                        <div className="bg-light-pro p-4 rounded-4 mb-4 text-start small border">
                          <Form.Check required type="checkbox" id="tratamiento_datos" label="Autorizo el tratamiento de mis datos personales según la política de privacidad de la FESC." checked={formData.tratamiento_datos === 'SI'} onChange={(e) => setFormData({ ...formData, tratamiento_datos: e.target.checked ? 'SI' : 'NO' })} className="fw-bold text-serious" />
                        </div>
                      </motion.div>
                    )}

                    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                      {currentStep > 1 && <Button variant="light" onClick={prevStep} className="px-4 fw-bold text-muted small">ATRÁS</Button>}
                      {currentStep < 4 ? (
                        <Button className="btn-institutional px-5 ms-auto" onClick={nextStep}>SIGUIENTE</Button>
                      ) : (
                        <Button type="submit" className="btn-institutional px-5 ms-auto" disabled={loading}>{loading ? 'GUARDANDO...' : 'FINALIZAR Y GUARDAR'}</Button>
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
