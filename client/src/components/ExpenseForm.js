import React, { useState, useEffect } from 'react';

function ExpenseForm({ onAdd, onUpdate, editingExpense, clearEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setDescription(editingExpense.description);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      title,
      amount,
      category,
      date,
      description,
    };

    if (editingExpense) {
      onUpdate(editingExpense.id, expenseData);
    } else {
      onAdd(expenseData);
    }

    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setDescription('');
    clearEdit(); // reset form after submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
      <input value={date} onChange={(e) => setDate(e.target.value)} type="date" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <button type="submit">{editingExpense ? 'Update' : 'Add'} Expense</button>
    </form>
  );
}

export default ExpenseForm;
