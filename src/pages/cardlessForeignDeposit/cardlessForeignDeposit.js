import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import { FaDownload } from 'react-icons/fa';
import './cardlessForeignDeposit.css'

import ReceiptTemplate from '../../components/receiptTemplate/receiptTemplate';
import '../../components/receiptTemplate/receiptTemplate.css';

import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function CardlessForeignDeposit() {
  const location = useLocation();

  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(false);

  const receiptContainerRef = useRef(null);

  const exchangeRates = {
    USD: 350,
    EUR: 370,
    GBP: 430,
  };

  const requiredLKR = foreignAmount && currency
    ? (parseFloat(foreignAmount) * exchangeRates[currency]).toFixed(2)
    : '0.00';

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accountParam = queryParams.get('account');
    if (accountParam) {
      setFromAccount(accountParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTransactionData(null);

    if (!fromAccount || !toAccount || !foreignAmount || !currency) {
      setError('Please fill all fields');
      return;
    }

    const data = {
      sender: {
        name: 'Sender Name',
        bankName: 'Sender Bank',
        branch: 'Sender Branch',
        accountNumber: fromAccount,
      },
      receiver: {
        name: 'Receiver Name',
        bankName: 'Receiver Bank',
        branch: 'Receiver Branch',
        accountNumber: toAccount,
      },
      transaction: {
        currency,
        amount: foreignAmount,
        requiredLKR,
        status: 'Successful',
        timestamp: Date.now(),
      }
    };
    setTransactionData(data);
  };

  const downloadPDF = () => {
    if (!receiptContainerRef.current) return;

    html2pdf().set({
      margin: 0,
      filename: 'foreign-fund-transfer-receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: [150, 225], orientation: 'portrait' },
    }).from(receiptContainerRef.current).save();
  };

  const downloadDOCX = async () => {
    if (!transactionData) return;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Cardless Foreign Fund Transfer Receipt', bold: true, size: 28 })],
            spacing: { after: 300 }
          }),
          new Paragraph({ text: 'Sender Details:', bold: true }),
          new Paragraph(`Name: ${transactionData.sender.name}`),
          new Paragraph(`Bank: ${transactionData.sender.bankName}`),
          new Paragraph(`Branch: ${transactionData.sender.branch}`),
          new Paragraph(`Account Number: ${transactionData.sender.accountNumber}`),
          new Paragraph(''),
          new Paragraph({ text: 'Receiver Details:', bold: true }),
          new Paragraph(`Name: ${transactionData.receiver.name}`),
          new Paragraph(`Bank: ${transactionData.receiver.bankName}`),
          new Paragraph(`Branch: ${transactionData.receiver.branch}`),
          new Paragraph(`Account Number: ${transactionData.receiver.accountNumber}`),
          new Paragraph(''),
          new Paragraph({ text: 'Transaction Details:', bold: true }),
          new Paragraph(`Currency: ${transactionData.transaction.currency}`),
          new Paragraph(`Amount Sent: ${transactionData.transaction.amount}`),
          new Paragraph(`Required LKR Deposit: Rs.${transactionData.transaction.requiredLKR}`),
          new Paragraph(`Status: ${transactionData.transaction.status}`),
          new Paragraph(`Date & Time: ${new Date(transactionData.transaction.timestamp).toLocaleString()}`),
        ]
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
          <p className="required-lkr">
            You must deposit: <strong>Rs. {requiredLKR}</strong>
          </p>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn">Deposit & Transfer</button>
        </form>
      ) : (
        <>
          <div ref={receiptContainerRef}>
            <ReceiptTemplate transactionData={transactionData} />
          </div>

          <div
            className="download-wrapper"
            onClick={() => setHovered(!hovered)}
           
          >
            <div className="download-button"><FaDownload /></div>
            <div className={`download-popup ${hovered ? 'visible' : ''}`}>
              <p onClick={downloadPDF}>Download as PDF</p>
              <p onClick={downloadDOCX}>Download as DOCX</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
