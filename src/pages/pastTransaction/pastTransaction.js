import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';
import { useLocation } from 'react-router-dom';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const accountNumber = queryParams.get('account');

  useEffect(() => {
    if (!accountNumber) return;

    axios.get(`http://localhost:3001/transactions/${accountNumber}`)
      .then(res => {
      const allTxns = res.data;
      
      const filteredTxns = allTxns.filter(txn => {
        if (!txn || !txn.type) return false;
        
        if (txn.accountNumber === accountNumber) {
          return true;
        }

        
        if (txn.type === 'transfer-in' && txn.to === accountNumber) {
          return true;
        }

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

    const doc = new Document({
      sections: [
        {
          children: transactions.map((tx) => {
            return new Paragraph(
              `Date: ${new Date(tx.timestamp).toLocaleString()}, Type: ${tx.type}, Amount: Rs.${tx.amount}`
            );
          }),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const fileName = "transactions.docx";

      try {
        const file = new window.File([blob], fileName);
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    });
  };

  return (
    <div>
      <h2>Transaction History</h2>

      <div id="transaction-history" >
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table >
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

      <div >
        <button onClick={downloadAsPDF}>Download as PDF</button>
        <button onClick={() => downloadAsDOCX(transactions)}>Download as DOCX</button>
      </div>
    </div>
  );
};

export default TransactionHistory;