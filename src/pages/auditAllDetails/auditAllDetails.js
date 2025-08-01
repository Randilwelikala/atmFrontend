import React, { useState, useEffect } from 'react';
import './auditAllDetails.css';

export default function AuditAllDetails() {
  const [auditList, setAuditList] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetch('http://localhost:3001/audits')
      .then(res => res.json())
      .then(data => setAuditList(data))
      .catch(err => console.error('Error fetching audits:', err));
  }, []);

  const filteredList = auditList
    .filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.id.toLowerCase().includes(search.toLowerCase()))
    .filter(a => 
      filterEmail === '' || a.adminEmails.toLowerCase().includes(filterEmail.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.id.localeCompare(b.id);
      else return b.id.localeCompare(a.id);
    });

  return (
    <div className="dashboard-container">
      <h1>Audit Members</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort by ID ({sortOrder})
        </button>
      </div>

      <table className="audit-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Password</th>
            <th>Admin Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((audit, index) => (
            <tr key={index}>
              <td>{audit.name}</td>
              <td>{audit.id}</td>
              <td>{audit.password}</td>
              <td>{audit.adminEmails}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
