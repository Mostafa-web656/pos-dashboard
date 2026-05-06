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
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH PRODUCTS (SAFE)
  // =========================
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `products/?search=${search || ""}`
      );

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.error("Products error:", err.response?.data || err.message);
      setProducts([]); // 🔥 منع كراش UI
    } finally {
      setLoading(false);
    }
  }, [search]);

  // =========================
  // DEBOUNCE SEARCH
  // =========================
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, fetchProducts]);

  // =========================
  // ADD PRODUCT
  // =========================
  const addProduct = async () => {
    try {
      await api.post("products/", {
        name,
        price,
        stock,
      });

      setShowAddModal(false);
      setName("");
      setPrice("");
      setStock("");

      fetchProducts();

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // =========================
  // OPEN EDIT
  // =========================
  const openEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setShowEditModal(true);
  };

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async () => {
    try {
      await api.put(`products/${editProduct.id}/`, {
        name,
        price,
        stock,
      });

      setShowEditModal(false);
      setEditProduct(null);
      setName("");
      setPrice("");
      setStock("");

      fetchProducts();

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    try {
      await api.delete(`products/${id}/`);
      fetchProducts();

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="container">

      <div className="header">
        <h2>إدارة المنتجات</h2>

        <button
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          ➕ إضافة منتج
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="🔍 ابحث عن منتج"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* TABLE */}
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
              <td>{p.price}</td>
              <td>{p.stock}</td>

              <td>
                <button onClick={() => openEditModal(p)}>
                  تعديل
                </button>

                <button onClick={() => deleteProduct(p.id)}>
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD MODAL */}
      {showAddModal && (
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

            <button onClick={addProduct}>حفظ</button>
            <button onClick={() => setShowAddModal(false)}>
              إلغاء
            </button>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">

            <h3>تعديل المنتج</h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <button onClick={saveEdit}>حفظ</button>
            <button onClick={() => setShowEditModal(false)}>
              إلغاء
            </button>

          </div>
        </div>
      )}

    </div>
  );
}