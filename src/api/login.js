import API from "./axios";

const loginUser = async ({ username, password }) => {
  const res = await API.post("token/", { username, password });
  return res.data; // { access, refresh }
};

export const handleLogin = async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const res = await loginUser({ username, password });
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    alert("تم تسجيل الدخول ✅");
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.detail || "بيانات غلط");
  }
};