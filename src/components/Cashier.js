import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Cashier.css";

export default function Cashier() {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(14);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    fetchProducts();

    const t = localStorage.getItem("taxRate");
    const e = localStorage.getItem("taxEnabled");

    if (t) setTaxRate(Number(t));
    if (e) setTaxEnabled(e === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("taxRate", taxRate);
    localStorage.setItem("taxEnabled", taxEnabled);
  }, [taxRate, taxEnabled]);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const res = await API.get("products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {

    if (product.stock <= 0) {
      return;
    }

    const exist = cart.find(i => i.id === product.id);

    if (exist) {

      setCart(
        cart.map(i =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );

    } else {

      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          qty: 1,
        }
      ]);

    }
  };

  // =========================
  // INCREASE
  // =========================
  const increase = (id) => {

    setCart(
      cart.map(i =>
        i.id === id
          ? { ...i, qty: i.qty + 1 }
          : i
      )
    );

  };

  // =========================
  // DECREASE
  // =========================
  const decrease = (id) => {

    setCart(
      cart
        .map(i =>
          i.id === id
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter(i => i.qty > 0)
    );

  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  // =========================
  // TOTALS
  // =========================
  const subtotal = cart.reduce(
    (a, b) => a + b.price * b.qty,
    0
  );

  const tax = taxEnabled
    ? (subtotal * taxRate) / 100
    : 0;

  const total = subtotal + tax;

  // =========================
  // PRINT
  // =========================
  const printInvoice = () => {

    const date = new Date().toLocaleString();

    const win = window.open(
      "",
      "PRINT",
      "width=400,height=600"
    );

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>

          <style>

            body{
              font-family:Arial;
              padding:20px;
            }

            h2{
              text-align:center;
            }

            table{
              width:100%;
              border-collapse:collapse;
              margin-top:20px;
            }

            td,th{
              border-bottom:1px solid #ddd;
              padding:8px;
              text-align:left;
            }

            .total{
              margin-top:20px;
              font-size:20px;
              font-weight:bold;
            }

          </style>
        </head>

        <body>

          <h2>🧾 POS SYSTEM</h2>

          <p>${date}</p>

          ${
            customerName
              ? `<p>
                  Customer:
                  ${customerName}
                  -
                  ${customerPhone}
                </p>`
              : ""
          }

          <table>

            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>

            ${cart.map(i => `
              <tr>
                <td>${i.name}</td>
                <td>${i.qty}</td>
                <td>
                  ${(i.price * i.qty).toFixed(2)}
                </td>
              </tr>
            `).join("")}

          </table>

          <p>
            Subtotal:
            ${subtotal.toFixed(2)}
          </p>

          <p>
            VAT:
            ${tax.toFixed(2)}
          </p>

          <div class="total">
            Total:
            ${total.toFixed(2)}
          </div>

        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  };

  // =========================
  // CHECKOUT
  // =========================
  const checkout = async () => {

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    let customerId = null;

    if (customerName && customerPhone) {

      try {

        const res = await API.post(
          "accounts/customers/check_or_create/",
          {
            name: customerName,
            phone: customerPhone,
          }
        );

        customerId = res.data.id;

      } catch (err) {
        console.log(err);
      }
    }

    const items = cart.map(i => ({
      product_id: Number(i.id),
      qty: Number(i.qty),
    }));

    try {

      await API.post(
        "sales/create/",
        {
          items,
          customer: customerId,
          tax_rate: taxEnabled
            ? taxRate
            : 0,
        }
      );

      printInvoice();

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");

      alert("Payment successful ✅");

      fetchProducts();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error
        || "Server error"
      );
    }
  };

  return (

    <div className="pos">

      {/* PRODUCTS */}
      <div className="products">

        <h2>🛒 Products</h2>

        <div className="grid">

          {products.map(p => (

            <div
              key={p.id}
              className={`product
                ${p.stock <= 0 ? "out" : ""}
                ${p.stock > 0 && p.stock < 5 ? "low" : ""}
              `}
              onClick={() => addToCart(p)}
            >

              <h3>{p.name}</h3>

              <p>{p.price} EGP</p>

              <small>
                Stock: {p.stock}
              </small>

            </div>

          ))}

        </div>

      </div>

      {/* CASHIER */}
      <div className="cart">

        <h2>🧾 Cashier</h2>

        {/* TAX */}
        <div className="tax-control">

          <label>

            <input
              type="checkbox"
              checked={taxEnabled}
              onChange={() =>
                setTaxEnabled(!taxEnabled)
              }
            />

            Enable Tax

          </label>

          {taxEnabled && (

            <input
              type="number"
              value={taxRate}
              onChange={(e) =>
                setTaxRate(
                  Number(e.target.value)
                )
              }
            />

          )}

        </div>

        {/* CUSTOMER */}
        <div className="customer-info">

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(
                e.target.value
              )
            }
          />

        </div>

        {/* CART ITEMS */}
        <div className="cart-items">

          {cart.map(i => (

            <div
              key={i.id}
              className="cart-item slide-in"
            >

              <span>{i.name}</span>

              <div className="qty-controls">

                <button
                  onClick={() =>
                    decrease(i.id)
                  }
                >
                  ➖
                </button>

                <span>{i.qty}</span>

                <button
                  onClick={() =>
                    increase(i.id)
                  }
                >
                  ➕
                </button>

              </div>

              <span>
                {(i.price * i.qty).toFixed(2)}
              </span>

              <button
                className="delete"
                onClick={() =>
                  removeItem(i.id)
                }
              >
                🗑
              </button>

            </div>

          ))}

        </div>

        {/* SUMMARY */}
        <div className="summary">

          <p>
            Subtotal:
            {subtotal.toFixed(2)}
          </p>

          <p>
            VAT:
            {tax.toFixed(2)}
          </p>

          <h2>
            Total:
            {total.toFixed(2)}
          </h2>

        </div>

        {/* CHECKOUT */}
        <button
          className="checkout"
          onClick={checkout}
        >
          💳 Pay & Print
        </button>

      </div>

    </div>
  );
}