const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Connect to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'expense_tracker',
  password: 'relex2863', // Replace with your real DB password
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Dummy home route (optional)
app.get('/', (req, res) => {
  res.send('Expense Tracker Backend is Running!');
});

// ------------------------ Expense Routes ------------------------

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [decoded.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { title, amount, category, date, description } = req.body;

    const result = await pool.query(
      'INSERT INTO expenses (title, amount, category, date, description, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, amount, category, date, description, decoded.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding expense:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Edit/Update an expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, description } = req.body;
    const result = await pool.query(
      'UPDATE expenses SET title=$1, amount=$2, category=$3, date=$4, description=$5 WHERE id=$6 RETURNING *',
      [title, amount, category, date, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Monthly report: compare spending between last 2 months
app.get('/api/reports/monthly', async (req, res) => {
  try {
    console.log('📊 Generating monthly report...');
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', date) AS month,
        SUM(amount) AS total_spent
      FROM expenses
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `);
    const rows = result.rows;
    if (rows.length < 2) {
      return res.json({ message: 'Not enough data to compare months.' });
    }
    const [latest, previous] = rows;
    const difference = latest.total_spent - previous.total_spent;
    const trend = difference > 0 ? 'more' : 'less';
    res.json({
      latest_month: latest.month,
      latest_spent: latest.total_spent,
      previous_month: previous.month,
      previous_spent: previous.total_spent,
      difference: Math.abs(difference),
      trend,
    });
  } catch (error) {
    console.error('Error generating report:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ------------------------ Authentication Routes ------------------------

// Secret key for JWT (choose a strong, secret key in production!)
const JWT_SECRET = 'your_jwt_secret_here';

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const user = userResult.rows[0];
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    // Generate token (expires in 1 hour)
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

