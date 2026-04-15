import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Cashier from "./components/Cashier";
import Login from "./components/Login";
import ManageProducts from "./components/ManageProducts";
import Customers from "./components/Customers";
import DailyReport from "./components/DailyReport";
import MonthlyReport from "./components/MonthlyReport";
import Invoice from "./components/Invoice";

import API from "./api/axios";
import "./App.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!localStorage.getItem("access");
  });

  

  
   

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const btnStyle = {
    background: "#1f2937",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer"
  };

  const logoutStyle = {
    background: "red",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    marginLeft: "20px",
    cursor: "pointer"
  };

  return (
    <BrowserRouter>
      <div className="App">

        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "15px",
            background: "#111827",
            color: "white",
            flexWrap: "wrap"
          }}
        >
          <Link to="/"><button style={btnStyle}>🏠 Dashboard</button></Link>
          <Link to="/cashier"><button style={btnStyle}>💰 Cashier</button></Link>
          <Link to="/products"><button style={btnStyle}>📦 Products</button></Link>
          
          <Link to="/customers"><button style={btnStyle}>👥 Customers</button></Link>
          <Link to="/reports/daily"><button style={btnStyle}>📊 Daily Report</button></Link>
          <Link to="/reports/monthly"><button style={btnStyle}>📈 Monthly Report</button></Link>
          <Link to="/invoice"><button style={btnStyle}>🧾 Invoices</button></Link>

          <button
            style={logoutStyle}
            onClick={() => {
              localStorage.removeItem("access");
              setLoggedIn(false);
            }}
          >
            Logout
          </button>
        </header>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/products" element={<ManageProducts />} />
          
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reports/daily" element={<DailyReport />} />
          <Route path="/reports/monthly" element={<MonthlyReport />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;