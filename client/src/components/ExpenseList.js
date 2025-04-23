import React from 'react';

function ExpenseList({ expenses, onDelete }) {
  return (
    <div>
      <h3>All Expenses</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            <div><strong>{exp.title}</strong></div>
            ₹{exp.amount} | {exp.category} | {exp.date} <br />
            <em>{exp.description}</em><br />
            <button onClick={() => onDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;




