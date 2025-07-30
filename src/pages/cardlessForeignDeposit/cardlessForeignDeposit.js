import React, { useState,useEffect } from 'react';
import './cardlessForeignDeposit.css';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useLocation } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';



export default function CardlessForeignDeposit() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState('');
  const [bank, setBank] = useState('');
  const [branch, setBranch] = useState('');
  const [hovered, setHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const accountParam = queryParams.get('account');
  if (accountParam) {
    setFromAccount(accountParam);
  }
}, [location.search]);




  const exchangeRates = {
    USD: 350,
    EUR: 370,
    GBP: 430,
  };

  const requiredLKR = foreignAmount && currency
    ? (parseFloat(foreignAmount) * exchangeRates[currency]).toFixed(2)
    : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTransactionData(null);

    if (!fromAccount || !toAccount || !foreignAmount || !currency) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/foreign-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccount, toAccount, amount: parseFloat(foreignAmount), currency }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error occurred');
        return;
      }

      setTransactionData(data);
    } catch (err) {
      setError('Server error');
    }
  };

const downloadPDF = () => {
  const element = document.getElementById('html-receipt');
  if (!element) return;

  html2pdf().set({
    margin: 0,
    filename: 'foreign-fund-transfer-receipt.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: [80, 200], orientation: 'portrait' } // 80mm wide
  }).from(element).save();
};


  const downloadDOCX = async () => {
  if (!transactionData) return;

  const { sender, receiver, transaction } = transactionData;

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "Cardless Foreign Fund Transfer Receipt", bold: true, size: 28 }),
          ],
        }),
        new Paragraph({ text: "Sender Details:", heading: "Heading1" }),
        new Paragraph(`Name: ${sender.name}`),
        new Paragraph(`Bank: ${sender.bank}`),
        new Paragraph(`Branch: ${sender.branch}`),
        new Paragraph(`Account Number: ${sender.accountNumber}`),

        new Paragraph({ text: "Receiver Details:", heading: "Heading1" }),
        new Paragraph(`Name: ${receiver.name}`),
        new Paragraph(`Bank: ${receiver.bank}`),
        new Paragraph(`Branch: ${receiver.branch}`),
        new Paragraph(`Account Number: ${receiver.accountNumber}`),

        new Paragraph({ text: "Transaction Details:", heading: "Heading1" }),
        new Paragraph(`Currency: ${transaction.currency}`),
        new Paragraph(`Foreign Amount Sent: ${transaction.currency} ${transaction.amount}`),
        new Paragraph(`Required LKR Deposit: Rs.${transaction.requiredLKR}`),
        new Paragraph(`Status: ${transaction.status}`),
        new Paragraph(`Date: ${new Date(transaction.timestamp).toLocaleString()}`),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'foreign-fund-transfer-receipt.docx');
};


return (
  <div className="foreign-transfer-container">
    <h2>Cardless Foreign Fund Transfer</h2>

    {!transactionData ? (
      <form onSubmit={handleSubmit} className="transfer-form">
        <input
          type="text"
          placeholder="Sender Account Number"
          value={fromAccount}
          readOnly
          className="readonly-input"
        />
        <input
          type="text"
          placeholder="Receiver Account Number"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Foreign Amount"
          min="0"
          step="0.01"
          value={foreignAmount}
          onChange={(e) => setForeignAmount(e.target.value)}
          required
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Object.keys(exchangeRates).map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
        <p className="required-lkr">You must deposit: <strong>Rs. {requiredLKR}</strong></p>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="submit-btn">Deposit & Transfer</button>
      </form>
    ) : (
     <div className="summary" id="html-receipt">
  <h2>Foreign Transfer Summary</h2>

  <div className="summary-section" >
    <h3>Sender Details</h3>
    <div className="summary-grid">
      <p><strong>Name:</strong> {transactionData.sender.name}</p>
      <p><strong>Bank:</strong> {transactionData.sender.bankName}</p>
      <p><strong>Branch:</strong> {transactionData.sender.branch}</p>
      <p><strong>Account No:</strong> {transactionData.sender.accountNumber}</p>
    </div>
  </div>

  <div className="summary-section">
    <h3>Receiver Details</h3>
    <div className="summary-grid">
      <p><strong>Name:</strong> {transactionData.receiver.name}</p>
      <p><strong>Bank:</strong> {transactionData.receiver.bankName}</p>
      <p><strong>Branch:</strong> {transactionData.receiver.branch}</p>
      <p><strong>Account No:</strong> {transactionData.receiver.accountNumber}</p>
    </div>
  </div>

  <div className="summary-section">
    <h3>Transaction Details</h3>
    <div className="summary-grid">
      <p><strong>Currency:</strong> {transactionData.transaction.currency}</p>
      <p><strong>Amount Sent:</strong> {transactionData.transaction.amount}</p>
      <p><strong>LKR Deposit:</strong> Rs.{transactionData.transaction.requiredLKR}</p>
      <p><strong>Status:</strong> {transactionData.transaction.status}</p>
    </div>
    <p style={{ marginTop: '10px' }}><strong>Date:</strong> {new Date(transactionData.transaction.timestamp).toLocaleString()}</p>
  </div>

  <h3 className="success-text">Transaction Successful!</h3>

  <div
    className="download-wrapper"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
    <div className="download-button"><FaDownload /></div>
    <div className={`download-popup ${hovered ? 'visible' : ''}`}>
      <p onClick={downloadPDF}>Download as PDF</p>
      <p onClick={downloadDOCX}>Download as DOCX</p>
    </div>
  </div>


</div>

    )}
  </div>
);

}
