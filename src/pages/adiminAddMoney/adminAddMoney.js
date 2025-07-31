import React, { useState, useEffect } from 'react';
import './adminAddMoney.css';
import axios from 'axios';

export default function AdminAddMoney() {
  const [atmCash, setAtmCash] = useState({});
  const [denomination, setDenomination] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchCash();
  }, []);

  const fetchCash = async () => {
    const res = await axios.get('http://localhost:5000/api/atm-cash');
    setAtmCash(res.data);
  };

  const handleAddMoney = async () => {
    if (!denomination || !quantity) return;
    try {
      await axios.post('http://localhost:5000/api/add-money', {
        denomination: Number(denomination),
        quantity: Number(quantity),
      });
      fetchCash();
      setDenomination('');
      setQuantity('');
    } catch (err) {
      alert('Error adding money');
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin - Add Money to ATM</h2>
      <div className="form-group">
        <label>Denomination:</label>
        <select
          value={denomination}
          onChange={(e) => setDenomination(e.target.value)}
        >
          <option value="">Select</option>
          <option value="5000">5000</option>
          <option value="2000">2000</option>
          <option value="1000">1000</option>
          <option value="500">500</option>
          <option value="100">100</option>
          <option value="50">50</option>
        </select>
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button onClick={handleAddMoney}>Add Money</button>

      <h3>ATM Cash Status</h3>
      <ul className="cash-status">
        {Object.entries(atmCash).map(([denom, count]) => (
          <li key={denom}>
            Rs {denom} × {count} notes
          </li>
        ))}
      </ul>
    </div>
  );
}
