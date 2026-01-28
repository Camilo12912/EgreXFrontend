import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await api.post('/auth/change-password', { newPassword });
            const user = JSON.parse(localStorage.getItem('user'));
            user.needs_password_change = false;
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cambiar la contraseña');
        }
    };

    return (
        <div className="bg-serious min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center mb-5">
                                <div className="bg-light text-institutional p-3 rounded-circle d-inline-flex mb-4">
                                    <FaShieldAlt size={32} />
                                </div>
                                <h2 className="fw-bold mb-2">Seguridad de Cuenta</h2>
                                <p className="text-muted small">Es necesario actualizar su contraseña de acceso.</p>
                            </div>

                            <Card className="pro-card border-0 shadow-none">
                                <Card.Body className="p-4 p-md-5">
                                    <div className="mb-4">
                                        <Alert variant="light" className="small border-0 bg-serious text-serious p-3 text-center" style={{ borderLeft: '3px solid var(--institutional-red) !important' }}>
                                            Por su protección, establezca una contraseña segura antes de continuar.
                                        </Alert>
                                    </div>

                                    {error && <Alert variant="danger" className="border-0 small text-center mb-4">{error}</Alert>}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold text-secondary">NUEVA CONTRASEÑA</Form.Label>
                                            <Form.Control
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="pro-input"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-5">
                                            <Form.Label className="small fw-bold text-secondary">CONFIRMAR CONTRASEÑA</Form.Label>
                                            <Form.Control
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pro-input"
                                            />
                                        </Form.Group>
                                        <div className="d-grid">
                                            <Button className="btn-institutional py-3 fw-bold" type="submit">
                                                ESTABLECER CONTRASEÑA
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>

                            <p className="text-center mt-4 text-muted small">
                                <FaLock className="me-2 opacity-50" /> Conexión encriptada punto a punto
                            </p>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ChangePassword;
