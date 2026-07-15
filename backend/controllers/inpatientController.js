const pool = require('../config/db');

// Get all inpatients
exports.getAllInpatients = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inpatients ORDER BY created_at DESC');
    return res.status(200).json({ success: true, inpatients: rows });
  } catch (error) {
    console.error('Get all inpatients error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new inpatient admission
exports.createInpatient = async (req, res) => {
  try {
    const { maNoiTru, maPhong, maBenhNhan, ngayTao, tenBenhNhan, chanDoan, bacSi, tuoi, gioiTinh } = req.body;

    if (!maNoiTru || !maPhong || !maBenhNhan || !ngayTao || !tenBenhNhan || !chanDoan || !bacSi || !tuoi || !gioiTinh) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const [existing] = await pool.query('SELECT maNoiTru FROM inpatients WHERE maNoiTru = ?', [maNoiTru]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Inpatient code already exists.' });
    }

    await pool.query(
      `INSERT INTO inpatients (maNoiTru, maPhong, maBenhNhan, ngayTao, tenBenhNhan, chanDoan, bacSi, tuoi, gioiTinh) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [maNoiTru, maPhong, maBenhNhan, ngayTao, tenBenhNhan, chanDoan, bacSi, parseInt(tuoi), gioiTinh]
    );

    return res.status(201).json({ success: true, message: 'Inpatient created successfully.' });
  } catch (error) {
    console.error('Create inpatient error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update an inpatient record
exports.updateInpatient = async (req, res) => {
  try {
    const { maNoiTru } = req.params;
    const { maPhong, maBenhNhan, ngayTao, tenBenhNhan, chanDoan, bacSi, tuoi, gioiTinh } = req.body;

    const [existing] = await pool.query('SELECT maNoiTru FROM inpatients WHERE maNoiTru = ?', [maNoiTru]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Inpatient record not found.' });
    }

    await pool.query(
      `UPDATE inpatients 
       SET maPhong = ?, maBenhNhan = ?, ngayTao = ?, tenBenhNhan = ?, chanDoan = ?, bacSi = ?, tuoi = ?, gioiTinh = ?
       WHERE maNoiTru = ?`,
      [maPhong, maBenhNhan, ngayTao, tenBenhNhan, chanDoan, bacSi, parseInt(tuoi), gioiTinh, maNoiTru]
    );

    return res.status(200).json({ success: true, message: 'Inpatient updated successfully.' });
  } catch (error) {
    console.error('Update inpatient error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete an inpatient record
exports.deleteInpatient = async (req, res) => {
  try {
    const { maNoiTru } = req.params;

    const [existing] = await pool.query('SELECT maNoiTru FROM inpatients WHERE maNoiTru = ?', [maNoiTru]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Inpatient record not found.' });
    }

    await pool.query('DELETE FROM inpatients WHERE maNoiTru = ?', [maNoiTru]);

    return res.status(200).json({ success: true, message: 'Inpatient record deleted successfully.' });
  } catch (error) {
    console.error('Delete inpatient error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
