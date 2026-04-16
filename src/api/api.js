import React from "react";
import API from "./axios";

// 📦 Products
export const fetchProducts = async () => {
  try {
    const res = await API.get("products/");
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const res = await API.post("products/", data);
    return res.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// 💰 Sales
export const createSale = async (data) => {
  try {
    const res = await API.post("sales/create/", data);
    return res.data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
};

// 📊 Reports
export const getDailyReport = async () => {
  try {
    const res = await API.get("sales/reports/daily/");
    return res.data;
  } catch (error) {
    console.error("Error fetching daily report:", error);
    throw error;
  }
};

export const getMonthlyReport = async () => {
  try {
    const res = await API.get("sales/reports/monthly/");
    return res.data;
  } catch (error) {
    console.error("Error fetching monthly report:", error);
    throw error;
  }
};

export default API;