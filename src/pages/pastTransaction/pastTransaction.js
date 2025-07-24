import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useLocation } from 'react-router-dom';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  // Get the account number from query param
  const queryParams = new URLSearchParams(location.search);
  const accountNumber = queryParams.get('account');

  useEffect(() => {
    if (!accountNumber) return;

    axios.get(`http://localhost:3001/transactions/${accountNumber}`)
      .then(res => {
        setTransactions(res.data); // no need to filter, backend already returns filtered
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
      });
  }, [accountNumber]);

  const downloadAsJPG = () => {
    const element = document.getElementById("transaction-history");
    html2canvas(element).then(canvas => {
      canvas.toBlob(blob => saveAs(blob, "transaction-history.jpg"));
    });
  };

  const downloadAsDOCX = () => {
    const content = `Transactions:\n\n` +
      transactions.map((t, i) =>
        `Transaction ${i + 1}:\nType: ${t.type}\nAmount: Rs.${t.amount}\nStatus: Success\nTime: ${new Date(t.timestamp).toLocaleString()}\nBalance After: Rs.${t.balanceAfter || 'N/A'}\n---`
      ).join("\n\n");

    const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(blob, "transaction-history.docx");
  };

  return (
    <div>
      <h2>Transaction History</h2>
      <div id="transaction-history" style={{ padding: '20px', background: '#fff', border: '1px solid #ccc' }}>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn.id || index}>
                  <td>{index + 1}</td>
                  <td>{txn.type}</td>
                  <td>Rs.{txn.amount}</td>
                  <td>{txn.status || 'Success'}</td>
                  <td>{new Date(txn.timestamp).toLocaleString()}</td>
                  <td>Rs.{txn.balanceAfter || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={downloadAsJPG}>Download as JPG</button>
      <button onClick={downloadAsDOCX}>Download as DOCX</button>
    </div>
  );
};

export default TransactionHistory;
