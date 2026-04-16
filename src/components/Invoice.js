import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  // ✅ FIX 1: لازم يتعرفوا
  const [selected, setSelected] = useState(null);

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

  // ✅ FIX 2: يتحدث مع الفلاتر
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Invoices</h1>

      {/* Filters */}
      <div style={styles.filter}>
        <input name="day" type="number" placeholder="Day" value={filters.day} onChange={handleChange} style={styles.input} />

        <input name="month" type="number" placeholder="Month" value={filters.month} onChange={handleChange} style={styles.input} />

        <input name="year" type="number" placeholder="Year" value={filters.year} onChange={handleChange} style={styles.input} />

        <button onClick={fetchInvoices} style={styles.searchBtn}>
          Search
        </button>
      </div>

      {/* List */}
      <div style={styles.grid}>
        {invoices.length > 0 ? (
          invoices.map((inv) => (
            <div key={inv.id} style={styles.card} onClick={() => setSelected(inv)}>
              <h3>Invoice #{inv.id}</h3>
              <p>
                {inv.created_at ? new Date(inv.created_at).toLocaleString() : ""}
              </p>
              <p>
                <strong>Customer:</strong> {inv.customer_name || "Walk-in Customer"}
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

      {/* Modal */}
      {selected && (
        <div style={styles.modalBg} onClick={() => setSelected(null)}>
          <div style={styles.invoice} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ textAlign: "center" }}>POS STORE</h2>

            <p style={{ textAlign: "center" }}>Invoice #{selected.id}</p>

            <p style={{ textAlign: "center" }}>
              {selected.created_at ? new Date(selected.created_at).toLocaleString() : ""}
            </p>

            <div style={styles.customerBox}>
              <p>
                <strong>Customer:</strong> {selected.customer_name || "Walk-in Customer"}
              </p>
              <p>
                <strong>Phone:</strong> {selected.customer_phone || "-"}
              </p>
            </div>

            <hr />

            <h3>Items</h3>

            {selected.items?.length ? (
              selected.items.map((item, i) => (
                <div key={i} style={styles.row}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <b>{Number(item.total || 0).toFixed(2)} EGP</b>
                </div>
              ))
            ) : (
              <p>No items.</p>
            )}

            <hr />

            <div style={styles.row}>
              <span>Subtotal:</span>
              <b>{Number(selected.subtotal || 0).toFixed(2)} EGP</b>
            </div>

            <div style={styles.row}>
              <span>Tax ({selected.tax_rate || 0}%):</span>
              <b>{Number(selected.tax_amount || 0).toFixed(2)} EGP</b>
            </div>

            <hr />

            <h1 style={styles.total}>
              Total: {Number(selected.total || 0).toFixed(2)} EGP
            </h1>

            <button onClick={() => window.print()} style={styles.print}>
              🖨 Print Invoice
            </button>

            <button onClick={() => setSelected(null)} style={styles.close}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}