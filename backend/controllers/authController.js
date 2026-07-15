const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user/doctor
exports.register = async (req, res) => {
  try {
    const { 
      username, 
      password, 
      fullName, 
      nationalId, 
      gender, 
      dob, 
      address, 
      specialty, 
      department,
      accountType
    } = req.body;

    if (!username || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Username, password and fullName are required.' });
    }

    // Check if username already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username is already taken.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate fields
    const doctorId = `DOC-${username.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const staffId = `DR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultCertifications = JSON.stringify([
      { title: specialty || 'Bác sĩ chuyên khoa', detail: 'Đang hoạt động', icon: 'fas fa-user-shield', bg: '#ecfdf5', color: '#059669' }
    ]);

    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users (username, password, fullName, nationalId, gender, dob, doctorId, address, specialty, department, staffId, accountType, certifications) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username, 
        hashedPassword, 
        fullName, 
        nationalId || null, 
        gender || 'Nam', 
        dob || null, 
        doctorId, 
        address || null, 
        specialty || null, 
        department || null, 
        staffId, 
        accountType || 'Bác sĩ', 
        defaultCertifications
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Get user
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Sign token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.accountType },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    // Remove password before sending user object
    delete user.password;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get current profile details
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = rows[0];
    delete user.password;

    return res.status(200).json({
      success: true,
      profile: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      fullName, 
      nationalId, 
      gender, 
      dob, 
      address, 
      specialty, 
      department 
    } = req.body;

    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    // Update avatar if a file was uploaded
    let avatarUrl = undefined;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    let query = `
      UPDATE users 
      SET fullName = ?, nationalId = ?, gender = ?, dob = ?, address = ?, specialty = ?, department = ?
    `;
    const params = [fullName, nationalId || null, gender || 'Nam', dob || null, address || null, specialty || null, department || null];

    if (avatarUrl) {
      query += `, avatar = ?`;
      params.push(avatarUrl);
    }

    query += ` WHERE id = ?`;
    params.push(userId);

    await pool.query(query, params);

    // Get updated profile
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const updatedUser = rows[0];
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    // Get user password
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { password } = rows[0];

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get all registered users (for Permission Management)
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, fullName, specialty, department, staffId, accountType, created_at FROM users ORDER BY created_at DESC');
    return res.status(200).json({ success: true, users: rows });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update user role / accountType
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountType } = req.body;

    if (!accountType) {
      return res.status(400).json({ success: false, message: 'accountType is required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await pool.query('UPDATE users SET accountType = ? WHERE id = ?', [accountType, id]);

    return res.status(200).json({ success: true, message: 'User role updated successfully.' });
  } catch (error) {
    console.error('Update user role error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

