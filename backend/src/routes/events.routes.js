const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../utils/multer.utils');

// Public read access (or authenticated? User said "estudiante solo podra verlos", implies auth needed usually, but previously it was public. 
// Let's make it authenticated to be safe, since "el estudiante solo podra verlos" implies non-students (public) might not?)
// Actually, earlier prompt said "Public Events - GET /events - Public access". 
// But now: "el estudiante solo podra verlos". 
// I will keep GET public/open or just authenticated for users.
// To satisfy "el estudiante solo podra verlos", I will REQUIRE authentication for all.
router.get('/', authenticateToken, eventsController.getEvents);

// Admin only
router.post('/', authenticateToken, requireRole('admin'), upload.single('image'), eventsController.createEvent);
router.delete('/:id', authenticateToken, requireRole('admin'), eventsController.deleteEvent);

// Registration & Monitoring
router.post('/:id/register', authenticateToken, eventsController.registerToEvent);
router.get('/:id/participants', authenticateToken, requireRole('admin'), eventsController.getEventParticipants);

module.exports = router;
