import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

function Deposit() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState('');


  // Dropdown state and ref
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
  }, [accountNumber]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setOpen(prev => !prev);

  // PDF download
  const downloadPDF = () => {
    setOpen(false);
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Field', 'Value']],
      body: [
        ['Transaction ID', transactionId],
        ['Account Number', user.accountNumber],
        ['Name', user.name],
        ['Branch', user.branch],
        ['Account Type', user.accountType],
        ['Deposited Amount', `Rs. ${depositedAmount}`],
        ['New Balance', `Rs. ${user.balance}`],
      ],
    });
    doc.save('transaction_receipt.pdf');
  };

  // DOCX download
  const downloadDOCX = async () => {
    setOpen(false);
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "🧾 Transaction Receipt", bold: true, size: 28 }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Transaction ID: ${transactionId}` }),
          new Paragraph({ text: `Account Number: ${user.accountNumber}` }),
          new Paragraph({ text: `Name: ${user.name}` }),
          new Paragraph({ text: `Branch: ${user.branch}` }),
          new Paragraph({ text: `Account Type: ${user.accountType}` }),
          new Paragraph({ text: `Deposited Amount: Rs. ${depositedAmount}` }),
          new Paragraph({ text: `New Balance: Rs. ${user.balance}` }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "transaction_receipt.docx");
  };

  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Skip receipt
  const handleSkip = () => {
    navigate('/cardDashboard?account=' + accountNumber);
  };

  const handleDeposit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/deposit', {
        accountNumber,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message || `Deposit successful!`);
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount);
      setAmount('');
      const newTxnId = generateTransactionId();
      setTransactionId(newTxnId);

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading user details...</p>;

  return (
    <div className="container">
      <SessionTimeout timeoutDuration={50000000} />
      <h2 className="title">Deposit Money</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Account Type:</strong> {user.accountType}</p>
      <p><strong>Current Balance:</strong> Rs. {user.balance}</p>

      <form onSubmit={handleDeposit} className="form">
        <label className="label">Amount to Deposit:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn">Deposit</button>
      </form>

      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="receipt-box">
            <h3>🧾 Transaction Receipt</h3>
            <p><strong>Transaction ID:</strong> {transactionId}</p>
            <p><strong>Account:</strong> {user.accountNumber}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Deposited Amount:</strong> Rs. {depositedAmount}</p>
            <p><strong>New Balance:</strong> Rs. {user.balance}</p>
            <p className="success">✅ Deposit successful!</p>

            <div style={{ marginTop: '10px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
                <button onClick={toggleDropdown} className="btn">
                  Download ▼
                </button>
                {open && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: 150,
                  }}>
                    <button onClick={downloadPDF} style={dropdownBtnStyle}>
                      Download as PDF
                    </button>
                    <button onClick={downloadDOCX} style={dropdownBtnStyle}>
                      Download as DOCX
                    </button>
                  </div>
                )}
              </div>

              <button onClick={handleSkip} className="btn" style={{ marginLeft: '10px' }}>Skip</button>
            </div>
          </div>
        ) : (
          <p className="success">✅ Deposit successful!</p>
        )
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

const dropdownBtnStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
};

export default Deposit;
