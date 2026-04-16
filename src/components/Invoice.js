import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    day: "",
    month: "",
    year: "",
  });

  const fetchInvoices = useCallback(async () => {
    try {
      let url = "sales/invoices/?";

      if (filters.day) url += `day=${filters.day}&`;
      if (filters.month) url += `month=${filters.month}&`;
      if (filters.year) url += `year=${filters.year}`;

      const res = await api.get(url);
      setInvoices(res.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [filters]);

 useEffect(() => {
  fetchInvoices();
}, []);

  // ✏️ handle input change
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Invoices</h1>

      {/* 🔍 Filters */}
      <div style={styles.filter}>
        <input
          name="day"
          type="number"
          placeholder="Day"
          value={filters.day}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="month"
          type="number"
          placeholder="Month"
          value={filters.month}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="year"
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={fetchInvoices} style={styles.searchBtn}>
          Search
        </button>
      </div>

      {/* 📋 List */}
      <div style={styles.grid}>
        {invoices.length > 0 ? (
          invoices.map((inv) => (
            <div
              key={inv.id}
              style={styles.card}
              onClick={() => setSelected(inv)}
            >
              <h3>Invoice #{inv.id}</h3>
              <p>
                {inv.created_at
                  ? new Date(inv.created_at).toLocaleString()
                  : ""}
              </p>
              <p>
                <strong>Customer:</strong>{" "}
                {inv.customer_name || "Walk-in Customer"}
              </p>
              <h2 style={{ color: "#10b981" }}>
                {Number(inv.total || 0).toFixed(2)} EGP
              </h2>
            </div>
          ))
        ) : (
          <p>No invoices found.</p>
        )}
      </div>

      {/* 🧾 Modal */}
      {selected && (
        <div style={styles.modalBg} onClick={() => setSelected(null)}>
          <div
            style={styles.invoice}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ textAlign: "center" }}>POS STORE</h2>

            <p style={{ textAlign: "center" }}>
              Invoice #{selected.id}
            </p>

            <p style={{ textAlign: "center" }}>
              {selected.created_at
                ? new Date(selected.created_at).toLocaleString()
                : ""}
            </p>

            {/* 👤 Customer */}
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
            {selected.items?.length ? (
              selected.items.map((item, i) => (
                <div key={i} style={styles.row}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <b>
                    {Number(item.total || 0).toFixed(2)} EGP
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
              Total: {Number(selected.total || 0).toFixed(2)} EGP
            </h1>

            {/* 🖨 Print */}
            <button
              onClick={() => window.print()}
              style={styles.print}
            >
              🖨 Print Invoice
            </button>

            {/* ❌ Close */}
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
  },
  close: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
  },
};