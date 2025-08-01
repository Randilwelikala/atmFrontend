import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';
import { saveAs } from 'file-saver';
import './cardlessDepositMoney.css';
import { useTranslation } from 'react-i18next';
import { getToken, removeToken } from '../../utils/auth';
import { FaDownload } from 'react-icons/fa';
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import DepositTemplate from '../../components/depositReceiptTemplate/depositReceiptTemplate';
import html2pdf from 'html2pdf.js';

function CardlessDeposit() {
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const receiptRef = useRef(null);

const transactionData = {
  sender: {
    name: user?.name,
    bankName: user?.bankName,
    branch: user?.branch,
    accountNumber: user?.accountNumber,
  },
  transaction: {
    currency: 'LKR',
    amount: depositedAmount,
    requiredLKR: user?.balance,
    status: 'Successful',
    timestamp: transactionDate,
  },
};


  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('No token found, please login.');
          return;
        }
        const res = await axios.get(`http://localhost:3001/user/${accountNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Unauthorized, please login again.');
          removeToken();
        } else {
          setError('Failed to fetch user data.');
        }
      }
    };
    fetchProtectedData();
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
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: 'deposit_receipt.pdf',
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
    saveAs(blob, "transaction_receipt.docx");
  };

  const generateTransactionId = () => `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSkip = () => {
    navigate('/cardlessDashboard');
  };

  const handleDeposit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = getToken();
      if (!token) {
        setError('No token found, please login again.');
        return;
      }

      const res = await axios.post('http://localhost:3001/deposit', {
        accountNumber,
        amount: parseFloat(amount),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message || 'Deposit successful!');
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
      <CardlessSideNavbar/>
      <h2 className="deposit-title">{t('Deposit Money')}</h2>
      <p><strong>{t('Name')}:</strong> {t(`${user.name}`)}</p>
      <p><strong>{t('Account Number')}:</strong> {user.accountNumber}</p>
      <p><strong>{t("Branch")}:</strong> {t(`${user.branch}`)}</p>
      <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
      <p><strong>{t('Current Balance')}:</strong> {t('Rs')}. {user.balance}</p>

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

      {/* {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="deposit-receipt-box">
            <h3>{t('Cardless Deposit Receipt')}</h3>
            <div className="receipt-row">
              <span className="receipt-label">{t('Transaction ID')}:</span>
              <span className="receipt-value">{transactionId}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('Transaction Date')}:</span>
              <span className="receipt-value">{transactionDate}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('Account')}:</span>
              <span className="receipt-value">{user.accountNumber}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('Name')}:</span>
              <span className="receipt-value">{user.name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('Branch')}:</span>
              <span className="receipt-value">{user.branch}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('Account Type')}:</span>
              <span className="receipt-value">{user.accountType}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('Deposit Amount')}:</span>
              <span className="receipt-value">Rs. {depositedAmount}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">{t('New Balance')}:</span>
              <span className="receipt-value">Rs. {user.balance}</span>
            </div>

            <p className="deposit-success-me" id='su'>{t('Deposit successful!')}</p>

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
              <button onClick={handleSkip} className="deposit-btn skip-btn">Skip</button>
            </div>
          </div>
        ) : (
          <p className="deposit-success">{t('Deposit successful!')}</p>
        )
      )} */}
      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <>
            <div className="deposit-receipt-box">
              <DepositTemplate transactionData={transactionData} ref={receiptRef} />

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
                <button onClick={handleSkip} className="deposit-btn skip-btn">Skip</button>
              </div>
            </div>
          </>
        ) : (
          <p className="deposit-success">{t('Deposit successful!')}</p>
        )
      )}

    </div>
  );
}

export default CardlessDeposit;
