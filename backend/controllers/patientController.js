const pool = require('../config/db');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
    
    // Parse JSON data for histories
    const patients = rows.map(p => {
      let historyArray = [];
      try {
        historyArray = typeof p.history === 'string' ? JSON.parse(p.history) : p.history;
      } catch (e) {
        historyArray = [p.history];
      }
      return {
        ...p,
        history: historyArray || []
      };
    });

    return res.status(200).json({
      success: true,
      patients
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, gender, age, history, status } = req.body;

    if (!name || !gender || !age || !status) {
      return res.status(400).json({ success: false, message: 'Name, gender, age, and status are required.' });
    }

    const historyList = Array.isArray(history) 
      ? history 
      : (typeof history === 'string' && history.trim() 
          ? history.split(',').map(s => s.trim()) 
          : ['Khám định kỳ']);

    const statusMap = {
      treating: 'Đang điều trị',
      critical: 'Nguy kịch',
      recheck: 'Tái khám',
      discharged: 'Đã xuất viện'
    };

    const statusText = statusMap[status] || 'Khám bệnh';
    const id = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Color schemas matching frontend
    const colorSchemas = {
      treating: { bg: '#e0f2fe', color: '#0369a1' },
      critical: { bg: '#fee2e2', color: '#b91c1c' },
      recheck: { bg: '#f3f4f6', color: '#374151' },
      discharged: { bg: '#f3e8ff', color: '#6b21a8' }
    };
    
    const colors = colorSchemas[status] || { bg: '#f3f4f6', color: '#374151' };

    await pool.query(
      `INSERT INTO patients (id, name, gender, age, avatar, history, status, statusText, avatarBg, avatarColor) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        gender,
        parseInt(age),
        avatar,
        JSON.stringify(historyList),
        status,
        statusText,
        colors.bg,
        colors.color
      ]
    );

    const [newRow] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
    const insertedPatient = newRow[0];
    insertedPatient.history = historyList;

    return res.status(201).json({
      success: true,
      message: 'Patient created successfully.',
      patient: insertedPatient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a patient profile
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM patients WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    await pool.query('DELETE FROM patients WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Patient deleted successfully.'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, age, history, status } = req.body;

    const [existing] = await pool.query('SELECT id FROM patients WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const historyList = Array.isArray(history) 
      ? history 
      : (typeof history === 'string' && history.trim() 
          ? history.split(',').map(s => s.trim()) 
          : ['Khám định kỳ']);

    const statusMap = {
      treating: 'Đang điều trị',
      critical: 'Nguy kịch',
      recheck: 'Tái khám',
      discharged: 'Đã xuất viện'
    };

    const statusText = statusMap[status] || 'Khám bệnh';
    
    const colorSchemas = {
      treating: { bg: '#e0f2fe', color: '#0369a1' },
      critical: { bg: '#fee2e2', color: '#b91c1c' },
      recheck: { bg: '#f3f4f6', color: '#374151' },
      discharged: { bg: '#f3e8ff', color: '#6b21a8' }
    };
    
    const colors = colorSchemas[status] || { bg: '#f3f4f6', color: '#374151' };

    await pool.query(
      `UPDATE patients 
       SET name = ?, gender = ?, age = ?, history = ?, status = ?, statusText = ?, avatarBg = ?, avatarColor = ?
       WHERE id = ?`,
      [
        name,
        gender,
        parseInt(age),
        JSON.stringify(historyList),
        status,
        statusText,
        colors.bg,
        colors.color,
        id
      ]
    );

    const [updatedRow] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
    const updatedPatient = updatedRow[0];
    updatedPatient.history = historyList;

    return res.status(200).json({
      success: true,
      message: 'Patient updated successfully.',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

