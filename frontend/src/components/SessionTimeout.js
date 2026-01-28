import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds

const SessionTimeout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        navigate('/login', { replace: true });
    }, [navigate]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Only start timer if user is logged in and not on the login page
        const token = localStorage.getItem('token');
        if (token && location.pathname !== '/login') {
            timerRef.current = setTimeout(() => {
                logout();
            }, INACTIVITY_LIMIT);
        }
    }, [logout, location.pathname]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Initial timer start
        resetTimer();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [resetTimer]);

    return children;
};

export default SessionTimeout;
