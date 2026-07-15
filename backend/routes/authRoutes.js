const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, upload.single('avatar'), authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);
router.get('/users', verifyToken, authController.getAllUsers);
router.put('/users/:id/role', verifyToken, authController.updateUserRole);

module.exports = router;
