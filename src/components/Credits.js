import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaLaptopCode, FaFigma, FaEnvelope, FaJs, FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa';
import ReactDOM from 'react-dom';

const Credits = ({ show, onHide, theme }) => {
    // Fallback if theme prop isn't passed immediately (though Navigation sends it)
    const currentTheme = theme || localStorage.getItem('theme') || 'light';
    const isDark = currentTheme === 'dark';

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
                onHide();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onHide]);

    // Theme Config
    const styles = {
        overlay: {
            background: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
        },
        card: {
            background: isDark
                ? 'linear-gradient(145deg, #1E293B, #0F172A)'
                : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(220, 53, 69, 0.2)', // Institutional Red border in light
            color: isDark ? '#F8FAFC' : '#1e293b',
            shadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                : '0 20px 40px -10px rgba(220, 53, 69, 0.15)'
        },
        iconBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(220, 53, 69, 0.1)',
        iconColor: isDark ? '#F8FAFC' : 'var(--institutional-red)',
        badge: {
            bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            text: isDark ? 'rgba(255,255,255,0.7)' : '#64748b'
        },
        button: {
            bg: 'var(--institutional-red)',
            text: '#ffffff'
        }
    };

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
                        ...styles.overlay
                    }}
                    onClick={onHide}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40, rotateX: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40, rotateX: 10 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="credits-card"
                        style={{
                            width: '100%',
                            maxWidth: '380px',
                            background: styles.card.background,
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: styles.card.shadow,
                            border: `1px solid ${styles.card.borderColor}`,
                            color: styles.card.color,
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Tech Stack Animation */}
                        <div style={{ padding: '30px 24px 10px 24px', textAlign: 'center', position: 'relative' }}>
                            <div className="d-flex justify-content-center gap-3 mb-3 opacity-50">
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}><FaReact size={20} /></motion.div>
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}><FaNodeJs size={20} /></motion.div>
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}><FaDatabase size={20} /></motion.div>
                            </div>

                            <h5 className="fw-bold mb-1 tracking-tight" style={{ letterSpacing: '-0.5px' }}>
                                EGREX <span style={{ color: 'var(--institutional-red)' }}>ENGINEERING</span>
                            </h5>
                            <div className="text-muted x-small fw-bold tracking-widest uppercase opacity-75">
                                High Performance Development
                            </div>
                        </div>

                        {/* Team Section */}
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex flex-column gap-4">
                                {/* Camilo */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="d-flex align-items-center gap-3 p-3 rounded-4 transition-all"
                                    style={{ background: styles.badge.bg, border: '1px solid rgba(0,0,0,0.02)' }}
                                >
                                    <div className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                        style={{ width: '42px', height: '42px', background: styles.iconBg, color: styles.iconColor }}>
                                        <FaLaptopCode size={18} />
                                    </div>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div className="fw-bold d-flex justify-content-between align-items-center">
                                            <span>Camilo Ortega</span>
                                            <span className="badge bg-danger rounded-pill x-small" style={{ fontSize: '0.6rem' }}>DEV</span>
                                        </div>
                                        <div className="text-muted x-small text-truncate mb-1">Lead Software Architect</div>
                                        <div className="d-flex align-items-center gap-1 x-small opacity-75 text-truncate">
                                            <FaEnvelope size={10} />
                                            <a href="mailto:keinercamilo129@gmail.com" className="text-reset text-decoration-none">keinercamilo129@gmail.com</a>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Anggelo */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="d-flex align-items-center gap-3 p-3 rounded-4 transition-all"
                                    style={{ background: styles.badge.bg, border: '1px solid rgba(0,0,0,0.02)' }}
                                >
                                    <div className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                        style={{ width: '42px', height: '42px', background: styles.iconBg, color: styles.iconColor }}>
                                        <FaFigma size={18} />
                                    </div>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div className="fw-bold d-flex justify-content-between align-items-center">
                                            <span>Anggelo Anteliz</span>
                                            <span className="badge bg-dark rounded-pill x-small" style={{ fontSize: '0.6rem' }}>UX</span>
                                        </div>
                                        <div className="text-muted x-small text-truncate mb-1">Product & Experience Design</div>
                                        <div className="d-flex align-items-center gap-1 x-small opacity-75 text-truncate">
                                            <FaEnvelope size={10} />
                                            <a href="mailto:anggelloanteliz0911@gmail.com" className="text-reset text-decoration-none">anggelloanteliz0911@gmail.com</a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Footer & Shortcut */}
                        <div style={{ padding: '24px', background: styles.badge.bg }}>
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                                <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                                    style={{ border: `1px solid ${styles.card.borderColor}`, background: styles.card.background }}>
                                    <span style={{ fontSize: '0.9rem' }}>⌨️</span>
                                    <span className="fw-bold fw-mono x-small tracking-widest" style={{ color: styles.badge.text }}>CTRL + ALT + C</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onHide}
                                className="btn w-100 fw-bold py-3 shadow-sm"
                                style={{
                                    background: 'var(--institutional-red)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                CERRAR CRÉDITOS
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default Credits;
