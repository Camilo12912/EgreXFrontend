import { useState, useCallback, useMemo } from 'react';
import AlumniApiRepository from '../../core/infrastructure/alumni/AlumniApiRepository';
import {
    GetAlumniListUseCase,
    CreateAlumniUseCase,
    GetVerifiedAlumniUseCase,
    GetRecentAlumniUseCase,
    GetDashboardMetricsUseCase
} from '../../core/useCases/alumni';

export const useAlumni = () => {
    // Repository instance (In a real DI setup, this would be injected)
    const repository = useMemo(() => new AlumniApiRepository(), []);

    const [users, setUsers] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [metrics, setMetrics] = useState({
        totalAlumni: 0,
        activeUsers: 0,
        recentlyUpdated: 0,
        programStats: [],
        employmentStats: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use Cases
    const getAlumniListUseCase = useMemo(() => new GetAlumniListUseCase(repository), [repository]);
    const createAlumniUseCase = useMemo(() => new CreateAlumniUseCase(repository), [repository]);
    const getVerifiedAlumniUseCase = useMemo(() => new GetVerifiedAlumniUseCase(repository), [repository]);
    const getRecentAlumniUseCase = useMemo(() => new GetRecentAlumniUseCase(repository), [repository]);
    const getDashboardMetricsUseCase = useMemo(() => new GetDashboardMetricsUseCase(repository), [repository]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAlumniListUseCase.execute();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Error fetching users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [getAlumniListUseCase]);

    const fetchMetrics = useCallback(async () => {
        try {
            const data = await getDashboardMetricsUseCase.execute();
            setMetrics(data);
        } catch (err) {
            console.error('Error fetching metrics:', err);
        }
    }, [getDashboardMetricsUseCase]);

    const fetchRecentUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getRecentAlumniUseCase.execute();
            setRecentUsers(data);
        } catch (err) {
            console.error(err);
            // Optionally set error logic for widget
        } finally {
            setLoading(false);
        }
    }, [getRecentAlumniUseCase]);

    const fetchVerifiedUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getVerifiedAlumniUseCase.execute();
            setRecentUsers(data); // Reusing recentUsers state for the dashboard widget
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [getVerifiedAlumniUseCase]);

    const createUser = async (userData) => {
        try {
            return await createAlumniUseCase.execute(userData);
        } catch (err) {
            throw err;
        }
    };

    const uploadAlumniExcel = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await repository.uploadExcel(formData);
        return response;
    };

    const deleteAlumni = async (userId) => {
        const response = await repository.deleteAlumni(userId);
        return response;
    };

    const bulkDeleteAlumni = async (userIds) => {
        const response = await repository.bulkDeleteAlumni(userIds);
        return response;
    };

    return {
        users,
        recentUsers,
        metrics,
        loading,
        error,
        fetchUsers,
        fetchMetrics,
        fetchRecentUsers,
        fetchVerifiedUsers,
        createUser,
        uploadAlumniExcel,
        deleteAlumni,
        bulkDeleteAlumni,
        setRecentUsers
    };
};
