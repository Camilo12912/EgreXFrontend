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
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
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
                            maxWidth: '360px',
                            background: 'var(--card-bg, #ffffff)',
                            borderRadius: '28px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image/Pattern */}
                        <div style={{ height: '80px', background: 'var(--institutional-red)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                                <FaCode size={100} color="white" />
                            </div>
                        </div>

                        {/* Avatar / Icon Overlap */}
                        <div style={{
                            width: '72px',
                            height: '72px',
                            background: 'white',
                            borderRadius: '20px',
                            position: 'absolute',
                            top: '44px',
                            left: '50%',
                            marginLeft: '-36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            zIndex: 2
                        }}>
                            <FaCode size={32} className="text-institutional" />
                        </div>

                        <div style={{ padding: '54px 32px 32px 32px' }}>
                            <div className="text-center mb-4">
                                <h4 className="fw-bold text-serious mb-1">EgreX Engineering</h4>
                                <div className="text-muted small uppercase tracking-widest fw-bold">Desarrollo & Diseño</div>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-5">
                                {/* Camilo */}
                                <div className="d-flex align-items-center gap-3 p-3 rounded-4" style={{ background: 'var(--bg-light-pro)', border: '1px solid var(--border-light)' }}>
                                    <div className="bg-institutional text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                                        <FaLaptopCode size={18} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-serious small mb-0">Camilo Ortega</div>
                                        <div className="text-muted x-small">Core Systems & Frontend</div>
                                        <div className="text-institutional x-small fw-bold mt-1">keinercamilo129@gmail.com</div>
                                    </div>
                                    <FaCheckCircle className="text-success" size={14} />
                                </div>

                                {/* Anggelo */}
                                <div className="d-flex align-items-center gap-3 p-3 rounded-4" style={{ background: 'var(--bg-light-pro)', border: '1px solid var(--border-light)' }}>
                                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                                        <FaFigma size={18} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-serious small mb-0">Anggelo Anteliz</div>
                                        <div className="text-muted x-small">Product Design & UX</div>
                                    </div>
                                    <FaCheckCircle className="text-success" size={14} />
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <div className="small text-muted mb-3 italic">"Construimos puentes entre los graduados y la FESC."</div>
                                <button
                                    className="btn btn-institutional w-100 py-3 rounded-pill fw-bold"
                                    onClick={onHide}
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    CERRAR
                                </button>
                            </div>

                            <div className="text-center x-small text-muted opacity-50 d-flex align-items-center justify-content-center gap-2">
                                <span>Version 1.5</span>
                                <span>•</span>
                                <FaHeart className="text-institutional" />
                                <span>•</span>
                                <span>2026</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default Credits;
