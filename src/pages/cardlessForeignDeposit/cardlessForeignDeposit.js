import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import { FaDownload } from 'react-icons/fa';
import './cardlessForeignDeposit.css';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import '../../components/foreignDepositReceiptTemplate/foreignDepositReceiptTemplate.css';
import ReceiptTemplate from '../../components/foreignDepositReceiptTemplate/foreignDepositReceiptTemplate';
import { t } from 'i18next';

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

  const requiredLKR =
    foreignAmount && currency
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

    try {
      const res = await fetch('http://localhost:3001/foreign-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header here if your backend requires token auth:
          // 'Authorization': `Bearer ${yourToken}`
        },
        body: JSON.stringify({
          fromAccount,
          toAccount,
          amount: parseFloat(foreignAmount),
          currency,
          branch: 'Sender Branch',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to process transfer');
      }

      const data = await res.json();

      // Format transactionData to match ReceiptTemplate props
      const formattedData = {
        sender: data.sender,
        receiver: data.receiver,
        transaction: {
          currency: data.transaction.currency,
          amount: data.transaction.amount,
          requiredLKR: data.transaction.requiredLKR,
          status: data.transaction.status,
          timestamp: data.transaction.timestamp,
        },
      };

      setTransactionData(formattedData);
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadPDF = () => {
    if (!receiptContainerRef.current) return;

    html2pdf()
      .set({
        margin: 0,
        filename: 'foreign-fund-transfer-receipt.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: [150, 225], orientation: 'portrait' },
      })
      .from(receiptContainerRef.current)
      .save();
  };

  const downloadDOCX = async (transactionData) => {
    if (!transactionData) return;

    const createTitle = (text) =>
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 32, color: '004085' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      });

    const createSectionHeading = (text) =>
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 26, color: '0056b3' })],
        spacing: { after: 150 },
        border: { left: { color: '0056b3', space: 1, value: BorderStyle.SINGLE, size: 6 } },
      });

    const createField = (label, value) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: `${label}:`, bold: true, color: '0d6efd', size: 24 })],
              }),
            ],
            shading: { fill: 'f8f9fa' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: value || '-', color: '212529', size: 24 })],
              }),
            ],
            shading: { fill: 'f8f9fa' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
          }),
        ],
      });

    const createFieldTable = (fields) =>
      new Table({
        rows: fields.map(([label, value]) => createField(label, value)),
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
      });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            createTitle('Foreign Money Deposit'),

            createSectionHeading('Sender Details'),
            createFieldTable([
              ['Name', transactionData.sender.name],
              ['Bank', transactionData.sender.bankName],
              ['Branch', transactionData.sender.branch || '-'],
              ['Account No', transactionData.sender.accountNumber],
            ]),

            new Paragraph({ text: '', spacing: { after: 300 } }),

            createSectionHeading('Receiver Details'),
            createFieldTable([
              ['Name', transactionData.receiver.name],
              ['Bank', transactionData.receiver.bankName],
              ['Branch', transactionData.receiver.branch || '-'],
              ['Account No', transactionData.receiver.accountNumber],
            ]),

            new Paragraph({ text: '', spacing: { after: 300 } }),

            createSectionHeading('Transaction Details'),
            createFieldTable([
              ['Currency', transactionData.transaction.currency],
              ['Amount Sent', transactionData.transaction.amount],
              ['LKR Deposit', `Rs.${transactionData.transaction.requiredLKR}`],
              ['Status', transactionData.transaction.status],
              ['Date & Time', new Date(transactionData.transaction.timestamp).toLocaleString()],
            ]),

            new Paragraph({ text: '', spacing: { after: 300 } }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Transaction Successful!',
                  bold: true,
                  color: '198754',
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
              border: {
                top: { color: '198754', space: 1, size: 6, value: BorderStyle.SINGLE },
              },
              spacing: { before: 300, after: 300 },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'foreign-fund-transfer-receipt.docx');
  };

  return (
    <div className="foreign-transfer-container">
      <h2>{t('Cardless Foreign Money Transfer')}</h2>

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
            placeholder={t('Receiver Account Number')}
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder={t('Foreign Amount')}
            min="0"
            step="0.01"
            value={foreignAmount}
            onChange={(e) => setForeignAmount(e.target.value)}
            required
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
          <p className="required-lkr">
            {t('You must deposit')}: <strong>{t('Rs')}. {requiredLKR}</strong>
          </p>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn">
            {t('Deposit & Transfer')}
          </button>
        </form>
      ) : (
        <>
          <div ref={receiptContainerRef}>
            <ReceiptTemplate transactionData={transactionData} />
          </div>

          <div className="download-wrapper" onClick={() => setHovered(!hovered)}>
            <div className="download-button">
              <FaDownload />
            </div>
            <div className={`download-popup ${hovered ? 'visible' : ''}`}>
              <p onClick={downloadPDF}>{t('Download as PDF')}</p>
              <p onClick={() => downloadDOCX(transactionData)}>{t('Download as DOCX')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
