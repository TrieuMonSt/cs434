const pool = require('../config/db');

// ===== MEDICINE INVENTORY (MEDICINES) =====

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medicines ORDER BY created_at DESC');
    return res.status(200).json({ success: true, medicines: rows });
  } catch (error) {
    console.error('Get all medicines error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new medicine
exports.createMedicine = async (req, res) => {
  try {
    const { id, name, category, unit, stock, minStock, price, expiry, supplier } = req.body;

    if (!name || !category || !unit || stock === undefined || minStock === undefined || price === undefined || !expiry) {
      return res.status(400).json({ success: false, message: 'Required fields: name, category, unit, stock, minStock, price, expiry.' });
    }

    const medId = id || `MED-${Math.floor(100 + Math.random() * 900)}`;

    const [existing] = await pool.query('SELECT id FROM medicines WHERE id = ?', [medId]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Medicine ID already exists.' });
    }

    await pool.query(
      `INSERT INTO medicines (id, name, category, unit, stock, minStock, price, expiry, supplier) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [medId, name, category, unit, parseInt(stock), parseInt(minStock), parseFloat(price), expiry, supplier || null]
    );

    const [newRow] = await pool.query('SELECT * FROM medicines WHERE id = ?', [medId]);

    return res.status(201).json({ success: true, message: 'Medicine created successfully.', medicine: newRow[0] });
  } catch (error) {
    console.error('Create medicine error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, unit, stock, minStock, price, expiry, supplier } = req.body;

    const [existing] = await pool.query('SELECT id FROM medicines WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    await pool.query(
      `UPDATE medicines 
       SET name = ?, category = ?, unit = ?, stock = ?, minStock = ?, price = ?, expiry = ?, supplier = ?
       WHERE id = ?`,
      [name, category, unit, parseInt(stock), parseInt(minStock), parseFloat(price), expiry, supplier || null, id]
    );

    const [newRow] = await pool.query('SELECT * FROM medicines WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: 'Medicine updated successfully.', medicine: newRow[0] });
  } catch (error) {
    console.error('Update medicine error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Adjust stock (Delta import/export)
exports.adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body; // positive to import, negative to export

    if (delta === undefined) {
      return res.status(400).json({ success: false, message: 'Delta is required.' });
    }

    const [existing] = await pool.query('SELECT stock FROM medicines WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    const currentStock = existing[0].stock;
    const newStock = Math.max(0, currentStock + parseInt(delta));

    await pool.query('UPDATE medicines SET stock = ? WHERE id = ?', [newStock, id]);

    return res.status(200).json({ success: true, message: 'Stock adjusted successfully.', stock: newStock });
  } catch (error) {
    console.error('Adjust stock error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM medicines WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    await pool.query('DELETE FROM medicines WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: 'Medicine deleted successfully.' });
  } catch (error) {
    console.error('Delete medicine error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


// ===== MEDICINE ORDERS =====

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medicine_orders ORDER BY created_at DESC');
    const orders = rows.map(o => {
      let itemsList = [];
      try {
        itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
      } catch (e) {
        itemsList = o.items;
      }
      return {
        ...o,
        items: itemsList || []
      };
    });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Create a new order (prescription)
exports.createOrder = async (req, res) => {
  try {
    const { id, patientName, patientId, doctor, date, items } = req.body;

    if (!patientName || !patientId || !doctor || !date || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'patientName, patientId, doctor, date, and items are required.' });
    }

    const orderId = id || `DT-${Math.floor(10000 + Math.random() * 90000)}`;

    const [existing] = await pool.query('SELECT id FROM medicine_orders WHERE id = ?', [orderId]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Order ID already exists.' });
    }

    await pool.query(
      `INSERT INTO medicine_orders (id, patientName, patientId, doctor, date, items, status, statusText) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 'Chờ cấp phát')`,
      [orderId, patientName, patientId, doctor, date, JSON.stringify(items)]
    );

    const [newRow] = await pool.query('SELECT * FROM medicine_orders WHERE id = ?', [orderId]);
    const createdOrder = newRow[0];
    createdOrder.items = items;

    return res.status(201).json({ success: true, message: 'Order created successfully.', order: createdOrder });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Advance status of order
exports.advanceOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT status FROM medicine_orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const currentStatus = existing[0].status;
    const flow = { pending: 'dispensing', dispensing: 'completed' };
    const textMap = { dispensing: 'Đang cấp phát', completed: 'Đã cấp phát' };

    if (!flow[currentStatus]) {
      return res.status(400).json({ success: false, message: 'Cannot advance status from completed or cancelled.' });
    }

    const nextStatus = flow[currentStatus];
    const nextStatusText = textMap[nextStatus];

    await pool.query(
      'UPDATE medicine_orders SET status = ?, statusText = ? WHERE id = ?',
      [nextStatus, nextStatusText, id]
    );

    return res.status(200).json({ success: true, message: `Status advanced to ${nextStatusText}.`, status: nextStatus, statusText: nextStatusText });
  } catch (error) {
    console.error('Advance order status error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT status FROM medicine_orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (existing[0].status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed order.' });
    }

    await pool.query(
      "UPDATE medicine_orders SET status = 'cancelled', statusText = 'Đã hủy' WHERE id = ?",
      [id]
    );

    return res.status(200).json({ success: true, message: 'Order cancelled successfully.' });
  } catch (error) {
    console.error('Cancel order error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
