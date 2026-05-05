import React, { useEffect, useState, useCallback } from "react";
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
  const [unitType, setUnitType] = useState("piece");
  const [lowStock, setLowStock] = useState(5);

  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get(`products/?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(t);
  }, [search, fetchProducts]);

  // ➕ ADD PRODUCT
  const addProduct = async () => {
    try {
      await api.post("products/", {
        name,
        price,
        stock,
        unit_type: unitType,
        low_stock_alert: lowStock,
      });

      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ OPEN EDIT
  const openEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setUnitType(product.unit_type || "piece");
    setLowStock(product.low_stock_alert || 5);
    setShowEditModal(true);
  };

  // 💾 SAVE EDIT
  const saveEdit = async () => {
    try {
      await api.put(`products/${editProduct.id}/`, {
        name,
        price,
        stock,
        unit_type: unitType,
        low_stock_alert: lowStock,
      });

      setShowEditModal(false);
      setEditProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`products/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setUnitType("piece");
    setLowStock(5);
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

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>السعر</th>
            <th>المخزون</th>
            <th>الحالة</th>
            <th>إجراء</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const low = p.stock <= p.low_stock_alert;
            const out = p.stock <= 0;

            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price} ج</td>

                <td>
                  {p.stock} {p.unit_type}
                </td>

                <td>
                  {out && <span style={{ color: "red" }}>Out</span>}
                  {!out && low && (
                    <span style={{ color: "orange" }}>Low</span>
                  )}
                  {!out && !low && (
                    <span style={{ color: "green" }}>OK</span>
                  )}
                </td>

                <td>
                  <button onClick={() => openEditModal(p)}>تعديل</button>
                  <button onClick={() => deleteProduct(p.id)}>حذف</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ➕ ADD MODAL */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">

            <h3>إضافة منتج</h3>

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المنتج" />
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر" />
            <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="المخزون" />

            {/* 🔥 UNIT TYPE */}
            <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
              <option value="piece">قطعة</option>
              <option value="gram">جرام</option>
              <option value="liter">لتر</option>
            </select>

            <input
              value={lowStock}
              onChange={(e) => setLowStock(e.target.value)}
              placeholder="حد التنبيه"
            />

            <div className="modal-actions">
              <button onClick={addProduct}>حفظ</button>
              <button onClick={() => setShowAddModal(false)}>إلغاء</button>
            </div>

          </div>
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">

            <h3>تعديل المنتج</h3>

            <input value={name} onChange={(e) => setName(e.target.value)} />
            <input value={price} onChange={(e) => setPrice(e.target.value)} />
            <input value={stock} onChange={(e) => setStock(e.target.value)} />

            <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
              <option value="piece">قطعة</option>
              <option value="gram">جرام</option>
              <option value="liter">لتر</option>
            </select>

            <input value={lowStock} onChange={(e) => setLowStock(e.target.value)} />

            <div className="modal-actions">
              <button onClick={saveEdit}>حفظ</button>
              <button onClick={() => setShowEditModal(false)}>إلغاء</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}