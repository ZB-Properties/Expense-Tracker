const pool = require('../model/db');

const getSummaryAnalytics = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions
       WHERE user_id = $1`,
      [userId]
    );

    const { total_income, total_expense } = result.rows[0];

    const income = parseFloat(total_income) || 0;
    const expenses = parseFloat(total_expense) || 0;
    const net_savings = income - expenses;

    res.json({ income, expenses, net_savings });
  } catch (err) {
    console.error('Summary analytics error:', err.message);
    res.status(500).json({ message: 'Failed to get summary analytics' });
  }
};

const getMonthlyAnalytics = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(created_at, 'YYYY-MM') AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM transactions
       WHERE user_id = $1
       GROUP BY month
       ORDER BY month DESC`,
      [userId]
    );

    const formatted = result.rows.map(row => ({
      month: row.month,
      income: parseFloat(row.income) || 0,
      expense: parseFloat(row.expense) || 0,
      net: (parseFloat(row.income) || 0) - (parseFloat(row.expense) || 0)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Monthly analytics error:', err.message);
    res.status(500).json({ message: 'Failed to get monthly analytics' });
  }
};

module.exports = {
  getSummaryAnalytics,
  getMonthlyAnalytics
};
