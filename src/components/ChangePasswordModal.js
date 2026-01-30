import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaLock, FaKey, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

const ChangePasswordModal = ({ show, onHide }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', { newPassword });
            setSuccess('Contraseña actualizada correctamente.');
            setTimeout(() => {
                setLoading(false);
                setNewPassword('');
                setConfirmPassword('');
                setSuccess('');
                onHide(); // Close modal after success
            }, 1500);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.error || 'Error al actualizar la contraseña');
        }
    };

    const handleClose = () => {
        setError('');
        setSuccess('');
        setNewPassword('');
        setConfirmPassword('');
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold h5 d-flex align-items-center gap-2">
                    <FaLock className="text-institutional" />
                    Cambiar Contraseña
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3 pb-4 px-4">
                <p className="text-muted small mb-4">
                    Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
                </p>

                {error && <Alert variant="danger" className="py-2 small border-0">{error}</Alert>}
                {success && <Alert variant="success" className="py-2 small border-0 d-flex align-items-center gap-2"><FaCheckCircle /> {success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">NUEVA CONTRASEÑA</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 text-muted"><FaKey /></span>
                            <Form.Control
                                type="password"
                                required
                                className="border-start-0 ps-0 bg-light"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-muted">CONFIRMAR CONTRASEÑA</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 text-muted"><FaKey /></span>
                            <Form.Control
                                type="password"
                                required
                                className="border-start-0 ps-0 bg-light"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="danger" type="submit" className="text-white fw-bold py-2 btn-institutional" disabled={loading || success}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Actualizar Contraseña'}
                        </Button>
                        <Button variant="link" className="text-muted small text-decoration-none" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal;
