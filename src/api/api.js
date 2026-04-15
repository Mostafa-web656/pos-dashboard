import API from "./axios";

// منتجات
export const fetchProducts = async () => {
  const res = await API.get("products/");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await API.post("products/", data);
  return res.data;
};

// بيع
export const createSale = async (data) => {
  const res = await API.post("sales/create/", data);
  return res.data;
};

// تقارير
export const getDailyReport = async () => {
  const res = await API.get("sales/reports/daily/");
  return res.data;
};

export const getMonthlyReport = async () => {
  const res = await API.get("sales/reports/monthly/");
  return res.data;
};


export default API;