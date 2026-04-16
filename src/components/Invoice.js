import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ day: "", month: "", year: "" });

  const fetchInvoices = useCallback(async () => {
    try {
      let url = "sales/invoices/?";
      const params = [];
      
      if (filters.day) params.push(`day=${filters.day}`);
      if (filters.month) params.push(`month=${filters.month}`);
      if (filters.year) params.push(`year=${filters.year}`);
      
      url += params.join("&");
      const res = await api.get(url);
      setInvoices(res.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
  }, [filters]); // تغيير من [fetchInvoices]

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Invoices</h1>
      <div>
        <input name="day" placeholder="Day" onChange={handleChange} />
        <input name="month" placeholder="Month" onChange={handleChange} />
        <input name="year" placeholder="Year" onChange={handleChange} />
        <button onClick={fetchInvoices}>Search</button>
      </div>
    

      <div>
        {invoices.map((inv) => (
          <div key={inv.id} onClick={() => setSelected(inv)}>
            <h3>Invoice #{inv.id}</h3>
            <p>{inv.total}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <h2>Invoice Details</h2>
            <p>{selected.customer_name}</p>
            <p>{selected.total}</p>

            <button onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}