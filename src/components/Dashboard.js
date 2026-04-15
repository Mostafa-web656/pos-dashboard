import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-6 p-6">

      {/* التقارير اليومية */}
      <div
        onClick={() => nav("/reports/daily")}
        className="bg-blue-600 text-white p-8 rounded-xl cursor-pointer hover:scale-105 text-center text-xl"
      >
        📊 التقارير اليومية
      </div>

      {/* التقارير الشهرية */}
      <div
        onClick={() => nav("/reports/monthly")}
        className="bg-green-600 text-white p-8 rounded-xl cursor-pointer hover:scale-105 text-center text-xl"
      >
        📅 التقارير الشهرية
      </div>

    </div>
  );
}
