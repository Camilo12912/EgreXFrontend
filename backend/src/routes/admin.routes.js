const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/metrics', authenticateToken, requireRole('admin'), adminController.getMetrics);
router.get('/users', authenticateToken, requireRole('admin'), adminController.getAllUsers);
router.get('/history', authenticateToken, requireRole('admin'), adminController.getGlobalHistory);
router.get('/users/:id/history', authenticateToken, requireRole('admin'), adminController.getUserHistory);
router.post('/users', authenticateToken, requireRole('admin'), adminController.createUser);
router.post('/upload-excel', authenticateToken, requireRole('admin'), upload.single('file'), adminController.uploadExcel); // New route
router.delete('/users/:id', authenticateToken, requireRole('admin'), adminController.deleteUser);
router.post('/users/bulk-delete', authenticateToken, requireRole('admin'), adminController.bulkDeleteUsers);
router.get('/recent-users', authenticateToken, requireRole('admin'), adminController.getRecentUsers);
router.get('/verified-users', authenticateToken, requireRole('admin'), adminController.getVerifiedUsers);

module.exports = router;
