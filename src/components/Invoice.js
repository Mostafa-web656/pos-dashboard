import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const printRef = useRef();

  // 🔄 تحميل الفواتير
  const fetchInvoices = async () => {
    try {
      const res = await api.get("sales/invoices/");
      setInvoices(res.data);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🔍 فلترة
  const filtered = invoices.filter((inv) =>
    inv.id.toString().includes(search) ||
    (inv.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (inv.customer_phone || "").includes(search)
  );

  // 🖨 طباعة
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Invoices</h1>

      {/* 🔍 Search */}
      <input
        placeholder="Search by ID / Name / Phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* 📋 List */}
      <div style={styles.grid}>
        {filtered.map((inv) => (
          <div
            key={inv.id}
            style={styles.card}
            onClick={() => setSelected(inv)}
          >
            <h3>Invoice #{inv.id}</h3>
            <p>{inv.date}</p>
            <p>{inv.customer_name || "Walk-in"}</p>
            <h2>{inv.total} EGP</h2>
          </div>
        ))}
      </div>

      {/* 🧾 Modal */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            <div ref={printRef}>
              <h2 style={{ textAlign: "center" }}>POS STORE</h2>
              <p style={{ textAlign: "center" }}>
                Invoice #{selected.id}
              </p>

              <p><b>Date:</b> {selected.date}</p>
              <p><b>Customer:</b> {selected.customer_name || "Walk-in"}</p>
              <p><b>Phone:</b> {selected.customer_phone || "-"}</p>

              <hr />

              {selected.items.map((item, i) => (
                <div key={i} style={styles.row}>
                  <span>{item.name} × {item.qty}</span>
                  <b>{item.total} EGP</b>
                </div>
              ))}

              <hr />

              <div style={styles.row}>
                <span>Subtotal</span>
                <b>{selected.total} EGP</b>
              </div>

              <div style={styles.row}>
                <span>Tax (14%)</span>
                <b>{(selected.total * 0.14).toFixed(2)} EGP</b>
              </div>

              <h2 style={{ textAlign: "center" }}>
                Total: {(selected.total * 1.14).toFixed(2)} EGP
              </h2>
            </div>

            {/* 🔘 Buttons */}
            <button style={styles.print} onClick={handlePrint}>
              🖨 Print
            </button>

            <button style={styles.close} onClick={() => setSelected(null)}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  search: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    border: "none"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
    gap: 15
  },
  card: {
    background: "#1f2937",
    padding: 20,
    borderRadius: 15,
    cursor: "pointer"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "white",
    color: "black",
    padding: 25,
    width: 400,
    borderRadius: 15
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8
  },
  print: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "#22c55e",
    border: "none",
    borderRadius: 10,
    color: "white"
  },
  close: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "red",
    border: "none",
    borderRadius: 10,
    color: "white"
  }
};