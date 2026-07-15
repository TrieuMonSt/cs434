const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, serviceController.getAllServices);
router.post('/', verifyToken, serviceController.createService);
router.put('/:id', verifyToken, serviceController.updateService);
router.put('/:id/toggle', verifyToken, serviceController.toggleStatus);
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;
