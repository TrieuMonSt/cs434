const pool = require('../config/db');

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY maPhong ASC');
    return res.status(200).json({ success: true, rooms: rows });
  } catch (error) {
    console.error('Get all rooms error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { tenPhong, maPhong, sucChua, ngayTao, ghiChu } = req.body;

    if (!tenPhong || !maPhong || !sucChua || !ngayTao) {
      return res.status(400).json({ success: false, message: 'tenPhong, maPhong, sucChua, and ngayTao are required.' });
    }

    const [existing] = await pool.query('SELECT maPhong FROM rooms WHERE maPhong = ?', [maPhong]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Room code already exists.' });
    }

    await pool.query(
      'INSERT INTO rooms (maPhong, tenPhong, ghiChu, sucChua, ngayTao) VALUES (?, ?, ?, ?, ?)',
      [maPhong, tenPhong, ghiChu || null, parseInt(sucChua), ngayTao]
    );

    return res.status(201).json({ success: true, message: 'Room created successfully.' });
  } catch (error) {
    console.error('Create room error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const { maPhong } = req.params;
    const { tenPhong, sucChua, ngayTao, ghiChu } = req.body;

    const [existing] = await pool.query('SELECT maPhong FROM rooms WHERE maPhong = ?', [maPhong]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    await pool.query(
      'UPDATE rooms SET tenPhong = ?, sucChua = ?, ngayTao = ?, ghiChu = ? WHERE maPhong = ?',
      [tenPhong, parseInt(sucChua), ngayTao, ghiChu || null, maPhong]
    );

    return res.status(200).json({ success: true, message: 'Room updated successfully.' });
  } catch (error) {
    console.error('Update room error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const { maPhong } = req.params;

    const [existing] = await pool.query('SELECT maPhong FROM rooms WHERE maPhong = ?', [maPhong]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    await pool.query('DELETE FROM rooms WHERE maPhong = ?', [maPhong]);

    return res.status(200).json({ success: true, message: 'Room deleted successfully.' });
  } catch (error) {
    console.error('Delete room error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
