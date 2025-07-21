import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import './cardlessDepositMoney.css';

function CardlessDeposit() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
  }, [accountNumber]);

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

  const downloadPDF = () => {
    setOpen(false);
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Field', 'Value']],
      body: [
        ['Transaction ID', transactionId],
        ['Transaction Date', transactionDate],
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
          new Paragraph({ text: `Transaction Date: ${transactionDate}` }),
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

  const generateTransactionId = () => `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSkip = () => {
    navigate('/cardlessDashboard');
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
      setTransactionId(generateTransactionId());
      setTransactionDate(new Date().toLocaleString());
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (error) return <p className="deposit-error">{error}</p>;
  if (!user) return <p className="deposit-loading">Loading user details...</p>;

  return (
    <div className="deposit-container" id="deposit-page">
      <SessionTimeout timeoutDuration={50000000} />
      <h2 className="deposit-title">Deposit Money</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Account Type:</strong> {user.accountType}</p>
      <p><strong>Current Balance:</strong> Rs. {user.balance}</p>

      <form onSubmit={handleDeposit} className="deposit-form">
        <label htmlFor="amount" className="deposit-label">Amount to Deposit:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="deposit-input"
          min="0"
          step="0.01"
          required
        />
        <button type="submit" className="deposit-btn">Deposit</button>
      </form>

      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="deposit-receipt-box">
            <h3>🧾 Transaction Receipt</h3>
            <p><strong>Transaction ID:</strong> {transactionId}</p>
            <p><strong>Transaction Date:</strong> {transactionDate}</p>
            <p><strong>Account:</strong> {user.accountNumber}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Deposited Amount:</strong> Rs. {depositedAmount}</p>
            <p><strong>New Balance:</strong> Rs. {user.balance}</p>
            <p className="deposit-success">✅ Deposit successful!</p>

            <div className="deposit-dropdown-wrapper" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="deposit-btn download-btn">
                Download ▼
              </button>
              {open && (
                <div className="deposit-dropdown-menu">
                  <button onClick={downloadPDF} className="deposit-dropdown-btn">
                    Download as PDF
                  </button>
                  <button onClick={downloadDOCX} className="deposit-dropdown-btn">
                    Download as DOCX
                  </button>
                </div>
              )}
              <button onClick={handleSkip} className="deposit-btn skip-btn">Skip</button>
            </div>
          </div>
        ) : (
          <p className="deposit-success">✅ Deposit successful!</p>
        )
      )}

      {error && <p className="deposit-error">{error}</p>}
    </div>
  );
}

export default CardlessDeposit;
