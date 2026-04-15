import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./ManageProducts.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [search, setSearch] = useState("");

  // 🔄 جلب المنتجات مع debounce
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`products/?search=${search}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };

    const timeout = setTimeout(fetchProducts, 300); // 300ms debounce
    return () => clearTimeout(timeout);
  }, [search]);

  // ➕ إضافة منتج
  const addProduct = async () => {
    try {
      await api.post("products/", { name, price, stock });
      setShowModal(false);
      setName("");
      setPrice("");
      setStock("");
      // تحديث القائمة بعد الإضافة
      const res = await api.get(`products/?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Add product error:", err.response?.data || err.message);
    }
  };

  // 🗑 حذف منتج
  const deleteProduct = async (id) => {
    try {
      await api.delete(`products/${id}/`);
      const res = await api.get(`products/?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Delete product error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>إدارة المنتجات</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ إضافة منتج
        </button>
      </div>

      {/* 🔍 البحث */}
      <input
        className="search"
        placeholder="🔍 ابحث عن منتج"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>السعر</th>
            <th>المخزون</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price} ج</td>
              <td>{p.stock}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(p.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🪟 مودال الإضافة */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>إضافة منتج</h3>

            <input
              placeholder="اسم المنتج"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="السعر"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              placeholder="المخزون"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={addProduct}>حفظ</button>
              <button
                className="cancel"
                onClick={() => setShowModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}