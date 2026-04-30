import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function DailyReport() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get("sales/reports/daily/");
      console.log("DAILY DATA:", res.data); // 👈 debug مهم
      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("خطأ في تحميل التقرير");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <h2 style={{ padding: 40 }}>Loading...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>📊 Daily Report</h1>

      {/* CARDS */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>💰 Sales Today</h3>
          <h1>{data.total_sales || 0} EGP</h1>
        </div>

        <div style={styles.card}>
          <h3>🧾 Orders</h3>
          <h1>{data.orders || 0}</h1>
        </div>

        <div style={styles.card}>
          <h3>🔥 Best Hour</h3>
          <h1>
            {data.best_hour
              ? `${data.best_hour.hour}:00`
              : "-"}
          </h1>
        </div>
      </div>

      {/* CHART */}
      <div style={styles.chart}>
        <h2>📈 Sales by Hour</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chart && data.chart.length ? data.chart : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* لو مفيش بيانات */}
        {(!data.chart || data.chart.length === 0) && (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            ⚠️ No data for today
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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