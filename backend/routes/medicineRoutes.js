const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/auth');

// Inventory
router.get('/', verifyToken, medicineController.getAllMedicines);
router.post('/', verifyToken, medicineController.createMedicine);
router.put('/:id', verifyToken, medicineController.updateMedicine);
router.put('/:id/adjust-stock', verifyToken, medicineController.adjustStock);
router.delete('/:id', verifyToken, medicineController.deleteMedicine);

// Orders / Prescriptions
router.get('/orders/list', verifyToken, medicineController.getAllOrders);
router.post('/orders', verifyToken, medicineController.createOrder);
router.put('/orders/:id/advance', verifyToken, medicineController.advanceOrderStatus);
router.put('/orders/:id/cancel', verifyToken, medicineController.cancelOrder);

module.exports = router;
