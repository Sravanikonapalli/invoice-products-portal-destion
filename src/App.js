import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InvoicePortal from "./components/InvoicePortal";
import ProductPortal from "./components/ProductPortal";
import "./App.css"; 

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Invoice & Product Management Portal</h1>

        <nav>
          <Link to="/invoices">Invoices</Link>
          <Link to="/products">Products</Link>
        </nav>

        <Routes>
          <Route path="/invoices" element={<InvoicePortal />} />
          <Route path="/products" element={<ProductPortal />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
