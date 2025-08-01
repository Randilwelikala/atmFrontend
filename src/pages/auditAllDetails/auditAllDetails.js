import React, { useState, useEffect } from 'react';
import './auditAllDetails.css';

export default function AuditAllDetails() {
  const [auditList, setAuditList] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Extract unique types for dropdown filter
  const auditTypes = Array.from(new Set(auditList.map(a => a.type))).filter(Boolean);

  useEffect(() => {
    fetch('http://localhost:3001/audits')
      .then(res => res.json())
      .then(data => setAuditList(data))
      .catch(err => console.error('Error fetching audits:', err));
  }, []);

  // Filter by search, type, and date range
  const filteredList = auditList
    .filter(a =>
      a.type?.toLowerCase().includes(search.toLowerCase()) ||
      a.performedBy?.toLowerCase().includes(search.toLowerCase()) ||
      a.id?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(a => filterType === '' || a.type === filterType)
    .filter(a => {
      if (!startDate && !endDate) return true;
      const auditDate = new Date(a.timestamp);
      if (startDate && auditDate < new Date(startDate)) return false;
      if (endDate && auditDate > new Date(endDate + "T23:59:59")) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return new Date(a.timestamp) - new Date(b.timestamp);
      else return new Date(b.timestamp) - new Date(a.timestamp);
    });

  return (
    <div className="dashboard-container">
      <h1>Audit Logs</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by type, performedBy, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search audit logs"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by audit type"
        >
          <option value="">All Types</option>
          {auditTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div className="date-filters">
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />

          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'})
        </button>
      </div>

      <table className="audit-table" aria-label="Audit Logs Table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Performed By</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                No audit logs found.
              </td>
            </tr>
          )}
          {filteredList.map((audit) => (
            <tr key={audit.id}>
              <td>{audit.id}</td>
              <td>{new Date(audit.timestamp).toLocaleString()}</td>
              <td>{audit.type}</td>
              <td>{audit.performedBy || 'N/A'}</td>
              <td>
                <details>
                  <summary style={{ cursor: 'pointer', color: '#2a4d69' }}>View </summary>
                  <pre className="json-details">
                    {JSON.stringify(audit, null, 2)}
                  </pre>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
