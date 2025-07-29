import React, { useState } from 'react';
import './foreignFundTransfer.css';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function ForeignFundTransfer() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState('');
  const [bank, setBank] = useState('');
  const [branch, setBranch] = useState('');
  const [hovered, setHovered] = useState(false);



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
  if (!transactionData) return;

  const { sender, receiver, transaction } = transactionData;
  const doc = new jsPDF();

 
  doc.setFillColor(25, 118, 210); // Blue
  doc.rect(0, 0, 210, 30, 'F');   
  doc.setTextColor(255, 255, 255); 
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Cardless Foreign Fund Transfer Receipt', 105, 20, { align: 'center' });

  let y = 40;

  const labelStyle = () => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41); // Dark gray for labels
  };

  const valueStyle = () => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(66, 66, 66); // Medium gray for values
  };

  // Sender Info
  labelStyle();
  doc.text('Sender Details', 20, y);
  y += 10;

  labelStyle(); doc.text('Name:', 20, y); 
  valueStyle(); doc.text(sender.name || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Bank:', 20, y);
  valueStyle(); doc.text(sender.bank || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Branch:', 20, y);
  valueStyle(); doc.text(sender.branch || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Account Number:', 20, y);
  valueStyle(); doc.text(sender.accountNumber || '', 100, y);
  y += 15;

  // Receiver Info
  labelStyle();
  doc.text('Receiver Details', 20, y);
  y += 10;

  labelStyle(); doc.text('Name:', 20, y);
  valueStyle(); doc.text(receiver.name || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Bank:', 20, y);
  valueStyle(); doc.text(receiver.bank || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Branch:', 20, y);
  valueStyle(); doc.text(receiver.branch || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Account Number:', 20, y);
  valueStyle(); doc.text(receiver.accountNumber || '', 100, y);
  y += 15;

  // Transaction Info
  labelStyle();
  doc.text('Transaction Details', 20, y);
  y += 10;

  labelStyle(); doc.text('Currency:', 20, y);
  valueStyle(); doc.text(transaction.currency || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Amount Sent:', 20, y);
  valueStyle(); doc.text(`${transaction.currency || ''} ${transaction.amount || ''}`, 100, y);
  y += 10;

  labelStyle(); doc.text('Required LKR Deposit:', 20, y);
  valueStyle(); doc.text(`Rs.${transaction.requiredLKR || ''}`, 100, y);
  y += 10;

  labelStyle(); doc.text('Status:', 20, y);
  valueStyle(); doc.text(transaction.status || '', 100, y);
  y += 10;

  labelStyle(); doc.text('Date:', 20, y);
  valueStyle(); doc.text(new Date(transaction.timestamp).toLocaleString(), 100, y);

  // Save PDF
  doc.save('foreign-fund-transfer-receipt.pdf');
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
          onChange={(e) => setFromAccount(e.target.value)}
          required
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
     <div className="summary">
  <h2>Transaction Summary</h2>

  <div className="summary-section">
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
    <div className="download-button">Download Receipt</div>
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
