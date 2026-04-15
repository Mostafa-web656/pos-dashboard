import React, { useState } from "react";
import API from "../api/axios";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("تم تسجيل الدخول ✅");

      window.location.href = "/"; // غيرها لو عندك dashboard route
    } catch (err) {
      console.log(err);
      alert("❌ بيانات غلط");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>POS System</h2>
        <p>سجل دخولك لإدارة محلك</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}