import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminFullTransaction.css';

const AdminFullTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterBank, setFilterBank] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAccount, setFilterAccount] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios.get('http://localhost:3001/admin/transactions', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTransactions(res.data))
    .catch(console.error);
  }, []);


  const filteredTxns = transactions
  .filter(txn =>
    (!filterBank || (txn.bankName && txn.bankName.toLowerCase().includes(filterBank.toLowerCase()))) &&
    (!filterType || (txn.type && txn.type.toLowerCase().includes(filterType.toLowerCase()))) &&
    (
      !filterAccount || 
      (txn.accountNumber && txn.accountNumber.includes(filterAccount)) || 
      (txn.from && txn.from.includes(filterAccount)) || 
      (txn.to && txn.to.includes(filterAccount))
    )
  )
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="admin-transactions-container">
      <h2>All Transactions</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Bank Name"
          value={filterBank}
          onChange={e => setFilterBank(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Transaction Type"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Account Number"
          value={filterAccount}
          onChange={e => setFilterAccount(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Bank</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Direction</th>
            <th>Account Number</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredTxns.map((txn, idx) => (
            <tr key={txn.id || idx}>
              <td>{idx + 1}</td>
              <td>{txn.bankName}</td>
              <td>{txn.userName}</td>
              <td>{txn.type}</td>
              <td>{txn.displayAmount}</td>
              <td>{txn.direction}</td>
              <td>{txn.accountNumber}</td>
              <td>{txn.from || '-'}</td>
              <td>{txn.to || '-'}</td>
              <td>{txn.status}</td>
              <td>{new Date(txn.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFullTransaction;
