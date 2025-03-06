import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/invoice.css";

const API_BASE_URL = "https://invoice-portal-backend.onrender.com";

const InvoicePortal = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices`);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  return (
    <div className="invoice-container">
      <h2>Invoices</h2>
      <table>
        <thead>
          <tr>
            <th>Store ID</th>
            <th>Order ID</th>
            <th>Total With Tax ($)</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.store_id}</td>
              <td>{invoice.order_id}</td>
              <td>${invoice.grand_total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicePortal;
