import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get("accounts/customers/");
      const stat = await API.get("accounts/customers/stats/");

      setCustomers(res.data);
      setStats(stat.data);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired, login again 🔐");
        localStorage.removeItem("access");
        window.location.reload();
      } else {
        alert("Failed to load customers ❌");
      }
    }
  };

  useEffect(() => {
    fetchData();

    const handler = () => fetchData();
    window.addEventListener("customerUpdated", handler);

    return () => window.removeEventListener("customerUpdated", handler);
  }, []);

  return (
    <div className="customers-page">

      {stats && (
        <div className="stats">
          <div className="card">
            <h3>Total Customers</h3>
            <h1>{stats.total}</h1>
          </div>

          <div className="card">
            <h3>New Today</h3>
            <h1>{stats.new_today}</h1>
          </div>

          <div className="card">
            <h3>New Customers %</h3>
            <h1>{stats.percent}%</h1>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{new Date(c.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}