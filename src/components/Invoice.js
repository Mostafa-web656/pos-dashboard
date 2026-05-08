import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function InvoicePage() {

  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // 📅 DATE FILTER
  const [dateFilter, setDateFilter] = useState("");

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

  // 🔥 FILTER LOGIC
  const filteredInvoices = invoices.filter((inv) => {

    const customer =
      inv.customer_name || "";

    const matchesSearch =

      customer
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      inv.id
        .toString()
        .includes(search);

    const matchesDate =

      !dateFilter ||

      inv.date.startsWith(dateFilter);

    return matchesSearch && matchesDate;

  });

  return (

    <div style={{
      display: "flex",
      gap: 20,
      padding: 20
    }}>

      {/* LEFT: LIST */}
      <div style={{ width: "40%" }}>

        <h2>🧾 Invoices</h2>

        {/* 🔍 SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search invoice or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        {/* 📅 DATE FILTER */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        {/* 🔥 INVOICES */}
        {filteredInvoices.map(inv => (

          <div
            key={inv.id}
            onClick={() => openInvoice(inv.id)}
            style={{
              padding: 10,
              marginBottom: 10,
              background: "#f1f1f1",
              cursor: "pointer",
              borderRadius: 8
            }}
          >

            <b>
              Invoice #{inv.id}
            </b>

            <div>
              {inv.customer_name || "Walk-in"}
            </div>

            <div>
              {inv.total} EGP
            </div>

          </div>

        ))}

      </div>

      {/* RIGHT: INVOICE UI */}
      <div style={{
        width: "60%",
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        border: "1px solid #ddd"
      }}>

        {!invoice ? (

          <h3>
            👈 اختر فاتورة
          </h3>

        ) : (

          <>
            <h2 style={{ textAlign: "center" }}>
              🧾 POS SYSTEM
            </h2>

            <p style={{
              textAlign: "center",
              color: "gray"
            }}>
              {invoice.date}
            </p>

            <hr />

            <p>
              <b>Customer:</b>{" "}
              {invoice.customer_name || "Walk-in"}
            </p>

            <hr />

            {/* ITEMS */}
            {invoice?.items?.length > 0 ? (

              invoice.items.map((item, i) => (

                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0"
                  }}
                >

                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    {item.total} EGP
                  </span>

                </div>

              ))

            ) : (

              <p>
                No items found
              </p>

            )}

            <hr />

            <div style={{ textAlign: "right" }}>

              <p>
                Subtotal: {invoice.subtotal} EGP
              </p>

              <p>
                VAT: {invoice.tax_amount} EGP
              </p>

              <h2>
                Total: {invoice.total} EGP
              </h2>

            </div>

          </>
        )}
      </div>
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