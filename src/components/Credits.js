import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaHeart, FaFigma, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';
import ReactDOM from 'react-dom';

const Credits = ({ show, onHide }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
                onHide();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onHide]);

    const modalContent = (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="credits-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 200000,
                        background: 'rgba(15, 23, 42, 0.9)', // Very Dark Slate
                        backdropFilter: 'blur(8px)',
                        padding: '20px'
                    }}
                    onClick={onHide}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        className="credits-card"
                        style={{
                            width: '100%',
                            maxWidth: '340px',
                            background: '#1E293B', // Slate 800
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#F8FAFC',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <div className="d-flex justify-content-center mb-2">
                                <FaCode size={24} className="text-institutional" />
                            </div>
                            <h6 className="fw-bold mb-1 tracking-wider" style={{ letterSpacing: '0.15em', fontSize: '0.8rem' }}>EGREX ENGINEERING</h6>
                            <div className="text-muted x-small opacity-75">v1.5 • 2026</div>
                        </div>

                        {/* Team */}
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex flex-column gap-3">
                                {/* Camilo */}
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: '36px', height: '36px', background: 'rgba(220, 38, 38, 0.1)', color: '#EF4444' }}>
                                        <FaLaptopCode size={16} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Camilo Ortega</div>
                                        <div className="text-muted x-small">Lead Developer</div>
                                    </div>
                                </div>

                                {/* Anggelo */}
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: '36px', height: '36px', background: 'rgba(255, 255, 255, 0.1)', color: '#F8FAFC' }}>
                                        <FaFigma size={16} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Anggelo Anteliz</div>
                                        <div className="text-muted x-small">Product Designer</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer & Shortcut */}
                        <div style={{ padding: '20px 24px', background: 'rgba(0,0,0,0.2)' }}>
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                                <span className="badge bg-white bg-opacity-10 text-white fw-mono d-flex align-items-center gap-2 px-3 py-2">
                                    <span style={{ fontSize: '0.9rem' }}>⌨️</span>
                                    <span style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>CTRL + ALT + C</span>
                                </span>
                            </div>

                            <button
                                onClick={onHide}
                                className="btn btn-sm w-100 fw-bold text-white py-2"
                                style={{ background: '#EF4444', border: 'none', borderRadius: '12px', fontSize: '0.85rem' }}
                            >
                                CERRAR CRÉDITOS
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default Credits;
