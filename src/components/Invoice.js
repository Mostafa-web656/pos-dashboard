import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔄 Fetch invoices from backend
  const fetchInvoices = async () => {
    try {
      let url = "sales/invoices/?";
      if (month) url += `month=${month}&`;
      if (year) url += `year=${year}&`;
      if (day) url += `day=${day}`;

      const res = await api.get(url);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("Failed to load invoices ❌");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Invoices</h1>

      {/* 🔍 Filters */}
      <div style={styles.filter}>
        <input
          type="number"
          placeholder="Day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchInvoices} style={styles.searchBtn}>
          Search
        </button>
      </div>

      {/* 📋 Invoice Cards */}
      <div style={styles.grid}>
        {invoices.length > 0 ? (
          invoices.map((inv) => (
            <div
              key={inv.id}
              style={styles.card}
              onClick={() => setSelected(inv)}
            >
              <h3>Invoice #{inv.id}</h3>
              <p>{new Date(inv.created_at).toLocaleString()}</p>
              <p>
                <strong>Customer:</strong>{" "}
                {inv.customer_name || "Walk-in Customer"}
              </p>
              <h2 style={{ color: "#10b981" }}>
                {Number(inv.total).toFixed(2)} EGP
              </h2>
            </div>
          ))
        ) : (
          <p>No invoices found.</p>
        )}
      </div>

      {/* 🧾 Invoice Modal */}
      {selected && (
        <div
          style={styles.modalBg}
          onClick={() => setSelected(null)}
        >
          <div
            style={styles.invoice}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ textAlign: "center" }}>POS STORE</h2>
            <p style={{ textAlign: "center" }}>
              Invoice #{selected.id}
            </p>
            <p style={{ textAlign: "center" }}>
              {new Date(selected.created_at).toLocaleString()}
            </p>

            {/* 👤 Customer Info */}
            <div style={styles.customerBox}>
              <p>
                <strong>Customer:</strong>{" "}
                {selected.customer_name || "Walk-in Customer"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selected.customer_phone || "-"}
              </p>
            </div>

            <hr />

            {/* 🛒 Items */}
            <h3>Items</h3>
            {selected.items && selected.items.length > 0 ? (
              selected.items.map((item, index) => (
                <div key={index} style={styles.row}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <b>
                    {Number(item.total).toFixed(2)} EGP
                  </b>
                </div>
              ))
            ) : (
              <p>No items.</p>
            )}

            <hr />

            {/* 💰 Totals */}
            <div style={styles.row}>
              <span>Subtotal:</span>
              <b>
                {Number(selected.subtotal || 0).toFixed(2)} EGP
              </b>
            </div>

            <div style={styles.row}>
              <span>
                Tax ({selected.tax_rate || 0}%):
              </span>
              <b>
                {Number(selected.tax_amount || 0).toFixed(2)} EGP
              </b>
            </div>

            <hr />

            <h1 style={styles.total}>
              Total: {Number(selected.total).toFixed(2)} EGP
            </h1>

            {/* 🖨 Print Button */}
            <button
              onClick={() => window.print()}
              style={styles.print}
            >
              🖨 Print Invoice
            </button>

            {/* ❌ Close Button */}
            <button
              onClick={() => setSelected(null)}
              style={styles.close}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    padding: "30px",
    background: "#f9fafb",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#111827",
  },
  filter: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "120px",
  },
  searchBtn: {
    padding: "10px 20px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#111827",
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },
  modalBg: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  invoice: {
    background: "white",
    color: "black",
    padding: "30px",
    width: "400px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  customerBox: {
    background: "#f3f4f6",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  total: {
    textAlign: "center",
    color: "#111827",
  },
  print: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  close: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};