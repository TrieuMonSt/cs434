const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, doctorController.getAllDoctors);
router.post('/', verifyToken, doctorController.createDoctor);
router.put('/:code', verifyToken, doctorController.updateDoctor);
router.put('/:code/schedule', verifyToken, doctorController.updateSchedule);
router.delete('/:code', verifyToken, doctorController.deleteDoctor);

module.exports = router;
