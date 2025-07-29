import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './cardlessWithdraw.css';
import SideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { useTranslation } from 'react-i18next';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";
import { FaDownload } from 'react-icons/fa';



function CardlessWithdraw() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [breakdown, setBreakdown] = useState({});
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [selectedDenominations, setSelectedDenominations] = useState([]);
  const denominations = [5000, 1000, 500, 100];

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios
      .get(`http://localhost:3001/user/${accountNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error(err);
        setError('User not found or unauthorized');
      });
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
 
  const downloadAsPDF = () => {
  setOpen(false);
  const doc = new jsPDF();


  doc.setFontSize(18);
  doc.text(`${user?.bankName || 'Bank Name'}`, 14, 20);

 
  autoTable(doc, {
    startY: 30,
    head: [['Field', 'Value']],
    body: [
      ['Withdraw ID', transactionId],
      ['Withdraw Date', transactionDate],
      ['Account Number', user.accountNumber],
      ['Name', user.name],
      ['Branch', user.branch],
      ['Account Type', user.accountType],
      ['Withdrawed Amount', `Rs. ${depositedAmount}`],
      ['New Balance', `Rs. ${user.balance}`],
    ],
    styles: {
      fontSize: 11,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 123, 255],
      textColor: 255,
    },
    margin: { top: 30 },
  });


  if (transactions && transactions.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Name', 'Amount', 'Date']],
      body: transactions.map((txn) => [txn.name, txn.amount, txn.date]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255,
      },
    });
  }


  doc.save('Withdraw_receipt.pdf');
};

   const downloadAsDOCX = async () => {
  setOpen(false);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
        
          new Paragraph({
            children: [
              new TextRun({
                text: user?.bankName || "Bank Name",
                bold: true,
                color: "1F4E79", 
                size: 32,
                font: "Arial",
              }),
            ],
            alignment: "center",
            spacing: { after: 200 },
          }),

        
          new Paragraph({
            children: [
              new TextRun({
                text: `Branch: ${user?.branch}`,
                size: 24,
                color: "666666",
              }),
            ],
            alignment: "center",
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Account Number: ${user?.accountNumber}`,
                size: 24,
                color: "666666",
              }),
            ],
            alignment: "center",
            spacing: { after: 300 },
          }),

        
          new Paragraph({
            children: [
              new TextRun({
                text: "Withdraw Receipt",
                bold: true,
                size: 28,
                color: "FFFFFF",
              }),
            ],
            alignment: "center",
            shading: {
              type: "clear",
              color: "auto",
              fill: "1F4E79", 
            },
            spacing: { after: 300 },
          }),

          
          new Table({
            rows: [
              ["Withdraw ID", transactionId],
              ["Withdraw Date", transactionDate],
              ["Name", user?.name],
              ["Account Type", user?.accountType],
              ["Withdrawed Amount", `Rs. ${depositedAmount}`],
              ["New Balance", `Rs. ${user?.balance}`],
            ].map(([label, value]) => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: label, bold: true })],
                    shading: { fill: "D9E1F2" }, 
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: value })],
                  }),
                ],
              })
            ),
            width: {
              size: 100,
              type: "pct",
            },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Withdraw_receipt.docx");
};

  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleSkip = () => {
    navigate('/cardlessDashboard');
  };

  const handleDenominationChange = (denomination) => {
    setSelectedDenominations(prev =>
      prev.includes(denomination)
        ? prev.filter(d => d !== denomination)
        : [...prev, denomination]
    );
  };

  const handleWithdraw = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedDenominations.length) {
      setError('Please select at least one denomination.');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await axios.post(
        'http://localhost:3001/withdraw',
        {
          accountNumber,
          amount: parseFloat(amount),
          denominations: selectedDenominations,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || `Withdraw successful!`);
      setBreakdown(res.data.breakdown || {});
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount);
      setAmount('');
      setSelectedDenominations([]); 
      const newTxnId = generateTransactionId();
      setTransactionId(newTxnId);
      const now = new Date();
      setTransactionDate(now.toLocaleString());
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>{t('Loading user details...')}</p>;

  return (
    <>
      <SideNavbar />
      <div className="withdraw-container" id="withdraw-page">
        <SessionTimeout timeoutDuration={50000000} />
        <h2 className="withdraw-title">{t('Withdraw Money')}</h2>

        <div className="withdraw-user-details">
          <p><strong>{t('Name')}:</strong> {user.name}</p>
          <p><strong>{t('Account Number')}:</strong> {user.accountNumber}</p>
          <p><strong>{t('Branch')}:</strong> {user.branch}</p>
          <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
          <p><strong>{t('New Balance')}:</strong> Rs. {user.balance}</p>
          {Object.keys(breakdown).length > 0 && (
            <>
              <h4>{t('Dispensed Cash Breakdown')}:</h4>
              <ul>
                {Object.entries(breakdown).map(([note, count]) => (
                  <li key={note}><strong>{t('Rs')}. {note} * </strong> {count}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <form onSubmit={handleWithdraw} className="withdraw-form">
          <label className="withdraw-label">{t('Amount to Withdraw')}:</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="withdraw-input"
          />

          <div className="withdraw-denominations">
            <label className="withdraw-label">{t('Select Denominations')}:</label>
            <div className="denomination-options">
              {denominations.map(denom => (
                <label key={denom} style={{ marginRight: '10px' }}>
                  <input
                    type="checkbox"
                    value={denom}
                    checked={selectedDenominations.includes(denom)}
                    onChange={() => handleDenominationChange(denom)}
                  />{' '}
                  Rs. {denom}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="withdraw-btn">{t('Withdraw')}</button>
        </form>

        {message && (
          localStorage.getItem('wantsReceipt') === 'yes' ? (
            <div className="withdraw-receipt">
              <h3 className="receipt-header">{user.bankName}</h3>
              <h4 className="receipt-subheader">Branch: {user.branch}</h4>

              <div className="receipt-content">
                <div><strong>Withdraw ID:</strong> {transactionId}</div>
                <div><strong>Withdraw Date:</strong> {transactionDate}</div>
                <div><strong>Account Number:</strong> {user.accountNumber}</div>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Account Type:</strong> {user.accountType}</div>
                <div><strong>Withdrawed Amount:</strong> Rs. {depositedAmount}</div>
                <div><strong>New Balance:</strong> Rs. {user.balance}</div>
              </div>

              <div className="withdraw-download-group" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="withdraw-btn"><FaDownload /></button>
                {open && (
                  <div className="withdraw-dropdown">
                    <button onClick={downloadAsPDF} className="withdraw-dropdown-btn">{t('Download as PDF')}</button>
                    <button onClick={downloadAsDOCX} className="withdraw-dropdown-btn">{t('Download as DOCX')}</button>
                  </div>
                )}
                <button onClick={handleSkip} className="withdraw-btn secondary">{t('Skip')}</button>
              </div>
            </div>
          ) : (
            <p className="withdraw-success">{t('Withdraw successful!')}</p>
          )
        )}

        {error && <p className="withdraw-error">{error}</p>}
      </div>
    </>
  );
}

export default CardlessWithdraw;
