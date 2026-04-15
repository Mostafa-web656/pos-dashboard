import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./ManageProducts.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [search, setSearch] = useState("");

  // 🔄 جلب المنتجات (مع debounce)
  const fetchProducts = async () => {
    try {
      const res = await api.get(`products/?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };



  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // ➕ إضافة
  const addProduct = async () => {
    try {
      await api.post("products/", { name, price, stock });
      setShowAddModal(false);
      setName(""); setPrice(""); setStock("");
      fetchProducts(); // ✅ دلوقتي fetchProducts موجودة
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ تعديل
  const openEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`products/${editProduct.id}/`, { name, price, stock });
      setShowEditModal(false);
      setEditProduct(null);
      setName(""); setPrice(""); setStock("");
      fetchProducts(); // ✅ موجودة
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 حذف
  const deleteProduct = async (id) => {
    try {
      await api.delete(`products/${id}/`);
      fetchProducts(); // ✅ موجودة
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>إدارة المنتجات</h2>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          ➕ إضافة منتج
        </button>
      </div>

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
              <td className="options-cell">
                <div className="dropdown" onClick={e => e.stopPropagation()}>
                  <button className="dropbtn">⋮</button>
                  <div className="dropdown-content">
                    <button onClick={() => openEditModal(p)}>تعديل</button>
                    <button onClick={() => deleteProduct(p.id)}>حذف</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🪟 مودال الإضافة */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>إضافة منتج</h3>
            <input placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="السعر" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input placeholder="المخزون" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <div className="modal-actions">
              <button onClick={addProduct}>حفظ</button>
              <button className="cancel" onClick={() => setShowAddModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 🪟 مودال التعديل */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>تعديل المنتج</h3>
            <input placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="السعر" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input placeholder="المخزون" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <div className="modal-actions">
              <button onClick={saveEdit}>حفظ</button>
              <button className="cancel" onClick={() => setShowEditModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}