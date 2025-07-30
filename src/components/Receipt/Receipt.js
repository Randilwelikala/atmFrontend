import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Receipt.css'; // create this file for styles

export default function ATMReceipt() {
  const downloadPDF = () => {
    const receipt = document.getElementById('receipt');
    html2canvas(receipt).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // auto height
      pdf.save('ATM_Receipt.pdf');
    });
  };

  return (
    <div className="receipt-container">
      <div id="receipt" className="receipt">
        <img src="/logo192.png" alt="Bank Logo" className="logo" />
        <h2 className="center">NSBM ATM Receipt</h2>
        <hr />
        <table>
          <tbody>
            <tr><td><b>Card No</b></td><td>**** **** **** 1234</td></tr>
            <tr><td><b>Date</b></td><td>30/07/2025</td></tr>
            <tr><td><b>Time</b></td><td>10:32 AM</td></tr>
            <tr><td><b>Transaction</b></td><td>Withdrawal</td></tr>
            <tr><td><b>Amount</b></td><td>Rs. 10,000.00</td></tr>
            <tr><td><b>Status</b></td><td className="success">Success</td></tr>
            <tr><td><b>Balance</b></td><td>Rs. 25,450.00</td></tr>
          </tbody>
        </table>
        <hr />
        <p className="center">Thank you for using NSBM Bank</p>
      </div>

      <button onClick={downloadPDF} className="download-btn">Download PDF</button>
    </div>
  );
}
