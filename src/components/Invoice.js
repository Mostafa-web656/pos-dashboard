import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🔄 تحميل الفواتير
  const fetchInvoices = async () => {
    try {
      const res = await api.get(`sales/invoices/${id}/`);
      setInvoices(res.data || []);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🔥 تحميل تفاصيل الفاتورة (FIXED)
  const openInvoice = async (id) => {
    try {
      const res = await api.get(`sales/invoice/${id}/`); // ✅ هنا التصحيح
      setSelected(res.data);
    } catch (err) {
      console.log(err);
      alert("❌ Error loading invoice");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🧾 Invoices</h1>

      {/* 📋 قائمة الفواتير */}
      {invoices.map((inv) => (
        <div
          key={inv.id}
          onClick={() => openInvoice(inv.id)}
          style={{
            background: "#eee",
            padding: 15,
            marginBottom: 10,
            cursor: "pointer",
            borderRadius: 10,
          }}
        >
          <h3>Invoice #{inv.id}</h3>
          <p>{inv.customer_name || "Walk-in"}</p>
          <h4>{inv.total} EGP</h4>
        </div>
      ))}

      {/* 🧾 تفاصيل الفاتورة */}
      {selected && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <h2>Invoice #{selected.id}</h2>

          <p><b>Customer:</b> {selected.customer_name || "Walk-in"}</p>

          <hr />

          {/* 🔥 عرض الأصناف */}
          {(selected.items || []).map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>{item.name} × {item.qty}</span>
              <span>{item.total} EGP</span>
            </div>
          ))}

          <hr />

          <h2>Total: {selected.total} EGP</h2>
        </div>
      )}
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    padding: 30,
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  search: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    border: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
    gap: 15,
  },
  card: {
    background: "#1f2937",
    padding: 20,
    borderRadius: 15,
    cursor: "pointer",
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
    alignItems: "center",
  },
  modal: {
    background: "white",
    color: "black",
    padding: 25,
    width: 400,
    borderRadius: 15,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  print: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "#22c55e",
    border: "none",
    borderRadius: 10,
    color: "white",
  },
  close: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "red",
    border: "none",
    borderRadius: 10,
    color: "white",
  },
};