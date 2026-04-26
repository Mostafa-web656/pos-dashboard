import { useState } from "react";
import API from "./axios";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      const res = await API.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("تم تسجيل الدخول ✅");

      // مثال: تحويل للداشبورد
      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.detail ||
        "خطأ في تسجيل الدخول أو مشكلة في السيرفر"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>

        <input
          name="username"
          placeholder="Username"
          style={styles.input}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          style={styles.input}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  form: {
    padding: 30,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: 300,
  },
  input: {
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
  },
  button: {
    padding: 10,
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};