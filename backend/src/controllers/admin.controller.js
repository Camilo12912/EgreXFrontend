const AlumniService = require('../services/alumni.service');
const ProfileHistory = require('../models/ProfileHistory');
const User = require('../models/User');

exports.getMetrics = async (req, res) => {
    try {
        const metrics = await AlumniService.getDashboardMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await AlumniService.getAllAlumniWithProfiles();
        res.json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getGlobalHistory = async (req, res) => {
    try {
        const history = await ProfileHistory.getGlobalHistory();
        res.json(history);
    } catch (error) {
        console.error('Error getting global history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await ProfileHistory.getByUserId(id);
        res.json(history);
    } catch (error) {
        console.error('Error getting user history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const userId = await AlumniService.registerNewAlumni(req.body);
        res.status(201).json({ message: 'Egresado creado exitosamente', userId });
    } catch (error) {
        if (error.code === '23505' || (error.message && error.message.includes('ya están registrados'))) {
            return res.status(400).json({ error: 'La cédula o el email ya están registrados' });
        }
        if (error.message.includes('son obligatorios')) {
            return res.status(400).json({ error: error.message });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getRecentUsers = async (req, res) => {
    try {
        const users = await User.findRecentUsers();
        res.json(users);
    } catch (error) {
        console.error('Error getting recent users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getVerifiedUsers = async (req, res) => {
    try {
        const users = await AlumniService.getVerifiedGraduates();
        res.json(users);
    } catch (error) {
        console.error('Error getting verified users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }

        // Lazy load xlsx to avoid memory usage if not used
        const xlsx = require('xlsx');

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ error: 'El archivo está vacío' });
        }

        const report = await AlumniService.bulkCreate(data);

        res.json({
            message: 'Proceso completado',
            report
        });

    } catch (error) {
        console.error('Error uploading excel:', error);
        res.status(500).json({ error: 'Error procesando el archivo' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await AlumniService.deleteAlumni(id);
        res.json({ message: 'Egresado eliminado exitosamente' });
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ error: 'Se requiere un array de IDs de usuarios' });
        }

        const report = await AlumniService.bulkDeleteAlumni(userIds);
        res.json({
            message: 'Proceso completado',
            report
        });
    } catch (error) {
        console.error('Error bulk deleting users:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
