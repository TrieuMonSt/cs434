const pool = require('../config/db');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments ORDER BY date ASC, stt ASC');
    return res.status(200).json({
      success: true,
      appointments: rows
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { name, date, gender, dob, symptom, status } = req.body;

    if (!name || !date || !gender || !dob) {
      return res.status(400).json({ success: false, message: 'Name, date, gender, and dob are required.' });
    }

    // Determine the next STT for the given date
    const [countRows] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE date = ?', 
      [date]
    );
    const nextSttVal = (countRows[0].count + 1);
    const stt = String(nextSttVal).padStart(2, '0');

    const id = `APP-00${Date.now().toString().slice(-3)}${Math.floor(Math.random() * 10)}`;

    await pool.query(
      `INSERT INTO appointments (id, stt, name, date, gender, dob, symptom, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        stt,
        name,
        date,
        gender,
        dob,
        symptom || 'Khám sức khỏe',
        status || 'pending'
      ]
    );

    const [newRow] = await pool.query('SELECT * FROM appointments WHERE id = ?', [id]);

    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully.',
      appointment: newRow[0]
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Toggle status between pending and confirmed
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT status FROM appointments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const currentStatus = rows[0].status;
    const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';

    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [newStatus, id]);

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${newStatus}.`,
      status: newStatus
    });
  } catch (error) {
    console.error('Toggle appointment status error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT date FROM appointments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const apptDate = rows[0].date;

    // Delete appointment
    await pool.query('DELETE FROM appointments WHERE id = ?', [id]);

    // Re-index STT for appointments on the same date to keep it clean
    const [dateRows] = await pool.query(
      'SELECT id FROM appointments WHERE date = ? ORDER BY created_at ASC', 
      [apptDate]
    );

    for (let i = 0; i < dateRows.length; i++) {
      const nextStt = String(i + 1).padStart(2, '0');
      await pool.query(
        'UPDATE appointments SET stt = ? WHERE id = ?', 
        [nextStt, dateRows[i].id]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully and STTs re-indexed.'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
