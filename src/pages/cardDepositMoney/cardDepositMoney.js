import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import jsPDF from 'jspdf';
import { Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';
import autoTable from 'jspdf-autotable';
import { Document, } from 'docx';
import { saveAs } from 'file-saver';
import './cardDepositMoney.css';
import { useTranslation } from 'react-i18next';

function Deposit() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios.get(`http://localhost:3001/user/${accountNumber}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
  })
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
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

  const downloadPDF = () => {
      setOpen(false);
      const doc = new jsPDF();
      const bankName = user?.bankName || "Bank Name";
      doc.setFontSize(18);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(bankName);
      const x = (pageWidth - textWidth) / 2;
      doc.text(bankName, x, 15);
      autoTable(doc, {
        startY: 25,
        head: [['Field', 'Value']],
        body: [
          ['Transaction ID', transactionId],
          ['Transaction Date', transactionDate],
          ['Account Number', user.accountNumber],
          ['Name', user.name],
          ['Branch', user.branch],
          ['Account Type', user.accountType],
          ['Deposited Amount', `Rs. ${depositedAmount}`],
          ['New Balance', `Rs. ${user.balance}`],
        ],
      });
      doc.save('Deposit.pdf');
    };
  

  const downloadDOCX = async () => {
    setOpen(false);
    const tableRows = [
      ["Transaction ID", transactionId],
      ["Transaction Date", transactionDate],
      ["Account Number", user.accountNumber],
      ["Name", user.name],
      ["Branch", user.branch],
      ["Account Type", user.accountType],
      ["Deposited Amount", `Rs. ${depositedAmount}`],
      ["New Balance", `Rs. ${user.balance}`],
    ];

    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "Field", bold: true })],
              shading: { fill: "1F4E79" },
            }),
            new TableCell({
              children: [new Paragraph({ text: "Value", bold: true })],
              shading: { fill: "1F4E79" },
            }),
          ],
        }),
        ...tableRows.map(([key, value]) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: key, bold: true })],
                shading: { fill: "D9E1F2" },
              }),
              new TableCell({
                children: [new Paragraph(value)],
              }),
            ],
          })
        ),
      ],
      width: {
        size: 100,
        type: "pct",
      },
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${user.bankName} Transaction Receipt`,
                bold: true,
                size: 32,
                color: "1F4E79",
              }),
            ],
            alignment: "center",
            spacing: { after: 300 },
          }),
          table,
          new Paragraph({
            children: [
              new TextRun({
                text: "Thank you for banking with us.",
                italics: true,
                size: 22,
                color: "888888",
              }),
            ],
            alignment: "center",
            spacing: { before: 400 },
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Deposit.docx");
  };

  const generateTransactionId = () => `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSkip = () => {
    navigate('/cardDashboard?account=' + accountNumber);
  };

  const handleDeposit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await axios.post('http://localhost:3001/deposit', {
        accountNumber,
        amount: parseFloat(amount),
      },
        {headers: {
        Authorization: `Bearer ${token}`
      }        

      });
      setMessage(res.data.message || `Deposit successful!`);
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount);
      setAmount('');
      setTransactionId(generateTransactionId());
      setTransactionDate(new Date().toLocaleString());
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (error) return <p className="deposit-error">{error}</p>;
  if (!user) return <p className="deposit-loading">{t('Loading user details...')}</p>;

  return (
    <div className="deposit-container" id="deposit-page">
      <SessionTimeout timeoutDuration={50000000} />
      <h2 className="deposit-title">{t('Deposit Money')}</h2>
      <p><strong>{t('Name')}:</strong> {user.name}</p>
      <p><strong>{t('Account Number')}:</strong> {user.accountNumber}</p>
      <p><strong>{t('Branch')}:</strong> {user.branch}</p>
      <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
      <p><strong>{t('Current Balance')}:</strong> {t('Rs.')} {user.balance}</p>

      <form onSubmit={handleDeposit} className="deposit-form">
        <label htmlFor="amount" className="deposit-label">{t('Amount to Deposit')}:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="deposit-input"
          min="0"
          step="0.01"
          required
        />
        <button type="submit" className="deposit-btn">{t('Deposit')}</button>
      </form>

      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="deposit-receipt-box">
            <h3>{t('Transaction Receipt')}</h3>
            <p><strong>{t('Transaction ID')}:</strong> {transactionId}</p>
            <p><strong>{t('Transaction Date')}:</strong> {transactionDate}</p>
            <p><strong>{t('Account')}:</strong> {user.accountNumber}</p>
            <p><strong>{t('Name')}:</strong> {user.name}</p>
            <p><strong>{t('Branch')}:</strong> {user.branch}</p>
            <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
            <p><strong>{t('Deposited Amount')}:</strong> {t('Rs')}. {depositedAmount}</p>
            <p><strong>{t('New Balance')}:</strong> {t('Rs')}. {user.balance}</p>
            <p className="deposit-success">{t('Deposit successful!')}</p>

            <div className="deposit-dropdown-wrapper" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="deposit-btn download-btn">
                {t('Download')} ▼
              </button>
              {open && (
                <div className="deposit-dropdown-menu">
                  <button onClick={downloadPDF} className="deposit-dropdown-btn">
                    {t('Download as PDF')}
                  </button>
                  <button onClick={downloadDOCX} className="deposit-dropdown-btn">
                    {t('Download as DOCX')}
                  </button>
                </div>
              )}
              <button onClick={handleSkip} className="deposit-btn skip-btn">{t('Skip')}</button>
            </div>
          </div>
        ) : (
          <p className="deposit-success">{t('Deposit successful!')}</p>
        )
      )}

      {error && <p className="deposit-error">{error}</p>}
    </div>
  );
}

export default Deposit;
