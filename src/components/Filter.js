import React, { useState } from "react";

const Filter = ({ onFilter }) => {
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");

  const applyFilter = () => {
    onFilter({ branch, date });
  };

  return (
    <div style={{ marginBottom:"20px" }}>
      <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ padding:"10px", fontSize:"16px", marginRight:"10px", borderRadius:"8px" }}>
        <option value="">All Branches</option>
        <option value="Cairo">Cairo</option>
        <option value="Alex">Alex</option>
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding:"10px", fontSize:"16px", marginRight:"10px", borderRadius:"8px" }} />
      <button onClick={applyFilter}>Apply Filter</button>
    </div>
  );
};

export default Filter;
