// server/routes/expenses.js

const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Error fetching expenses' });
  }
});

// POST a new expense
router.post('/', async (req, res) => {
  const { title, amount, category, date, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO expenses (title, amount, category, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, amount, category, date, description]
    );
    res.status(201).json({ message: 'Expense added successfully', expense: result.rows[0] });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Error adding expense' });
  }
});

// UPDATE an expense by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE expenses SET title = $1, amount = $2, category = $3, date = $4, description = $5 WHERE id = $6 RETURNING *',
      [title, amount, category, date, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: 'Error updating expense' });
  }
});

// DELETE all expenses (clear everything)
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses');
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting all expenses:', err);
    res.status(500).json({ error: 'Error deleting all expenses' });
  }
});


module.exports = router;




