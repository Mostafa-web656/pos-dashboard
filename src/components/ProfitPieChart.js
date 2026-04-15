// src/components/ProfitPieChart.js
import React, { useEffect, useState } from "react";
import axios from "axios"; // هنستخدم axios مباشرة
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ProfitPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/reports/monthly/"); // رابط API
        const branches = {};
        res.data.sales.forEach((sale) => {
          const profit = sale.total - sale.discount - sale.tax;
          if (branches[sale.branch_name]) {
            branches[sale.branch_name] += profit;
          } else {
            branches[sale.branch_name] = profit;
          }
        });

        const chartData = Object.keys(branches).map((branch) => ({
          name: branch,
          value: branches[branch],
        }));

        setData(chartData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfitData();
  }, []);

  return (
    <div style={{ marginTop: "50px" }}>
      <h2>Profit / Loss by Branch</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitPieChart;
