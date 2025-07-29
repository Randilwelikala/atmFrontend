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
    doc.setFontSize(16);
    doc.text('Cardless Foreign Fund Transfer Receipt', 20, 20);

    doc.setFontSize(12);
    doc.text(`Sender Name: ${sender.name}`, 20, 40);
    doc.text(`Sender Bank: ${sender.bank}`, 20, 50);
    doc.text(`Sender Branch: ${sender.branch}`, 20, 60);
    doc.text(`Sender Account: ${sender.accountNumber}`, 20, 70);

    doc.text(`Receiver Name: ${receiver.name}`, 20, 90);
    doc.text(`Receiver Bank: ${receiver.bank}`, 20, 100);
    doc.text(`Receiver Branch: ${receiver.branch}`, 20, 110);
    doc.text(`Receiver Account: ${receiver.accountNumber}`, 20, 120);

    doc.text(`Currency: ${transaction.currency}`, 20, 140);
    doc.text(`Foreign Amount Sent: ${transaction.currency} ${transaction.amount}`, 20, 150);
    doc.text(`Required LKR Deposit: Rs.${transaction.requiredLKR}`, 20, 160);

    doc.text(`Transaction Status: ${transaction.status}`, 20, 180);
    doc.text(`Date: ${new Date(transaction.timestamp).toLocaleString()}`, 20, 190);

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
        <p><strong>Sender Name:</strong> {transactionData.sender.name}</p>
        <p><strong>Sender Bank:</strong> {transactionData.sender.bankName}</p>
        <p><strong>Sender Branch:</strong> {transactionData.sender.branch}</p>
        <p><strong>Sender Account Number:</strong> {transactionData.sender.accountNumber}</p>

        <p><strong>Receiver Name:</strong> {transactionData.receiver.name}</p>
        <p><strong>Receiver Bank:</strong> {transactionData.receiver.bankName}</p>
        <p><strong>Receiver Branch:</strong> {transactionData.receiver.branch}</p>
        <p><strong>Receiver Account Number:</strong> {transactionData.receiver.accountNumber}</p>

        <p><strong>Currency Sent:</strong> {transactionData.transaction.currency} {transactionData.transaction.amount}</p>
        <p><strong>Required LKR Deposited:</strong> Rs.{transactionData.transaction.requiredLKR}</p>

        <h3 className='success-text'>Transaction Successful!</h3>

        <div
          className="download-wrapper"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button className="download-button">
            Download Receipt
          </button>
          {hovered && (
            <div className="download-popup">
              <p onClick={downloadPDF}>Download as PDF</p>
              <p onClick={downloadDOCX}>Download as DOCX</p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

}
