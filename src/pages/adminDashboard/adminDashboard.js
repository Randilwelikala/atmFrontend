import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

function AdminDashboard() {
  const [atmCash, setAtmCash] = useState({});
  const [denomination, setDenomination] = useState('');
  const [count, setCount] = useState('');
  const API_BASE_URL = 'http://localhost:3001';

  const fetchCash = async () => {
    const res = await fetch(`${API_BASE_URL}/atm-cash`);
    const data = await res.json();
    setAtmCash(data);
  };

  useEffect(() => {
    fetchCash();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/atm-cash/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ denomination, count }),
    });
    const data = await res.json();
    alert(data.message);
    fetchCash();
    setDenomination('');
    setCount('');
  };

  return (
    <div className="dashboard-container">
      <h2>ATM Cash Management</h2>
      <form onSubmit={handleSubmit}>
        <label>Denomination</label>
        <select value={denomination} onChange={(e) => setDenomination(e.target.value)} required>
          <option value="">Select</option>
          <option value="5000">5000</option>
          <option value="2000">2000</option>
          <option value="1000">1000</option>
          <option value="500">500</option>
          <option value="100">100</option>
          <option value="50">50</option>
        </select>
        <label>Count</label>
        <input type="number" value={count} onChange={(e) => setCount(e.target.value)} required />
        <button type="submit">Add Money</button>
      </form>

      <h3>Current ATM Cash</h3>
      <table>
        <thead>
          <tr>
            <th>Denomination</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(atmCash).map(([den, cnt]) => (
            <tr key={den}>
              <td>{den}</td>
              <td>{cnt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
