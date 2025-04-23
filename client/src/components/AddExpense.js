// client/src/components/AddExpense.js

import React, { useState } from 'react';

const AddExpense = ({ onAdd }) => {
  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      const data = await response.json();
      console.log('Expense added:', data);
      onAdd(); // Reload expenses
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <div>
      <h3>Add Expense</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={expense.title}
          onChange={(e) => setExpense({ ...expense, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
        />
        <input
          type="date"
          value={expense.date}
          onChange={(e) => setExpense({ ...expense, date: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
        ></textarea>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
