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

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = useCallback(async () => {

    try {

      const res = await api.get(
        `products/?search=${search}`
      );

      setProducts(res.data);

    } catch (err) {

      console.error(err);

    }

  }, [search]);

  useEffect(() => {

    const timeout = setTimeout(() => {

      fetchProducts();

    }, 300);

    return () => clearTimeout(timeout);

  }, [fetchProducts]);

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

      console.error(err);

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

      await api.put(
        `products/${editProduct.id}/`,
        {
          name,
          price,
          stock,
        }
      );

      setShowEditModal(false);

      setEditProduct(null);

      setName("");
      setPrice("");
      setStock("");

      fetchProducts();

    } catch (err) {

      console.error(err);

    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
      "هل تريد حذف المنتج ؟"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`products/${id}/`);

      setProducts(
        products.filter((p) => p.id !== id)
      );

    } catch (err) {

      console.error(err);

      alert("حدث خطأ أثناء الحذف");

    }
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">

        <h2>📦 إدارة المنتجات</h2>

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
        placeholder="🔍 ابحث عن منتج..."
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

            <th>الإجراءات</th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: 20
                }}
              >
                لا توجد منتجات
              </td>

            </tr>

          ) : (

            products.map((p) => (

              <tr key={p.id}>

                <td>{p.name}</td>

                <td>{p.price} ج</td>

                <td>

                  <span
                    style={{
                      color:
                        p.stock <= 5
                          ? "red"
                          : "#22c55e",
                      fontWeight: "bold",
                    }}
                  >
                    {p.stock}
                  </span>

                </td>

                <td
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

                  {/* EDIT */}
                  <button
                    onClick={() => openEditModal(p)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ✏️ تعديل
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    🗑 حذف
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

      {/* ========================= */}
      {/* ADD MODAL */}
      {/* ========================= */}

      {showAddModal && (

        <div className="modal">

          <div className="modal-content">

            <h3>➕ إضافة منتج</h3>

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

              <button onClick={addProduct}>
                حفظ
              </button>

              <button
                className="cancel"
                onClick={() => setShowAddModal(false)}
              >
                إلغاء
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================= */}
      {/* EDIT MODAL */}
      {/* ========================= */}

      {showEditModal && (

        <div className="modal">

          <div className="modal-content">

            <h3>✏️ تعديل المنتج</h3>

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

              <button onClick={saveEdit}>
                حفظ التعديل
              </button>

              <button
                className="cancel"
                onClick={() => setShowEditModal(false)}
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