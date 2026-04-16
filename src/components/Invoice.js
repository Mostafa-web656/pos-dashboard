import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null); // ✅ FIX المهم ده

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
  }, [fetchInvoices]); // ✅ كمان تصليح مهم هنا

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Invoices</h1>

      <button onClick={fetchInvoices}>Search</button>

      {invoices.map((inv) => (
        <div key={inv.id} onClick={() => setSelected(inv)}>
          <h3>Invoice #{inv.id}</h3>
          <p>{inv.total}</p>
        </div>
      ))}

      {selected && (
        <div onClick={() => setSelected(null)}>
          <h2>Invoice #{selected.id}</h2>
          <p>Total: {selected.total}</p>
        </div>
      )}
    </div>
  );
}