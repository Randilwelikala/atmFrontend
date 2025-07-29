import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign, ShadingType } from 'docx';
import { useLocation } from 'react-router-dom';
import './pastTransaction.css';
import { FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();
  const [bankName, setBankName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [userName, setUserName] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const accountNumber = queryParams.get('account');

  useEffect(() => {
    if (!accountNumber) return;
    const token = localStorage.getItem('jwtToken');

    axios.get(`http://localhost:3001/transactions/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        const allTxns = res.data;
        const userData = res.data;
        setBankName(userData.bankName || 'Unknown Bank');
        setUserName(userData.name || 'User');
        setAccountNum(userData.accountNumber || accountNumber);

        const filteredTxns = allTxns.filter(txn => {
          if (!txn || !txn.type) return false;
          if (txn.accountNumber === accountNumber) return true;
          if (txn.type === 'transfer-in' && txn.to === accountNumber) return true;
          return false;
        });

        setTransactions(filteredTxns);
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
      });
  }, [accountNumber]);

  const downloadAsPDF = () => {
    const element = document.getElementById("transaction-history");
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("transaction-history.pdf");
    });
  };

  const downloadAsDOCX = (transactions) => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to download.");
      return;
    }

    const titleParagraph = new Paragraph({
      children: [
        new TextRun({
          text: `${bankName} - Transaction History`,
          bold: true,
          size: 32,
          color: "1F4E79",
        }),
      ],
      alignment: "center",
      spacing: { after: 300 },
    });

    const userParagraph = new Paragraph({
      children: [
        new TextRun({
          text: `Name: ${userName}`,
          italics: true,
          size: 24,
          color: "444444",
        }),
      ],
      alignment: "center",
      spacing: { after: 100 },
    });

    const accountParagraph = new Paragraph({
      children: [
        new TextRun({
          text: `Account Number: ${accountNum}`,
          italics: true,
          size: 24,
          color: "444444",
        }),
      ],
      alignment: "center",
      spacing: { after: 300 },
    });

    const headerRow = new TableRow({
      tableHeader: true,
      children: [
        "No", "Type", "Amount", "Status", "Time", "Balance After"
      ].map(text => new TableCell({
        shading: {
          type: ShadingType.CLEAR,
          color: "FFFFFF",
          fill: "1F4E79",
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, color: "FFFFFF" })],
          alignment: "center",
        })],
      })),
    });

    const dataRows = transactions.map((txn, idx) => {
      const fillColor = idx % 2 === 0 ? "E8F0FE" : "FFFFFF";
      return new TableRow({
        children: [
          (idx + 1).toString(),
          txn.type,
          `Rs.${txn.amount}`,
          txn.status || "Success",
          new Date(txn.timestamp).toLocaleString(),
          txn.balanceAfter != null ? `Rs.${txn.balanceAfter}` : "N/A",
        ].map(text => new TableCell({
          shading: {
            type: ShadingType.CLEAR,
            color: "000000",
            fill: fillColor,
          },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            children: [new TextRun({ text })],
            alignment: "center",
          })],
        })),
      });
    });

    const table = new Table({
      rows: [headerRow, ...dataRows],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });

    const doc = new Document({
      sections: [
        {
          children: [
            titleParagraph,
            userParagraph,
            accountParagraph,
            table,
            new Paragraph({
              children: [
                new TextRun({
                  text: "Thank you for banking with us.",
                  italics: true,
                  size: 24,
                  color: "888888",
                }),
              ],
              alignment: "center",
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "transaction_history.docx");
    });
  };

  return (
    <div className="transaction-container">
    <CardlessSideNavbar/>
      <h2 className="transaction-title">Transaction History</h2>

      <div id="transaction-history">
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn.id || index}>
                  <td>{index + 1}</td>
                  <td>{txn.type}</td>
                  <td>Rs.{txn.amount}</td>
                  <td>{txn.status || 'Success'}</td>
                  <td>{new Date(txn.timestamp).toLocaleString()}</td>
                  <td>Rs.{txn.balanceAfter ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="download-button-wrapper">
        <button className="btn btn-primary">
          <FaDownload />
        </button>
        <div className="download-options">
          <button onClick={downloadAsPDF}>Download as PDF</button>
          <button onClick={() => downloadAsDOCX(transactions)}>Download as DOCX</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
