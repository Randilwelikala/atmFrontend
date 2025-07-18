import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';

function FundTransfer() {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('same-bank'); // transfer type state
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
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Fund Transfer</h2>

      {/* Transfer type radio buttons */}
      <div className="mb-4 flex justify-center gap-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="transferType"
            value="same-bank"
            checked={transferType === 'same-bank'}
            onChange={() => setTransferType('same-bank')}
          />
          <span>Same Bank Transfer</span>
        </label>
        <label className="flex items-center space-x-2">
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

      <form onSubmit={handleTransfer} className="space-y-4">
        <input
          type="text"
          placeholder="Your Account Number"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="w-full p-2 border rounded"
          required
          maxLength={12}
        />
        <input
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
          className="w-full p-2 border rounded"
          required
          maxLength={12}
        />
        {recipientError && (
          <p className="text-red-500 text-sm mt-1">{recipientError}</p>
        )}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
          min={1}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Transfer
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {receipt && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Transfer Receipt</h3>
          <p>From: {receipt.from}</p>
          <p>To: {receipt.to}</p>
          <p>Amount: Rs. {receipt.transferred}</p>
          <p>Type: {receipt.bank}</p>
          <p>Remaining Balance: Rs. {receipt.senderNewBalance}</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Download PDF
            </button>
            <button
              onClick={handleDownloadDOCX}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Download DOCX
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FundTransfer;
