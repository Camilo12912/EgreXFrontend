import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Spinner, Alert, Row, Col, Card, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaHistory, FaUserPlus, FaFilePdf, FaFileExcel, FaTrash, FaDownload, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api'; // Keep for specific history calls unless migrated too
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useAlumni } from '../presentation/hooks/useAlumni';

const AdminUsers = () => {
    // Use Clean Architecture Hook
    const { users, loading, error, fetchUsers, createUser, uploadAlumniExcel, deleteAlumni, bulkDeleteAlumni } = useAlumni();

    // UI State (Presentation concerns only)
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userHistory, setUserHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusConfig, setStatusConfig] = useState({ type: 'success', title: '', message: '' });
    const [showHistory, setShowHistory] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        identificacion: '',
        email: '',
        nombre: '',
        programa_academico: '',
        sede: 'Sede FESC Cúcuta'
    });
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'single'|'bulk', userId?: number }
    const [deleting, setDeleting] = useState(false);

    // Search Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterField, setFilterField] = useState('all'); // all, email, nombre, identificacion

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // History is not yet migrated to Clean Arch, waiting for next steps or keeping as is for now
    const fetchUserHistory = async (userId) => {
        try {
            setLoadingHistory(true);
            setShowHistory(true);
            const response = await api.getUserHistory(userId);
            setUserHistory(response.data);
            setLoadingHistory(false);
        } catch (err) {
            console.error('Error fetching user history:', err);
            setLoadingHistory(false);
        }
    };

    const handleShowDetails = (user) => {
        setSelectedUser(user);
        setShowModal(true);
        setShowHistory(false);
        setUserHistory([]);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setShowHistory(false);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            setAdding(true);
            setAddError(null);

            // Validar existencia previa (Frontend Check)
            const idExists = users.some(u => u.identificacion === newUser.identificacion);
            if (idExists) {
                setAddError('Esta identificación ya está registrada en el sistema.');
                setAdding(false);
                return;
            }

            const emailExists = users.some(u => u.email === newUser.email);
            if (emailExists) {
                setAddError('Este correo electrónico ya está registrado.');
                setAdding(false);
                return;
            }

            await createUser(newUser);
            setShowAddModal(false);
            setNewUser({ identificacion: '', email: '', nombre: '', programa_academico: '', sede: 'Sede FESC Cúcuta' });
            fetchUsers();
            setAdding(false);
        } catch (err) {
            console.error('Error adding user:', err);
            setAddError(err.response?.data?.error || 'Error al crear el egresado');
            setAdding(false);
        }
    };

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            setUploadResult(null);
            const result = await uploadAlumniExcel(file);
            setUploadResult(result);
            fetchUsers(); // Refresh the list
            setUploading(false);
            // Reset file input
            e.target.value = '';
        } catch (err) {
            console.error('Error uploading Excel:', err);
            setUploadResult({ error: err.response?.data?.error || 'Error al subir el archivo' });
            setUploading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleDeleteClick = (userId) => {
        setDeleteTarget({ type: 'single', userId });
        setShowDeleteModal(true);
    };

    const handleBulkDeleteClick = () => {
        setDeleteTarget({ type: 'bulk' });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setDeleting(true);
            if (deleteTarget.type === 'single') {
                await deleteAlumni(deleteTarget.userId);
            } else {
                await bulkDeleteAlumni(selectedUsers);
                setSelectedUsers([]);
            }
            await fetchUsers();
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleting(false);
        } catch (err) {
            console.error('Error deleting:', err);
            setStatusConfig({
                type: 'error',
                title: 'Error al eliminar',
                message: err.response?.data?.error || 'No se pudo completar la operación. Intente de nuevo.'
            });
            setShowStatusModal(true);
            setDeleting(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Egresados FESC", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

        const tableColumn = ["Nombre", "Email", "Cédula", "Programa", "Situación Laboral", "Empresa", "Cargo"];
        const tableRows = users.map(user => [
            user.nombre || "-",
            user.email,
            user.identificacion || "-",
            user.programa_academico || "-",
            user.laboralmente_activo || "-",
            user.nombre_empresa || user.empresa || "-",
            user.cargo_actual || "-"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [230, 57, 70] }
        });

        doc.save(`reporte_egresados_${new Date().getTime()}.pdf`);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
            "Nombre Completo": user.nombre || "-",
            "Email Institucional": user.email,
            "Cédula": user.identificacion || "-",
            "Programa Académico": user.programa_academico || "-",
            "Sede": user.sede || "-",
            "Título/Profesión": user.profesion || "-",
            "Correo Personal": user.correo_personal || "-",
            "Teléfono/Celular": user.telefono || "-",
            "Ciudad": user.ciudad_residencia || "-",
            "Dirección": user.direccion_domicilio || "-",
            "Barrio": user.barrio || "-",
            "Situación Laboral": user.laboralmente_activo || "-",
            "Ejerce Perfil": user.ejerce_perfil_profesional || "-",
            "Rango Salarial": user.rango_salarial || "-",
            "Empresa": user.nombre_empresa || user.empresa || "-",
            "Cargo": user.cargo_actual || "-",
            "Sector Económico": user.sector_economico || "-",
            "Reconocimientos": user.reconocimientos || "-",
            "Habeas Data": user.tratamiento_datos ? "Aceptado" : "Pendiente",
            "Última Actualización": user.fecha_actualizacion ? new Date(user.fecha_actualizacion).toLocaleDateString() : "Nunca"
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Egresados");
        XLSX.writeFile(workbook, `reporte_egresados_${new Date().getTime()}.xlsx`);
    };

    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();

        if (filterField === 'email') return user.email.toLowerCase().includes(lowerTerm);
        if (filterField === 'nombre') return (user.nombre || '').toLowerCase().includes(lowerTerm);
        if (filterField === 'identificacion') return (user.identificacion || '').toLowerCase().includes(lowerTerm);

        // 'all' case
        return (
            user.email.toLowerCase().includes(lowerTerm) ||
            (user.nombre || '').toLowerCase().includes(lowerTerm) ||
            (user.identificacion || '').toLowerCase().includes(lowerTerm)
        );
    });

    if (loading) {
        return (
            <div className="bg-serious min-vh-100 d-flex align-items-center justify-content-center">
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <div className="bg-serious min-vh-100 py-5">
            <Container>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-institutional fw-bold small text-uppercase tracking-widest mb-2 d-block">Gestión de Perfiles</span>
                        <h1 className="fw-bold display-6 mb-2">Comunidad de Egresados</h1>
                        <p className="text-muted mb-0 small uppercase">Administración centralizada de graduados registrados</p>
                    </motion.div>

                    <div className="d-flex align-items-center gap-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="d-flex align-items-center gap-2"
                        >
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleExcelUpload}
                                style={{ display: 'none' }}
                                id="excel-upload-input"
                            />

                            <OverlayTrigger placement="top" overlay={<Tooltip>Subir Base de Datos (Excel)</Tooltip>}>
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="p-2 shadow-none d-flex align-items-center justify-content-center"
                                    onClick={() => document.getElementById('excel-upload-input').click()}
                                    disabled={uploading}
                                    style={{ width: '38px', height: '38px', borderRadius: '10px' }}
                                >
                                    <FaFileUpload size={18} />
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>Descargar Lista</Tooltip>}>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="outline-secondary"
                                        size="sm"
                                        className="p-2 shadow-none d-flex align-items-center justify-content-center no-caret"
                                        id="dropdown-basic"
                                        style={{ width: '38px', height: '38px', borderRadius: '10px' }}
                                    >
                                        <FaDownload size={18} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end" className="border-0 shadow-sm dropdown-menu-minimal">
                                        <Dropdown.Item onClick={exportToPDF} className="d-flex align-items-center gap-2 py-2">
                                            <FaFilePdf className="text-danger" /> <span>Exportar PDF</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={exportToExcel} className="d-flex align-items-center gap-2 py-2">
                                            <FaFileExcel className="text-success" /> <span>Exportar Excel</span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </OverlayTrigger>

                            {selectedUsers.length > 0 && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar {selectedUsers.length} seleccionados</Tooltip>}>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="p-2 shadow-none d-flex align-items-center justify-content-center"
                                        onClick={handleBulkDeleteClick}
                                        disabled={uploading}
                                        style={{ width: '38px', height: '38px', borderRadius: '10px' }}
                                    >
                                        <FaTrash size={16} />
                                    </Button>
                                </OverlayTrigger>
                            )}
                        </motion.div>

                        <Button className="btn-institutional px-3 shadow-none small fw-bold" onClick={() => setShowAddModal(true)}>
                            <FaUserPlus className="me-2" /> REGISTRAR EGRESADO
                        </Button>
                    </div>
                </div>

                {error && <Alert variant="danger" className="border-0 shadow-sm small text-center">{error}</Alert>}

                {/* Filtros de Búsqueda */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-3">
                        <Row className="g-3 align-items-center">
                            <Col md={3}>
                                <select
                                    className="pro-input w-100 p-2"
                                    value={filterField}
                                    onChange={(e) => setFilterField(e.target.value)}
                                >
                                    <option value="all">Buscar en todos...</option>
                                    <option value="email">Por Email</option>
                                    <option value="nombre">Por Nombre</option>
                                    <option value="identificacion">Por Cédula</option>
                                </select>
                            </Col>
                            <Col md={9}>
                                <input
                                    type="text"
                                    placeholder="Escriba para buscar..."
                                    className="pro-input w-100 p-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <div className="text-muted small mt-2">
                            Mostrando {filteredUsers.length} de {users.length} egresados
                        </div>
                    </Card.Body>
                </Card>

                {
                    uploadResult && (
                        <Alert
                            variant={uploadResult.error ? "danger" : "success"}
                            className="border-0 shadow-sm small"
                            dismissible
                            onClose={() => setUploadResult(null)}
                        >
                            {uploadResult.error ? (
                                uploadResult.error
                            ) : (
                                <>
                                    <strong>Importación completada:</strong> {uploadResult.report.success} exitosos, {uploadResult.report.failed} fallidos.
                                    {uploadResult.report.errors.length > 0 && (
                                        <div className="mt-2 small">
                                            <strong>Errores:</strong>
                                            <ul className="mb-0 mt-1">
                                                {uploadResult.report.errors.slice(0, 5).map((err, idx) => (
                                                    <li key={idx}>{err.user}: {err.error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </Alert>
                    )
                }

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="pro-card border-0 overflow-hidden shadow-none">
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0 align-middle table-borderless">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4 py-3" style={{ width: '50px' }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="py-3 small fw-bold text-secondary uppercase tracking-wider">EMAIL</th>
                                        <th className="py-3 small fw-bold text-secondary uppercase tracking-wider">ROL</th>
                                        <th className="py-3 small fw-bold text-secondary uppercase tracking-wider">NOMBRE</th>
                                        <th className="pe-4 py-3 text-end small fw-bold text-secondary uppercase tracking-wider">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, idx) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 * idx }}
                                        >
                                            <td className="ps-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                />
                                            </td>
                                            <td className="py-3 fw-medium text-serious">{user.email}</td>
                                            <td className="py-3">
                                                <span className={`small fw-bold ${user.role === 'admin' ? 'text-institutional' : 'text-muted opacity-50'}`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3 text-serious">{user.nombre || <span className="text-muted small opacity-50">SIN PERFIL</span>}</td>
                                            <td className="pe-4 py-3 text-end">
                                                <Button
                                                    variant="link"
                                                    className="p-0 text-serious fw-bold text-decoration-none small me-3"
                                                    onClick={() => handleShowDetails(user)}
                                                >
                                                    DETALLES
                                                </Button>
                                                {user.role !== 'admin' && (
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-danger fw-bold text-decoration-none small"
                                                        onClick={() => handleDeleteClick(user.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </motion.div>

                {/* Modal de Detalle */}
                <AnimatePresence>
                    {showModal && selectedUser && (
                        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="minimal-modal">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Modal.Body className="p-4 p-md-5">
                                    <div className="mb-5 text-center">
                                        <div className="bg-light text-institutional p-3 rounded-circle d-inline-flex mb-3">
                                            <FaUsers size={32} />
                                        </div>
                                        <h3 className="fw-bold mb-1">{selectedUser.nombre || 'Nombre no registrado'}</h3>
                                        <p className="text-muted small mb-0">{selectedUser.email}</p>
                                    </div>

                                    {!showHistory ? (
                                        <>
                                            <Row className="g-4">
                                                <Col md={6}>
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <div style={{ width: '3px', height: '14px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                        <h6 className="fw-bold mb-0 small uppercase">Datos de Contacto</h6>
                                                    </div>
                                                    <div className="small text-serious d-grid gap-2 ps-2 border-start ms-1">
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Cédula</span> <span>{selectedUser.identificacion || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Celular</span> <span>{selectedUser.telefono || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Personal</span> <span className="text-lowercase">{selectedUser.correo_personal || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Institucional</span> <span className="text-lowercase">{selectedUser.email || '-'}</span></div>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2 mb-3 mt-4">
                                                        <div style={{ width: '3px', height: '14px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                        <h6 className="fw-bold mb-0 small uppercase">Residencia</h6>
                                                    </div>
                                                    <div className="small text-serious d-grid gap-2 ps-2 border-start ms-1">
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Ciudad</span> <span>{selectedUser.ciudad_residencia || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Dirección</span> <span className="text-end">{selectedUser.direccion_domicilio || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Barrio</span> <span>{selectedUser.barrio || '-'}</span></div>
                                                    </div>
                                                </Col>

                                                <Col md={6}>
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <div style={{ width: '3px', height: '14px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                        <h6 className="fw-bold mb-0 small uppercase">Perfil Académico</h6>
                                                    </div>
                                                    <div className="small text-serious d-grid gap-2 ps-2 border-start ms-1">
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Título</span> <span>{selectedUser.profesion || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Programa</span> <span className="text-end">{selectedUser.programa_academico || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Sede</span> <span>{selectedUser.sede || '-'}</span></div>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2 mb-3 mt-4">
                                                        <div style={{ width: '3px', height: '14px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                        <h6 className="fw-bold mb-0 small uppercase">Situación Laboral</h6>
                                                    </div>
                                                    <div className="small text-serious d-grid gap-2 ps-2 border-start ms-1">
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Estado</span> <span className="fw-bold text-institutional">{selectedUser.laboralmente_activo || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Ejerce Perfil</span> <span>{selectedUser.ejerce_perfil_profesional || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Salario</span> <span>{selectedUser.rango_salarial || '-'}</span></div>
                                                    </div>
                                                </Col>

                                                <Col md={12}>
                                                    <div className="d-flex align-items-center gap-2 mb-3 mt-2">
                                                        <div style={{ width: '3px', height: '14px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                        <h6 className="fw-bold mb-0 small uppercase">Detalle de Empleo</h6>
                                                    </div>
                                                    <div className="small text-serious d-grid gap-2 ps-2 border-start ms-1">
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Empresa</span> <span className="fw-bold">{selectedUser.nombre_empresa || selectedUser.empresa || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Cargo</span> <span>{selectedUser.cargo_actual || '-'}</span></div>
                                                        <div className="d-flex justify-content-between"><span className="text-muted">Sector</span> <span>{selectedUser.sector_economico || '-'}</span></div>
                                                    </div>
                                                </Col>

                                                <Col md={12}>
                                                    <div className="d-flex align-items-center gap-2 mb-3 mt-2">
                                                        <div style={{ width: '3px', height: '14px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                        <h6 className="fw-bold mb-0 small uppercase">Reconocimientos y Otros</h6>
                                                    </div>
                                                    <div className="small text-serious ps-2 border-start ms-1">
                                                        <p className="text-muted mb-1">Méritos / Premios:</p>
                                                        <p className="mb-3">{selectedUser.reconocimientos || 'Sin reconocimientos registrados.'}</p>
                                                        <div className="d-flex justify-content-between border-top pt-2">
                                                            <span className="text-muted italic">Actualizado: {selectedUser.fecha_actualizacion ? new Date(selectedUser.fecha_actualizacion).toLocaleDateString() : 'Pendiente'}</span>
                                                            <span className={`fw-bold ${selectedUser.tratamiento_datos ? 'text-success' : 'text-danger'}`}>
                                                                {selectedUser.tratamiento_datos ? '✓ Datos Autorizados' : '✗ Datos No Autorizados'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className="mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                                                <Button
                                                    variant="link"
                                                    className="text-institutional text-decoration-none fw-bold small d-flex align-items-center gap-2"
                                                    onClick={() => fetchUserHistory(selectedUser.user_id || selectedUser.id)}
                                                >
                                                    <FaHistory size={14} /> VER HISTORIAL DE CAMBIOS
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="text-muted text-decoration-none fw-bold small"
                                                    onClick={handleCloseModal}
                                                >
                                                    CERRAR
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="d-flex align-items-center gap-2 mb-4">
                                                <div style={{ width: '3px', height: '18px', background: 'var(--institutional-red)' }} className="rounded"></div>
                                                <h6 className="fw-bold mb-0">HISTORIAL DE MODIFICACIONES</h6>
                                            </div>

                                            {loadingHistory ? (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="danger" />
                                                </div>
                                            ) : (
                                                <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                                                    <Table hover responsive className="small align-middle">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-muted uppercase fw-bold border-0">Fecha</th>
                                                                <th className="text-muted uppercase fw-bold border-0">Campo</th>
                                                                <th className="text-muted uppercase fw-bold border-0">Anterior</th>
                                                                <th className="text-muted uppercase fw-bold border-0">Nuevo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {userHistory.length > 0 ? userHistory.map((log) => (
                                                                <tr key={log.id}>
                                                                    <td>{new Date(log.created_at).toLocaleString()}</td>
                                                                    <td className="text-institutional">{log.field_name}</td>
                                                                    <td className="text-muted">{log.old_value || '-'}</td>
                                                                    <td className="fw-bold">{log.new_value}</td>
                                                                </tr>
                                                            )) : (
                                                                <tr>
                                                                    <td colSpan="4" className="text-center py-4 text-muted">No hay cambios registrados</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}

                                            <div className="mt-5 pt-4 border-top d-flex justify-content-start">
                                                <Button
                                                    variant="link"
                                                    className="text-muted text-decoration-none fw-bold small"
                                                    onClick={() => setShowHistory(false)}
                                                >
                                                    ← VOLVER A DETALLES
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Modal.Body>
                            </motion.div>
                        </Modal>
                    )}
                </AnimatePresence>

                {/* Modal de Confirmación de Eliminación */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="minimal-modal">
                    <Modal.Body className="p-4 text-center">
                        <div className="mb-4 text-danger">
                            <FaTrash size={48} />
                        </div>
                        <h4 className="fw-bold mb-3">¿Estás seguro?</h4>
                        <p className="text-muted mb-4">
                            {deleteTarget?.type === 'bulk'
                                ? `Se eliminarán ${selectedUsers.length} egresados seleccionados.`
                                : 'Se eliminará este egresado permanentemente.'}
                            <br />Esta acción no se puede deshacer.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="light" className="fw-bold px-4" onClick={() => setShowDeleteModal(false)}>
                                CANCELAR
                            </Button>
                            <Button
                                variant="danger"
                                className="fw-bold px-4 shadow-none"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? <Spinner animation="border" size="sm" /> : 'ELIMINAR'}
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Modal para Agregar Egresado */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="minimal-modal">
                    <Modal.Body className="p-4 p-md-5">
                        <div className="mb-4">
                            <h4 className="fw-bold">Registrar Nuevo Egresado</h4>
                            <p className="text-muted small">Al crearlo, su usuario y contraseña inicial serán su número de cédula.</p>
                            {addError && <Alert variant="danger" className="mt-3 small">{addError}</Alert>}
                        </div>

                        <form onSubmit={handleAddUser}>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted uppercase mb-1">Cédula (Usuario / Pass)</label>
                                <input
                                    type="text"
                                    className="pro-input w-100 p-2"
                                    required
                                    value={newUser.identificacion}
                                    onChange={(e) => setNewUser({ ...newUser, identificacion: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted uppercase mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="pro-input w-100 p-2"
                                    required
                                    value={newUser.nombre}
                                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted uppercase mb-1">Correo Institucional</label>
                                <input
                                    type="email"
                                    className="pro-input w-100 p-2"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted uppercase mb-1">Programa Académico</label>
                                <select
                                    className="pro-input w-100 p-2"
                                    required
                                    value={newUser.programa_academico}
                                    onChange={(e) => setNewUser({ ...newUser, programa_academico: e.target.value })}
                                >
                                    <option value="">Seleccione un programa...</option>
                                    <option value="Ingeniería de Software">Ingeniería de Software</option>
                                    <option value="Diseño Gráfico">Diseño Gráfico</option>
                                    <option value="Diseño de Modas">Diseño de Modas</option>
                                    <option value="Administración de Negocios">Administración de Negocios</option>
                                    <option value="Gestión Turística">Gestión Turística</option>
                                    <option value="Comercio Internacional">Comercio Internacional</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="small fw-bold text-muted uppercase mb-1">Sede</label>
                                <select
                                    className="pro-input w-100 p-2"
                                    required
                                    value={newUser.sede}
                                    onChange={(e) => setNewUser({ ...newUser, sede: e.target.value })}
                                >
                                    <option value="Sede FESC Cúcuta">Sede FESC Cúcuta</option>
                                    <option value="Sede FESC Ocaña">Sede FESC Ocaña</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="link" className="text-muted text-decoration-none fw-bold" onClick={() => setShowAddModal(false)}>
                                    CANCELAR
                                </Button>
                                <Button type="submit" className="btn-institutional px-4" disabled={adding}>
                                    {adding ? <Spinner animation="border" size="sm" /> : 'CONFIRMAR REGISTRO'}
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
                {/* Modal de Estado (Éxito/Error) */}
                <Modal
                    show={showStatusModal}
                    onHide={() => setShowStatusModal(false)}
                    centered
                    className="minimal-modal"
                    size="sm"
                >
                    <Modal.Body className="p-4 text-center">
                        <div className={`mb-3 ${statusConfig.type === 'success' ? 'text-success' : 'text-danger'}`}>
                            {statusConfig.type === 'success' ? <FaCheckCircle size={48} /> : <FaTrash size={48} style={{ transform: 'rotate(180deg)' }} />}
                        </div>
                        <h5 className="fw-bold mb-2">{statusConfig.title}</h5>
                        <p className="text-muted small mb-4">{statusConfig.message}</p>
                        <Button
                            variant={statusConfig.type === 'success' ? 'dark' : 'danger'}
                            className="w-100 fw-bold small py-2"
                            onClick={() => setShowStatusModal(false)}
                        >
                            ENTENDIDO
                        </Button>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminUsers;
