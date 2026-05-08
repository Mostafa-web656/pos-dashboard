import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function InvoicePage() {

  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD INVOICES
  // =========================
  useEffect(() => {

    fetchInvoices();

  }, []);

  const fetchInvoices = async () => {

    try {

      const res = await api.get("sales/invoices/");

      setInvoices(res.data);

    } catch (err) {

      console.log(err.response?.data || err.message);

    }
  };

  // =========================
  // OPEN SINGLE INVOICE
  // =========================
  const openInvoice = async (id) => {

    try {

      setLoading(true);

      const res = await api.get(`sales/invoices/${id}/`);

      console.log(res.data);

      setInvoice(res.data);

    } catch (err) {

      console.log(err.response?.data || err.message);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 20,
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >

      {/* =========================
          LEFT SIDE
      ========================= */}

      <div
        style={{
          width: "35%",
          background: "white",
          padding: 20,
          borderRadius: 12,
          border: "1px solid #ddd"
        }}
      >

        <h2 style={{ marginBottom: 20 }}>
          🧾 Invoices
        </h2>

        {invoices.length === 0 && (
          <p>No invoices found</p>
        )}

        {invoices.map((inv) => (

          <div
            key={inv.id}
            onClick={() => openInvoice(inv.id)}
            style={{
              padding: 15,
              marginBottom: 12,
              background: "#f1f5f9",
              borderRadius: 10,
              cursor: "pointer",
              border: "1px solid #ddd"
            }}
          >

            <h4 style={{ margin: 0 }}>
              Invoice #{inv.id}
            </h4>

            <p style={{ margin: "5px 0" }}>
              {inv.customer_name || "Walk-in"}
            </p>

            <p style={{ margin: 0 }}>
              {inv.total} EGP
            </p>

          </div>
        ))}

      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div
        style={{
          width: "65%",
          background: "white",
          padding: 25,
          borderRadius: 12,
          border: "1px solid #ddd"
        }}
      >

        {!invoice ? (

          <h3>
            👈 اختر فاتورة
          </h3>

        ) : loading ? (

          <h3>Loading...</h3>

        ) : (

          <>

            {/* HEADER */}

            <div style={{ textAlign: "center" }}>

              <h1>
                🧾 POS SYSTEM
              </h1>

              <p style={{ color: "gray" }}>
                {invoice.date}
              </p>

            </div>

            <hr />

            {/* CUSTOMER */}

            <div style={{ marginBottom: 20 }}>

              <p>
                <b>Customer:</b>{" "}
                {invoice.customer_name || "Walk-in"}
              </p>

              <p>
                <b>Phone:</b>{" "}
                {invoice.customer_phone || "-"}
              </p>

            </div>

            <hr />

            {/* ITEMS */}

            <div style={{ marginTop: 20 }}>

              <h3>
                Items
              </h3>

              {!invoice?.items?.length ? (

                <p>No items found</p>

              ) : (

                invoice.items.map((item, i) => (

                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #eee"
                    }}
                  >

                    <div>

                      <div>
                        {item.name}
                      </div>

                      <small>
                        Qty: {item.qty}
                      </small>

                    </div>

                    <div>
                      {item.total} EGP
                    </div>

                  </div>

                ))

              )}

            </div>

            <hr />

            {/* TOTALS */}

            <div
              style={{
                marginTop: 20,
                textAlign: "right"
              }}
            >

              <p>
                <b>Subtotal:</b>{" "}
                {invoice.subtotal} EGP
              </p>

              <p>
                <b>VAT:</b>{" "}
                {invoice.tax_amount} EGP
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