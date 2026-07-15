const pool = require('../config/db');

// Get dashboard general statistics
exports.getStats = async (req, res) => {
  try {
    // 1. Total patients
    const [patientCountRows] = await pool.query('SELECT COUNT(*) as total FROM patients');
    const totalPatients = patientCountRows[0].total;

    // 2. Critical cases
    const [criticalCountRows] = await pool.query("SELECT COUNT(*) as total FROM patients WHERE status = 'critical'");
    const criticalCases = criticalCountRows[0].total;

    // 3. Pending appointments (reports)
    const [pendingCountRows] = await pool.query("SELECT COUNT(*) as total FROM appointments WHERE status = 'pending'");
    const pendingReports = pendingCountRows[0].total;

    // 4. Confirmed appointments
    const [confirmedCountRows] = await pool.query("SELECT COUNT(*) as total FROM appointments WHERE status = 'confirmed'");
    const confirmedAppointments = confirmedCountRows[0].total;

    // 5. Active beds (mocked or derived logic)
    const activeBeds = 42; // standard static value or can count patients with status = 'treating' + 'critical'
    const totalBeds = 50;

    return res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        criticalCases,
        pendingReports,
        confirmedAppointments,
        activeBeds,
        totalBeds
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
