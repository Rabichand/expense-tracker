const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // your DB username
  host: 'localhost',
  database: 'expense_tracker',
  password: 'relex2863', // change this!
  port: 5432,
});

module.exports = pool;


