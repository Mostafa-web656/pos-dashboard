import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Cashier from "./components/Cashier";
import Login from "./components/Login";
import ManageProducts from "./components/ManageProducts";
import Customers from "./components/Customers";
import DailyReport from "./components/DailyReport";
import MonthlyReport from "./components/MonthlyReport";
import Invoice from "./components/Invoice";

import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!localStorage.getItem("access");
  });

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <BrowserRouter>
      <div className="App">

        {/* HEADER */}
        <header style={{
          display: "flex",
          gap: "10px",
          padding: "15px",
          background: "#111827",
          flexWrap: "wrap"
        }}>
          <Link to="/"><button>🏠 Dashboard</button></Link>
          <Link to="/cashier"><button>💰 Cashier</button></Link>
          <Link to="/products"><button>📦 Products</button></Link>
          <Link to="/customers"><button>👥 Customers</button></Link>
          <Link to="/reports/daily"><button>📊 Daily</button></Link>
          <Link to="/reports/monthly"><button>📈 Monthly</button></Link>
          <Link to="/invoice"><button>🧾 Invoices</button></Link>

          <button
            style={{ background: "red", color: "white" }}
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