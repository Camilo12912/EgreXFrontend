import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white"
            style={{ zIndex: 9999, opacity: 0.95 }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity
                }}
                style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--institutional-red)',
                    marginBottom: '20px'
                }}
            />
            <motion.h5
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-serious fw-bold letter-spacing-2"
            >
                CARGANDO...
            </motion.h5>
        </div>
    );
};

export default Loading;
