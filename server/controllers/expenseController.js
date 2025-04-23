// controllers/expenseController.js
const pool = require("../db/db");

const getExpenses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).send("Server error");
  }
};

const addExpense = async (req, res) => {
  const { date, amount, category, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO expenses (date, amount, category, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [date, amount, category, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getExpenses,
  addExpense,
};

