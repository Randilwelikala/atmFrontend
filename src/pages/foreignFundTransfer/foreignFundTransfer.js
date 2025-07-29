import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { FaDownload } from 'react-icons/fa';
import './foreignFundTransfer.css';

const conversionRates = {
  USD: 0.0031,
  EUR: 0.0028,
  GBP: 0.0024,
};

export default function ForeignFundTransfer() {
  const [foreignAmount, setForeignAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [submitted, setSubmitted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sample bank details
  const sender = {
    name: 'Ruwan Perera',
    bank: 'Commercial Bank of Ceylon',
    acc: '100293847562',
    branch: 'Kandy'
  };

  const receiver = {
    name: 'Emily Carter',
    bank: 'Bank of America',
    acc: '203948572001',
    branch: 'New York, NY'
  };

  const requiredLKR = (foreignAmount / conversionRates[currency]).toFixed(2);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Cardless Foreign Fund Transfer Receipt', 20, 20);
    doc.text(`Sender: ${sender.name}`, 20, 35);
    doc.text(`Sender Bank: ${sender.bank} - ${sender.branch}`, 20, 45);
    doc.text(`Sender Acc: ${sender.acc}`, 20, 55);

    doc.text(`Receiver: ${receiver.name}`, 20, 70);
    doc.text(`Receiver Bank: ${receiver.bank} - ${receiver.branch}`, 20, 80);
    doc.text(`Receiver Acc: ${receiver.acc}`, 20, 90);

    doc.text(`Currency: ${currency}`, 20, 110);
    doc.text(`Amount Sent: ${currency} ${foreignAmount}`, 20, 120);
    doc.text(`Required LKR Deposit: Rs.${requiredLKR}`, 20, 130);
    doc.text('Status: Transaction Successful', 20, 150);

    doc.save('foreign-transfer-receipt.pdf');
  };

  const downloadDOCX = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun('Cardless Foreign Fund Transfer Receipt').bold().size(32)] }),
          new Paragraph(`Sender: ${sender.name}`),
          new Paragraph(`Sender Bank: ${sender.bank} - ${sender.branch}`),
          new Paragraph(`Sender Acc: ${sender.acc}`),
          new Paragraph(`Receiver: ${receiver.name}`),
          new Paragraph(`Receiver Bank: ${receiver.bank} - ${receiver.branch}`),
          new Paragraph(`Receiver Acc: ${receiver.acc}`),
          new Paragraph(`Currency: ${currency}`),
          new Paragraph(`Amount Sent: ${currency} ${foreignAmount}`),
          new Paragraph(`Required LKR Deposit: Rs.${requiredLKR}`),
          new Paragraph('Status: Transaction Successful'),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'foreign-transfer-receipt.docx');
  };

  const resetForm = () => {
    setForeignAmount('');
    setCurrency('USD');
    setSubmitted(false);
  };

  return (
    <div className="foreign-transfer-container">
      <h2>Cardless Foreign Fund Transfer</h2>

      {!submitted ? (
        <form className="transfer-form" onSubmit={handleSubmit}>
          <input
            type="number"
            value={foreignAmount}
            onChange={(e) => setForeignAmount(e.target.value)}
            placeholder="Enter amount to send (Foreign)"
            required
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {Object.keys(conversionRates).map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <p className="calculation">You need to deposit: <strong>Rs.{requiredLKR}</strong></p>
          <button type="submit" className="submit-btn">Deposit & Transfer</button>
        </form>
      ) : (
        <div className="result-card fade-in">
          <h3>Transaction Summary</h3>
          <p><strong>Sender:</strong> {sender.name}</p>
          <p><strong>Sender Bank:</strong> {sender.bank} ({sender.branch})</p>
          <p><strong>Receiver:</strong> {receiver.name}</p>
          <p><strong>Receiver Bank:</strong> {receiver.bank} ({receiver.branch})</p>
          <p><strong>Amount Sent:</strong> {currency} {foreignAmount}</p>
          <p><strong>LKR Deposited:</strong> Rs.{requiredLKR}</p>
          <p className="success-msg">Transaction Successful!</p>

          <div className="download-wrapper" ref={dropdownRef}>
            <button onClick={() => setOpenDropdown(!openDropdown)} className="download-btn">
              <FaDownload /> Download Receipt
            </button>
            {openDropdown && (
              <div className="dropdown-menu">
                <button onClick={downloadPDF}>PDF</button>
                <button onClick={downloadDOCX}>DOCX</button>
              </div>
            )}
            <button className="skip-btn" onClick={resetForm}>Make Another Transfer</button>
          </div>
        </div>
      )}
    </div>
  );
}
