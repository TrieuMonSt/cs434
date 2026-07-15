const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, username, fullName, email, phone, experience, gender, status, bio, schedule, specialty, doctorId, staffId FROM users WHERE accountType = 'Bác sĩ' OR specialty IS NOT NULL ORDER BY id DESC");
    
    const doctors = rows.map(d => {
      let sched = {};
      try {
        sched = typeof d.schedule === 'string' ? JSON.parse(d.schedule) : d.schedule;
      } catch (e) {
        sched = d.schedule;
      }
      return {
        ...d,
        schedule: sched || { Monday: 'Nghỉ', Tuesday: 'Nghỉ', Wednesday: 'Nghỉ', Thursday: 'Nghỉ', Friday: 'Nghỉ', Saturday: 'Nghỉ', Sunday: 'Nghỉ' }
      };
    });

    return res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error('Get all doctors error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { code, name, specialty, email, phone, experience, gender, status, bio, schedule } = req.body;

    if (!code || !name || !specialty) {
      return res.status(400).json({ success: false, message: 'Code, name, and specialty are required.' });
    }

    // Check if code/doctorId already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE doctorId = ?', [code]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Doctor ID already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const username = `doc_${code.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const staffId = `DR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const [result] = await pool.query(
      `INSERT INTO users (username, password, fullName, email, phone, experience, gender, status, bio, schedule, specialty, doctorId, staffId, accountType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Bác sĩ')`,
      [
        username,
        hashedPassword,
        name,
        email || null,
        phone || null,
        experience || null,
        gender || 'Nam',
        status || 'active',
        bio || null,
        JSON.stringify(schedule || {}),
        specialty,
        code,
        staffId
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully.',
      doctorId: result.insertId
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { code } = req.params;
    const { name, specialty, email, phone, experience, gender, status, bio, schedule } = req.body;

    const [existing] = await pool.query('SELECT id FROM users WHERE doctorId = ?', [code]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    await pool.query(
      `UPDATE users 
       SET fullName = ?, specialty = ?, email = ?, phone = ?, experience = ?, gender = ?, status = ?, bio = ?, schedule = ?
       WHERE doctorId = ?`,
      [
        name,
        specialty,
        email || null,
        phone || null,
        experience || null,
        gender || 'Nam',
        status || 'active',
        bio || null,
        JSON.stringify(schedule || {}),
        code
      ]
    );

    return res.status(200).json({ success: true, message: 'Doctor updated successfully.' });
  } catch (error) {
    console.error('Update doctor error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update schedule only
exports.updateSchedule = async (req, res) => {
  try {
    const { code } = req.params;
    const { schedule } = req.body;

    const [existing] = await pool.query('SELECT id FROM users WHERE doctorId = ?', [code]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    await pool.query('UPDATE users SET schedule = ? WHERE doctorId = ?', [JSON.stringify(schedule), code]);

    return res.status(200).json({ success: true, message: 'Schedule updated successfully.' });
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { code } = req.params;

    const [existing] = await pool.query('SELECT id FROM users WHERE doctorId = ?', [code]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    await pool.query('DELETE FROM users WHERE doctorId = ?', [code]);

    return res.status(200).json({ success: true, message: 'Doctor deleted successfully.' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
