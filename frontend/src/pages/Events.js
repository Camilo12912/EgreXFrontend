
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner, Table, Dropdown, OverlayTrigger, Tooltip, Offcanvas } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaTrash, FaChevronRight, FaUserCheck, FaUsers, FaFilePdf, FaFileExcel, FaDownload } from 'react-icons/fa';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                días: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                mins: Math.floor((difference / 1000 / 60) % 60),
                segs: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push(
            <span key={interval} className="mx-1">
                <span className="fw-bold h4 text-institutional">{timeLeft[interval]}</span> <span className="small text-muted text-uppercase">{interval}</span>
            </span>
        );
    });

    return (
        <div className="my-3 p-3 bg-light rounded-3 d-inline-block border">
            {timerComponents.length ? timerComponents : <span className="fw-bold text-success">¡Es hoy!</span>}
        </div>
    );
};

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        imageUrl: ''
    });
    const [error, setError] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este evento?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (err) {
                alert('Error eliminando evento');
            }
        }
    };

    const handleShowDetails = (event) => {
        setSelectedEvent(event);
        setShowDetailModal(true);
    };

    const handleRegister = async () => {
        try {
            await api.registerToEvent(selectedEvent.id);
            alert('¡Inscripción exitosa!');
            setShowDetailModal(false);
            fetchEvents();
        } catch (err) {
            console.error('Error registering to event:', err);
            alert('Error al inscribirse');
        }
    };

    const fetchParticipants = async (eventId) => {
        try {
            setLoadingParticipants(true);
            setShowParticipantsModal(true);
            const response = await api.getEventParticipants(eventId);
            setParticipants(response.data);
            setLoadingParticipants(false);
        } catch (err) {
            console.error('Error fetching participants:', err);
            setLoadingParticipants(false);
        }
    };

    const exportToPDF = () => {
        if (!selectedEvent || participants.length === 0) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setTextColor(230, 57, 70); // Institutional Red
        doc.text('Lista de Inscritos', 14, 22);

        doc.setFontSize(14);
        doc.setTextColor(33, 37, 41);
        doc.text(selectedEvent.title, 14, 32);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date(selectedEvent.date).toLocaleDateString()}`, 14, 40);
        doc.text(`Ubicación: ${selectedEvent.location || 'Virtual'}`, 14, 45);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 50);

        // Table
        const tableColumn = ["Nombre", "Email", "Programa", "Fecha Registro"];
        const tableRows = participants.map(p => [
            p.nombre || 'Sin perfil',
            p.email,
            p.programa_academico || '-',
            new Date(p.registered_at).toLocaleString()
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [230, 57, 70] },
            styles: { fontSize: 8 }
        });

        doc.save(`inscritos_${selectedEvent.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    const exportToExcel = () => {
        if (!selectedEvent || participants.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(participants.map(p => ({
            Nombre: p.nombre || 'Sin perfil',
            Email: p.email,
            Programa: p.programa_academico || '-',
            Registro: new Date(p.registered_at).toLocaleString()
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inscritos");
        XLSX.writeFile(workbook, `inscritos_${selectedEvent.title.replace(/\s+/g, '_').toLowerCase()}.xlsx`);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', formData.date);
            data.append('location', formData.location);
            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/events', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(false);
            setFormData({ title: '', description: '', date: '', location: '', imageUrl: '' });
            setImageFile(null);
            setImagePreview(null);
            fetchEvents();
        } catch (err) {
            setError(err.response?.data?.error || 'Error creando evento');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getImageSrc = (event) => {
        if (event.image_data) {
            if (event.image_data.data && Array.isArray(event.image_data.data)) {
                const base64 = btoa(
                    new Uint8Array(event.image_data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                return `data:image/jpeg;base64,${base64}`;
            }
        }
        return event.image_url;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <div className="bg-serious min-vh-100">
            {/* Minimalist Header */}
            <div className="py-5 mb-4">
                <Container>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-institutional fw-bold small text-uppercase tracking-widest mb-2 d-block">Cartelera Social</span>
                            <h1 className="fw-bold display-6 mb-2">Eventos y Actividades</h1>
                            <p className="text-muted mb-0 max-w-lg">Programación exclusiva para la comunidad de egresados.</p>
                        </motion.div>
                        {isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Button className="btn-institutional d-flex align-items-center shadow-none" onClick={() => setShowModal(true)}>
                                    <FaPlus className="me-2" size={12} /> NUEVO EVENTO
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </Container>
            </div>

            <Container className="pb-5">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Row className="g-4">
                        {events.map(event => (
                            <Col md={6} lg={4} key={event.id}>
                                <motion.div variants={itemVariants}>
                                    <Card className="pro-card pro-card-hover h-100 overflow-hidden border-0">
                                        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                            {getImageSrc(event) ? (
                                                <Card.Img variant="top" src={getImageSrc(event)} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-muted opacity-50">
                                                    <FaCalendarAlt size={40} />
                                                </div>
                                            )}
                                            {event.isRegistered && (
                                                <div className="position-absolute top-0 end-0 m-3">
                                                    <Badge bg="success" className="shadow-sm">INSCRITO</Badge>
                                                </div>
                                            )}
                                        </div>
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div style={{ padding: '4px', background: 'rgba(230, 57, 70, 0.1)', borderRadius: '4px' }}>
                                                    <FaCalendarAlt size={12} className="text-institutional" />
                                                </div>
                                                <span className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>
                                                    {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                                                </span>
                                            </div>

                                            <Card.Title className="fw-bold mb-3 h5 line-clamp-2">{event.title}</Card.Title>

                                            <Card.Text className="text-muted flex-grow-1 mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                                            </Card.Text>

                                            <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                                                <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.75rem' }}>
                                                    <FaMapMarkerAlt className="me-2 text-institutional opacity-50" />
                                                    <span className="text-truncate" style={{ maxWidth: '120px' }}>{event.location || 'Virtual'}</span>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    {isAdmin && (
                                                        <>
                                                            <Button variant="link" className="p-0 text-muted" onClick={() => fetchParticipants(event.id)}>
                                                                <FaUsers size={14} title="Ver inscritos" />
                                                            </Button>
                                                            <Button variant="link" className="p-0 text-muted" onClick={() => handleDelete(event.id)}>
                                                                <FaTrash size={12} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button variant="link" className="p-0 text-serious fw-bold d-flex align-items-center text-decoration-none" style={{ fontSize: '0.75rem' }} onClick={() => handleShowDetails(event)}>
                                                        VER MÁS <FaChevronRight className="ms-1" size={10} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>

                {events.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-5"
                    >
                        <div className="display-4 text-muted opacity-10 mb-3"><FaCalendarAlt /></div>
                        <h3 className="text-muted fw-light">No hay eventos disponibles</h3>
                    </motion.div>
                )}

                {/* Modal Detalle Evento */}
                <AnimatePresence>
                    {showDetailModal && selectedEvent && (
                        <Modal
                            show={showDetailModal}
                            onHide={() => setShowDetailModal(false)}
                            centered
                            size="lg"
                            className="minimal-modal"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                                    {getImageSrc(selectedEvent) ? (
                                        <img src={getImageSrc(selectedEvent)} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                            <FaCalendarAlt size={64} className="text-muted opacity-10" />
                                        </div>
                                    )}
                                    <div className="position-absolute top-0 end-0 p-3">
                                        <Button variant="light" className="rounded-circle shadow-sm border-0 p-2" onClick={() => setShowDetailModal(false)}>
                                            <FaPlus style={{ transform: 'rotate(45deg)' }} size={14} />
                                        </Button>
                                    </div>
                                </div>
                                <Modal.Body className="p-4 p-md-5">
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <span className="text-institutional fw-bold small text-uppercase tracking-widest mb-2 d-block">Detalles del Evento</span>
                                                <h2 className="fw-bold mb-3">{selectedEvent.title}</h2>
                                                <Countdown targetDate={selectedEvent.date} />
                                            </div>
                                            {selectedEvent.isRegistered && (
                                                <Badge bg="success" className="px-3 py-2">INSCRITO CORRECTAMENTE</Badge>
                                            )}
                                        </div>

                                        <div className="d-flex flex-wrap gap-4 py-3 border-top border-bottom">
                                            <div className="d-flex align-items-center gap-2">
                                                <FaCalendarAlt className="text-institutional" size={14} />
                                                <span className="text-serious small fw-medium">
                                                    {new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaMapMarkerAlt className="text-institutional" size={14} />
                                                <span className="text-serious small fw-medium">{selectedEvent.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                                        {selectedEvent.description}
                                    </p>

                                    <div className="mt-5 d-grid">
                                        {!isAdmin && (
                                            <>
                                                {new Date(selectedEvent.date) < new Date() && !selectedEvent.isRegistered ? (
                                                    <Button variant="secondary" className="py-3" disabled>
                                                        EVENTO FINALIZADO
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className={`py-3 ${selectedEvent.isRegistered ? 'btn-outline-success' : 'btn-institutional'}`}
                                                        onClick={handleRegister}
                                                        disabled={selectedEvent.isRegistered}
                                                    >
                                                        {selectedEvent.isRegistered ? (
                                                            <><FaUserCheck className="me-2" /> YA ESTÁS INSCRITO</>
                                                        ) : (
                                                            'CONFIRMAR ASISTENCIA'
                                                        )}
                                                    </Button>
                                                )}
                                                <p className="text-center text-muted small mt-3 mb-0">
                                                    {selectedEvent.isRegistered
                                                        ? 'Te esperamos en el evento.'
                                                        : new Date(selectedEvent.date) < new Date()
                                                            ? 'Este evento ya ha pasado.'
                                                            : 'Se enviará un recordatorio a tu correo institucional.'
                                                    }
                                                </p>
                                            </>
                                        )}
                                        {isAdmin && (
                                            <Button variant="outline-dark" className="py-3" onClick={() => fetchParticipants(selectedEvent.id)}>
                                                VER LISTA DE INSCRITOS
                                            </Button>
                                        )}
                                    </div>
                                </Modal.Body>
                            </motion.div>
                        </Modal>
                    )}
                </AnimatePresence>

                {/* Modal Crear Evento */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Body className="p-4 p-md-5">
                        <div className="mb-4 text-center">
                            <h3 className="fw-bold">Nuevo Evento</h3>
                            <p className="text-muted small">Completa los campos para publicar la actividad.</p>
                        </div>
                        {error && <Alert variant="danger" className="border-0 small text-center">{error}</Alert>}
                        <Form onSubmit={handleCreate}>
                            <Row className="g-4">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">TÍTULO</Form.Label>
                                        <Form.Control
                                            required
                                            placeholder="Ej: Cumbre de Liderazgo"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="pro-input"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">FECHA</Form.Label>
                                        <Form.Control
                                            required
                                            type="datetime-local"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="pro-input"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">UBICACIÓN</Form.Label>
                                        <Form.Control
                                            placeholder="Auditorio / Virtual"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="pro-input"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">IMAGEN</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="pro-input"
                                        />
                                        {imagePreview && (
                                            <div className="mt-3 rounded-3 overflow-hidden" style={{ maxHeight: '150px' }}>
                                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">DESCRIPCIÓN</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Detalles sobre el evento..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="pro-input"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-3 mt-5">
                                <Button variant="link" className="text-muted text-decoration-none fw-bold small" onClick={() => setShowModal(false)}>
                                    CANCELAR
                                </Button>
                                <Button className="btn-institutional px-5" type="submit">
                                    PUBLICAR
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Participants List (Offcanvas) */}
                <Offcanvas
                    show={showParticipantsModal}
                    onHide={() => setShowParticipantsModal(false)}
                    placement="end"
                    className="border-0 shadow-lg"
                    style={{ width: 'min(95vw, 500px)' }}
                >
                    <Offcanvas.Header closeButton className="border-bottom px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-light text-institutional p-2 rounded-circle" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaUsers size={20} />
                            </div>
                            <Offcanvas.Title className="fw-bold mb-0">Egresados Inscritos</Offcanvas.Title>
                        </div>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="p-0">
                        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                            <div className="small text-muted fw-bold uppercase">
                                {participants.length} Registrados
                            </div>
                            {participants.length > 0 && (
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="outline-secondary"
                                        size="sm"
                                        className="px-3 shadow-none d-flex align-items-center gap-2 no-caret"
                                        style={{ borderRadius: '8px', fontSize: '13px' }}
                                    >
                                        <FaDownload size={14} /> EXPORTAR
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end" className="border-0 shadow-sm dropdown-menu-minimal">
                                        <Dropdown.Item onClick={exportToPDF} className="d-flex align-items-center gap-2 py-2 small">
                                            <FaFilePdf className="text-danger" /> <span>Exportar PDF</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={exportToExcel} className="d-flex align-items-center gap-2 py-2 small">
                                            <FaFileExcel className="text-success" /> <span>Exportar Excel</span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>

                        <div className="p-0">
                            {loadingParticipants ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="danger" />
                                </div>
                            ) : participants.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {participants.map((p, idx) => (
                                        <motion.div
                                            key={p.id || idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="list-group-item border-0 border-bottom p-4 hover-bg-light"
                                        >
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="fw-bold mb-0 text-serious">{p.nombre || 'Sin perfil registrado'}</h6>
                                                <Badge bg="light" className="text-institutional small border fw-bold">ID: {p.identificacion || '-'}</Badge>
                                            </div>
                                            <div className="small text-muted mb-2">{p.email}</div>
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                <Badge bg="light" className="text-muted border-0 fw-normal small px-2 py-1">
                                                    {p.programa_academico || 'Sin programa'}
                                                </Badge>
                                                <div className="ms-auto small text-muted italic" style={{ fontSize: '11px' }}>
                                                    Inscrito: {new Date(p.registered_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 px-4">
                                    <div className="bg-light text-muted p-4 rounded-circle d-inline-block mb-3">
                                        <FaUsers size={40} opacity={0.3} />
                                    </div>
                                    <h5 className="fw-bold">No hay inscritos aún</h5>
                                    <p className="text-muted small">Tan pronto como los egresados se inscriban, aparecerán en esta lista.</p>
                                </div>
                            )}
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </div>
    );
};

export default Events;
