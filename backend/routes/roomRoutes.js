const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, roomController.getAllRooms);
router.post('/', verifyToken, roomController.createRoom);
router.put('/:maPhong', verifyToken, roomController.updateRoom);
router.delete('/:maPhong', verifyToken, roomController.deleteRoom);

module.exports = router;
