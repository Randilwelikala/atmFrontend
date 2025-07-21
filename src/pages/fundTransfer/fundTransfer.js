import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';
import './fundTransfer.css';
import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';

function FundTransfer() {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('same-bank');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const navigate = useNavigate();

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setReceipt(null);

    if (recipient.length !== 12) {
      setRecipientError('Account number must be exactly 12 digits');
      return;
    } else {
      setRecipientError('');
    }

    const url = transferType === 'same-bank'
      ? 'http://localhost:3001/transfer-same-bank'
      : 'http://localhost:3001/transfer-other-bank';

    try {
      const res = await axios.post(url, {
        from: sender,
        to: recipient,
        amount: parseFloat(amount),
      });
      setReceipt(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleDownloadPDF = () => {
    if (!receipt) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Fund Transfer Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`From: ${receipt.from}`, 20, 40);
    doc.text(`To: ${receipt.to}`, 20, 50);
    doc.text(`Amount: Rs. ${receipt.transferred}`, 20, 60);
    doc.text(`Type: ${receipt.bank}`, 20, 70);
    doc.text(`Remaining Balance: Rs. ${receipt.senderNewBalance}`, 20, 80);
    doc.save(`Transfer_Receipt_${receipt.transactionId || Date.now()}.pdf`);
  };

  const handleDownloadDOCX = () => {
    if (!receipt) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: "Fund Transfer Receipt", heading: "Heading1" }),
          new Paragraph({ text: `From: ${receipt.from}` }),
          new Paragraph({ text: `To: ${receipt.to}` }),
          new Paragraph({ text: `Amount: Rs. ${receipt.transferred}` }),
          new Paragraph({ text: `Type: ${receipt.bank}` }),
          new Paragraph({ text: `Remaining Balance: Rs. ${receipt.senderNewBalance}` }),
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Transfer_Receipt_${receipt.transactionId || Date.now()}.docx`);
    });
  };

  const handleSkip = () => {
    setReceipt(null);
    setError('');
    setSender('');
    setRecipient('');
    setAmount('');
    navigate('/'); // or your desired route
  };

  return (
    <>
    <CardSideNavbar/>
    <div className="fund-transfer-container">
      <h2 className="fund-transfer-title">Fund Transfer</h2>

      <div className="transfer-type-group">
        <label className="transfer-type-label">
          <input
            type="radio"
            name="transferType"
            value="same-bank"
            checked={transferType === 'same-bank'}
            onChange={() => setTransferType('same-bank')}
          />
          <span>Same Bank Transfer</span>
        </label>
        <label className="transfer-type-label">
          <input
            type="radio"
            name="transferType"
            value="other-bank"
            checked={transferType === 'other-bank'}
            onChange={() => setTransferType('other-bank')}
          />
          <span>Other Bank Transfer</span>
        </label>
      </div>

      <form onSubmit={handleTransfer} className="fund-transfer-form">
        <input
          id="sender-account"
          type="text"
          placeholder="Your Account Number"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="fund-transfer-input"
          required
          maxLength={12}
        />
        <input
          id="recipient-account"
          type="text"
          placeholder="Recipient Account Number"
          value={recipient}
          onChange={(e) => {
            const value = e.target.value;
            setRecipient(value);
            if (value.length !== 12) {
              setRecipientError('Account number must be exactly 12 digits');
            } else {
              setRecipientError('');
            }
          }}
          className="fund-transfer-input"
          required
          maxLength={12}
        />
        {recipientError && (
          <p className="error-message">{recipientError}</p>
        )}
        <input
          id="transfer-amount"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="fund-transfer-input"
          required
          min={1}
        />
        <button type="submit" className="fund-transfer-button">
          Transfer
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {receipt && (
        <div className="receipt-box">
          <h3 className="receipt-title">Transfer Receipt</h3>
          <p><strong>From:</strong> {receipt.from}</p>
          <p><strong>To:</strong> {receipt.to}</p>
          <p><strong>Amount:</strong> Rs. {receipt.transferred}</p>
          <p><strong>Type:</strong> {receipt.bank}</p>
          <p><strong>Remaining Balance:</strong> Rs. {receipt.senderNewBalance}</p>

          <div className="receipt-buttons">
            <button onClick={handleDownloadPDF} className="btn pdf-btn">
              Download PDF
            </button>
            <button onClick={handleDownloadDOCX} className="btn docx-btn">
              Download DOCX
            </button>
            <button onClick={handleSkip} className="btn skip-btn">
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default FundTransfer;
