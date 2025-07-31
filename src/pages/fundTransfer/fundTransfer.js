import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import { useNavigate,useLocation  } from 'react-router-dom';
import './fundTransfer.css';
import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';
import { useTranslation } from 'react-i18next';
import { FaDownload } from 'react-icons/fa';
import { TextRun } from "docx";



function FundTransfer() {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('same-bank');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accountNumberFromUrl = query.get('account');

    if (accountNumberFromUrl) {
      setSender(accountNumberFromUrl);
    } else {
      // fallback to localStorage if URL param not present
      const savedAccountNumber = localStorage.getItem('accountNumber') || '';
      setSender(savedAccountNumber);
    }
  }, [location]);


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
      const token = localStorage.getItem('jwtToken'); 
      const res = await axios.post(url, {
        from: sender,
        to: recipient,
        amount: parseFloat(amount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );
      setReceipt(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleDownloadPDF = () => {
  if (!receipt) return;

  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setTextColor(40, 73, 122);
  doc.text("Fund Transfer Receipt", 20, 20);

  doc.setDrawColor(74, 144, 226); 
  doc.setLineWidth(0.5);
  doc.rect(15, 30, 180, 85); 

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const lineSpacing = 10;
  let y = 40;

  const entries = [
    [`Sender Bank:`, receipt.senderBankName],
    [`Recipient Bank:`, receipt.recipientBankName],
    [`From:`, receipt.from],
    [`To:`, receipt.to],
    [`Amount:`, `Rs. ${receipt.transferred}`],
    [`Type:`, receipt.bank],
    [`Remaining Balance:`, `Rs. ${receipt.senderNewBalance}`],
    [`Status:`, `Successfull`],
  ];

  entries.forEach(([label, value]) => {
    doc.setTextColor(40, 40, 40);
    doc.text(`${label}`, 25, y);
    doc.setTextColor(74, 144, 226);
    doc.text(`${value}`, 80, y);
    y += lineSpacing;
  });

  doc.save(`Transfer_Receipt_${receipt.transactionId || Date.now()}.pdf`);
};



const handleDownloadDOCX = () => {
  if (!receipt) return;

  const headingStyle = {
    size: 28,
    bold: true,
    color: "2A2A72",
  };

  const labelStyle = {
    bold: true,
    color: "4A90E2",
  };

  const valueStyle = {
    color: "000000",
  };

  const styledParagraph = (label, value) =>
  new Paragraph({
    children: [
      new TextRun({
        text: label + " ",
        bold: true,
        color: "4A90E2",
      }),
      new TextRun({
        text: value,
        color: "000000",
      }),
    ],
  });


  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "Fund Transfer Receipt",
          heading: "Heading1",
        }),
        new Paragraph({ text: "" }),

        styledParagraph("Sender Bank:", receipt.senderBankName),
        styledParagraph("Recipient Bank:", receipt.recipientBankName),
        styledParagraph("From:", receipt.from),
        styledParagraph("To:", receipt.to),
        styledParagraph("Amount:", `Rs. ${receipt.transferred}`),
        styledParagraph("Type:", receipt.bank),
        styledParagraph("Remaining Balance:", `Rs. ${receipt.senderNewBalance}`),
        styledParagraph("Status:", "Successfull"),
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
    navigate('/'); 
  };

  return (
    <>
    <CardSideNavbar/>
    <div className="fund-transfer-container">
      <h2 className="fund-transfer-title">{t('Fund Transfer')}</h2>

      <div className="transfer-type-group">
        <label className="transfer-type-label">
          <input
            type="radio"
            name="transferType"
            value="same-bank"
            checked={transferType === 'same-bank'}
            onChange={() => setTransferType('same-bank')}
          />
          <span>{t('Same Bank Transfer')}</span>
        </label>
        <label className="transfer-type-label">
          <input
            type="radio"
            name="transferType"
            value="other-bank"
            checked={transferType === 'other-bank'}
            onChange={() => setTransferType('other-bank')}
          />
          <span>{t('Other Bank Transfer')}</span>
        </label>
      </div>

      <form onSubmit={handleTransfer} className="fund-transfer-form">
        <input
          id="sender-account"
          type="text"
          placeholder={t('Your Account Number')}
          value={sender}
          readOnly
          // onChange={(e) => setSender(e.target.value)}
          className="fund-transfer-input"
          required
          maxLength={12}
        />
        <input
          id="recipient-account"
          type="text"
          placeholder={t('Recipient Account Number')}
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
          placeholder={t('Amount')}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="fund-transfer-input"
          required
          min={1}
        />
        <button type="submit" className="fund-transfer-button">
          {t('Transfer')}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {receipt && (
        <div className="receipt-box">
          <h3 className="receipt-title">{t('Transfer Receipt')}</h3>
          <p><strong>{t('Type')}:</strong> {receipt.bank}</p>
          <p><strong>{t('Sender Bank')}:</strong> {receipt.senderBankName}</p>
          <p><strong>{t('Recipient Bank')}:</strong> {receipt.recipientBankName}</p>
          <p><strong>{t('From')}:</strong> {receipt.from}</p>
          <p><strong>{t('To')}:</strong> {receipt.to}</p>
          <p><strong>{t('Amount')}:</strong> {t('Rs')}. {receipt.transferred}</p>
          <p><strong>{t('Type')}:</strong> {receipt.bank}</p>
          <p><strong>{t('Remaining Balance')}:</strong> {t('Rs')}. {receipt.senderNewBalance}</p>
          <p><strong>{t('Status')}:</strong> {t('Successfull')}</p>

         <div className="receipt-buttons">
          <div className="download-dropdown">
            <button className="btn download-btn"><FaDownload />
              
            </button>
            <div className="dropdown-menu">
              <button onClick={handleDownloadPDF}>{t('Download as PDF')}</button>
              <button onClick={handleDownloadDOCX}>{t('Download as DOCX')}</button>
            </div>
          </div>
          <button onClick={handleSkip} className="btn skip-btn">
            {t('Skip')}
          </button>
          </div>

        </div>
      )}
    </div>
    </>
  );
}

export default FundTransfer;