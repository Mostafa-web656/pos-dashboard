import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function MonthlyReport() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // ✅ حل مشكلة الـ warning
  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(
        `sales/reports/monthly/?month=${month}&year=${year}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("خطأ في تحميل التقرير الشهري");
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) return <h2 style={{ padding: 40 }}>Loading...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>📊 Monthly Report</h1>

      {/* اختيار الشهر */}
      <div style={{ marginBottom: 20 }}>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          style={{ marginLeft: 10 }}
        />
      </div>

      {/* كروت */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>💰 Total</h3>
          <h1>{data.total} EGP</h1>
        </div>

        <div style={styles.card}>
          <h3>🧾 Orders</h3>
          <h1>{data.count}</h1>
        </div>

        <div style={styles.card}>
          <h3>📈 Average</h3>
          <h1>{data.average}</h1>
        </div>

        <div style={styles.card}>
          <h3>🔥 Best Day</h3>
          <h1>{data.best_day?.day || "-"}</h1>
        </div>
      </div>

      {/* رسم */}
      <div style={styles.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chart || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line dataKey="total" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
    marginTop: 20
  },
  card: {
    background: "#111827",
    color: "white",
    padding: 25,
    borderRadius: 15,
    textAlign: "center"
  },
  chart: {
    background: "#111827",
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
    color: "white"
  }
};