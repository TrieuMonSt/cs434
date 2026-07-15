const pool = require('../config/db');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    return res.status(200).json({ success: true, services: rows });
  } catch (error) {
    console.error('Get all services error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { name, department, price, duration, status, description } = req.body;

    if (!name || !department || price === undefined || duration === undefined) {
      return res.status(400).json({ success: false, message: 'name, department, price, and duration are required.' });
    }

    const id = `SV-${String(Date.now()).slice(-3)}${Math.floor(Math.random() * 10)}`;

    await pool.query(
      'INSERT INTO services (id, name, department, price, duration, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, department, parseFloat(price), parseInt(duration), status || 'active', description || null]
    );

    const [newRow] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);

    return res.status(201).json({ success: true, message: 'Service created successfully.', service: newRow[0] });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, price, duration, status, description } = req.body;

    const [existing] = await pool.query('SELECT id FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await pool.query(
      'UPDATE services SET name = ?, department = ?, price = ?, duration = ?, status = ?, description = ? WHERE id = ?',
      [name, department, parseFloat(price), parseInt(duration), status || 'active', description || null, id]
    );

    const [newRow] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: 'Service updated successfully.', service: newRow[0] });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Toggle status of a service
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT status FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const currentStatus = existing[0].status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    await pool.query('UPDATE services SET status = ? WHERE id = ?', [newStatus, id]);

    return res.status(200).json({ success: true, message: `Status updated to ${newStatus}.`, status: newStatus });
  } catch (error) {
    console.error('Toggle service status error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await pool.query('DELETE FROM services WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
