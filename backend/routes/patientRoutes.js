const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const verifyToken = require('../middleware/auth');

// Protected patient CRUD endpoints
router.get('/', verifyToken, patientController.getAllPatients);
router.post('/', verifyToken, patientController.createPatient);
router.put('/:id', verifyToken, patientController.updatePatient);
router.delete('/:id', verifyToken, patientController.deletePatient);

module.exports = router;
