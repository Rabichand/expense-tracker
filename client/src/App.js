// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Reports from './components/Reports';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer, toast } from 'react-toastify';
import { isTokenExpired } from './utils/auth';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function AppWrapper() {
  const [expenses, setExpenses] = useState([]);
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();

  // ✅ Check token immediately on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired()) {
      toast.warn('⚠️ Session expired. Please log in again.');
      localStorage.removeItem('token');
      navigate('/login');
    }
    setCheckingToken(false);
  }, [navigate]);

  // ✅ Recheck token every 5 minutes
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (isTokenExpired()) {
        toast.warn('⚠️ Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [navigate]);

  // ✅ Fetch expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Add Expense
  const addExpense = async (newExpense) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      const data = await response.json();
      setExpenses([data, ...expenses]);
      toast.success('✅ Expense added!');
    } catch (err) {
      console.error('Error adding expense:', err);
      toast.error('❌ Failed to add expense');
    }
  };

  // ✅ Delete Expense
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(expenses.filter((exp) => exp.id !== id));
      toast.info('🗑️ Expense deleted');

      // ✅ Refresh report if on /reports
      if (window.location.pathname === '/reports') {
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
      toast.error('❌ Failed to delete expense');
    }
  };

  // ✅ Wait until token is verified before rendering
  if (checkingToken) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ExpenseForm onAdd={addExpense} />
              </PrivateRoute>
            }
          />
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <ExpenseList expenses={expenses} onDelete={deleteExpense} />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

// ✅ Wrap in Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;





