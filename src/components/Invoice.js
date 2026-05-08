import React, { useEffect, useState, useMemo } from "react";
import api from "../api/api";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);

  // 🔍 filters
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    api.get("sales/invoices/")
      .then(res => setInvoices(res.data))
      .catch(err => console.log(err));
  }, []);

  const openInvoice = (id) => {
    api.get(`sales/invoices/${id}/`)
      .then(res => setInvoice(res.data))
      .catch(err => console.log(err));
  };

  // 🔥 FILTER
  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const date = new Date(inv.date);
      const customer = (inv.customer_name || "walk-in").toLowerCase();

      const okSearch = customer.includes(search.toLowerCase());
      const okDay = day ? date.getDate() === Number(day) : true;
      const okMonth = month ? (date.getMonth() + 1) === Number(month) : true;
      const okYear = year ? date.getFullYear() === Number(year) : true;

      return okSearch && okDay && okMonth && okYear;
    });
  }, [invoices, search, day, month, year]);

  return (
    <div style={styles.page}>

      {/* LEFT */}
      <div style={styles.left}>

        <h2 style={styles.title}>🧾 Invoices</h2>

        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <div style={styles.filterRow}>
          <input placeholder="Day" type="number" value={day} onChange={e=>setDay(e.target.value)} style={styles.small} />
          <input placeholder="Month" type="number" value={month} onChange={e=>setMonth(e.target.value)} style={styles.small} />
          <input placeholder="Year" type="number" value={year} onChange={e=>setYear(e.target.value)} style={styles.small} />
        </div>

        <div style={styles.list}>
          {filtered.map(inv => (
            <div
              key={inv.id}
              onClick={() => openInvoice(inv.id)}
              style={styles.card}
            >
              <div style={styles.rowBetween}>
                <b>#{inv.id}</b>
                <span style={styles.price}>{inv.total} EGP</span>
              </div>

              <div style={styles.gray}>{inv.customer_name}</div>
              <div style={styles.date}>{inv.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>

        {!invoice ? (
          <div style={styles.empty}>
            👈 Select invoice to view details
          </div>
        ) : (
          <div>

            <h2 style={styles.center}>🧾 INVOICE</h2>
            <p style={styles.centerGray}>{invoice.date}</p>

            <hr />

            <p><b>Customer:</b> {invoice.customer_name}</p>

            <hr />

            {invoice.items?.map((item, i) => (
              <div key={i} style={styles.itemRow}>
                <span>{item.name} × {item.qty}</span>
                <span>{item.total} EGP</span>
              </div>
            ))}

            <hr />

            <div style={styles.summary}>
              <div>Subtotal: {invoice.subtotal} EGP</div>
              <div>VAT: {invoice.tax_amount} EGP</div>
              <h2>Total: {invoice.total} EGP</h2>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    display: "flex",
    gap: 20,
    padding: 20,
    background: "#0f172a",
    minHeight: "100vh",
    fontFamily: "sans-serif"
  },

  left: {
    width: "35%",
    background: "#fff",
    padding: 20,
    borderRadius: 15
  },

  right: {
    width: "65%",
    background: "#fff",
    padding: 25,
    borderRadius: 15
  },

  title: { marginBottom: 10 },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 10
  },

  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 10
  },

  small: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    border: "1px solid #ddd"
  },

  list: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  card: {
    padding: 12,
    background: "#f1f5f9",
    borderRadius: 12,
    cursor: "pointer",
    transition: "0.2s"
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between"
  },

  price: {
    color: "#16a34a",
    fontWeight: "bold"
  },

  gray: { color: "#666", fontSize: 13 },
  date: { color: "#999", fontSize: 12 },

  empty: {
    textAlign: "center",
    marginTop: 100,
    color: "#666"
  },

  center: { textAlign: "center" },
  centerGray: { textAlign: "center", color: "gray" },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0"
  },

  summary: {
    textAlign: "right",
    marginTop: 10
  }
};