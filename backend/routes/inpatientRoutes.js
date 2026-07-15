const express = require('express');
const router = express.Router();
const inpatientController = require('../controllers/inpatientController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, inpatientController.getAllInpatients);
router.post('/', verifyToken, inpatientController.createInpatient);
router.put('/:maNoiTru', verifyToken, inpatientController.updateInpatient);
router.delete('/:maNoiTru', verifyToken, inpatientController.deleteInpatient);

module.exports = router;
