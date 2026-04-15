import { useState } from "react";
import API from "../api/axios";

export default function RegisterCompany() {
  const [companyName, setCompanyName] = useState("");
  const [plan, setPlan] = useState("basic");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("accounts/register-company/", {
        company_name: companyName,
        plan,
        username,
        password,
      });
      setMessage(`Company created: ${res.data.company}`);
    } catch (err) {
      setMessage(err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  };

  return (
    <div>
      <h2>Register Company</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
        <select value={plan} onChange={e => setPlan(e.target.value)}>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
