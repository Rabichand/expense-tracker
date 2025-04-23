import React, { useEffect, useState } from 'react';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = () => {
    fetch('http://localhost:3001/api/reports/monthly')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch report');
        return res.json();
      })
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleClear = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3001/api/expenses', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchReport(); // refresh
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (report.message) return <p>{report.message}</p>;

  return (
    <div>
      <h2>Monthly Report</h2>
      <p><strong>Latest Month:</strong> {new Date(report.latest_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      <p><strong>Total Spent:</strong> ₹{report.latest_spent}</p>
      <p><strong>Previous Month:</strong> {new Date(report.previous_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      <p><strong>Total Spent:</strong> ₹{report.previous_spent}</p>
      <p><strong>You spent {report.trend} this month by ₹{report.difference}</strong></p>

      <button onClick={handleClear}>🗑️ Clear All Expenses</button>
    </div>
  );
};

export default Reports;

