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
import { FaDownload } from 'react-icons/fa';
import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';
import DepositTemplate from '../../components/depositReceiptTemplate/depositReceiptTemplate';
import html2pdf from 'html2pdf.js';



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
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef();



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

  const element = receiptRef.current;

  const opt = {
    margin: 0.5,
    filename: 'DepositReceipt.pdf', 
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(opt).from(element).save();
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
     const depositedAmountNum = parseFloat(amount);
      setAmount('');
      setTransactionId(generateTransactionId());
      setTransactionDate(new Date().toLocaleString());
      const transactionData = {
        sender: {
          name: user.name,
          bankName: user.bankName || 'N/A',
          branch: user.branch,
          accountNumber: user.accountNumber,
        },
        transaction: {
          currency: 'LKR',
          amount: depositedAmountNum,
          requiredLKR: res.data.balance,
          status: 'Successful',
          timestamp: Date.now(),
        },
      };
      setReceiptData(transactionData);
      setDepositedAmount(depositedAmountNum);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (error) return <p className="deposit-error">{error}</p>;
  if (!user) return <p className="deposit-loading">{t('Loading user details...')}</p>;

  return (
    <div className="deposit-container" id="deposit-page">
      <SessionTimeout timeoutDuration={50000000} />
      <CardSideNavbar/>
      

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
{/* 
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
                <FaDownload />
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
      )} */}

      {message && localStorage.getItem('wantsReceipt') === 'yes' ? (
        <>
          <DepositTemplate transactionData={receiptData} ref={receiptRef} />
          <div className="deposit-dropdown-wrapper" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="deposit-btn download-btn">
              <FaDownload />
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
        </>
      ) : (
        <p className="deposit-success">{t('Deposit successful!')}</p>
      )}


      {error && <p className="deposit-error">{error}</p>}
    </div>
  );
}

export default Deposit;
