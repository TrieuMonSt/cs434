const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const verifyToken = require('../middleware/auth');

// Protected appointment CRUD endpoints
router.get('/', verifyToken, appointmentController.getAllAppointments);
router.post('/', verifyToken, appointmentController.createAppointment);
router.put('/:id/toggle', verifyToken, appointmentController.toggleStatus);
router.delete('/:id', verifyToken, appointmentController.deleteAppointment);

module.exports = router;
