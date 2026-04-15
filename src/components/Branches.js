import { useState, useEffect } from "react";
import * as api from "../api/api";


export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await API.get("accounts/branches/");
        setBranches(res.data);
      } catch (err) {
        setError(err.response?.data ? JSON.stringify(err.response.data) : err.message);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div>
      <h2>Branches</h2>
      {error && <p>{error}</p>}
      <ul>
        {branches.map(branch => (
          <li key={branch.id}>{branch.name}</li>
        ))}
      </ul>
    </div>
  );
}
