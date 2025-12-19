import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Checkout() {
  const [cart, setCart] = useState({ items: [] });
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${userId}`);
      setCart(res.data);
      if (!res.data.items || res.data.items.length === 0) {
        alert("Your cart is empty");
        navigate("/cart");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.vinyl?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  const handlePayWithKhalti = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/payment/initialize-khalti", {
        userId,
        shippingAddress,
        website_url: window.location.origin,
      });

      if (res.data.success && res.data.payment.payment_url) {
        // Redirect to Khalti payment page
        window.location.href = res.data.payment.payment_url;
      } else {
        alert("Failed to initialize payment");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "30px" }}>Checkout</h1>

        {/* Order Summary */}
        <div
          style={{
            background: "#1a1a1a",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Order Summary</h2>
          {cart.items.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #333",
              }}
            >
              <div>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                  {item.vinyl?.song?.title || "Unknown Song"}
                </p>
                <p style={{ margin: 0, color: "#b3b3b3", fontSize: "14px" }}>
                  Quantity: {item.quantity}
                </p>
              </div>
              <p style={{ margin: 0, color: "#1db954", fontWeight: "bold" }}>
                ${((item.vinyl?.price || 0) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            <span>Total:</span>
            <span style={{ color: "#1db954" }}>${calculateTotal()}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <form onSubmit={handlePayWithKhalti}>
          <div
            style={{
              background: "#1a1a1a",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Shipping Information</h2>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Shipping Address *
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              rows="4"
              placeholder="Enter your complete shipping address..."
              style={{
                width: "100%",
                padding: "12px",
                background: "#0f0f0f",
                color: "white",
                border: "1px solid #333",
                borderRadius: "8px",
                fontSize: "16px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Payment Method */}
          <div
            style={{
              background: "#1a1a1a",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Payment Method</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "15px",
                background: "#0f0f0f",
                borderRadius: "8px",
                border: "2px solid #5c2d91",
              }}
            >
              <img
                src="https://web.khalti.com/static/img/logo1.png"
                alt="Khalti"
                style={{ height: "40px" }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>Khalti Payment</p>
                <p style={{ margin: 0, fontSize: "14px", color: "#b3b3b3" }}>
                  Pay securely with Khalti
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              style={{
                padding: "12px 30px",
                background: "#333",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 30px",
                background: loading ? "#666" : "#5c2d91",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {loading ? "Processing..." : "Pay with Khalti"}
              {!loading && (
                <img
                  src="https://web.khalti.com/static/img/logo1.png"
                  alt="Khalti"
                  style={{ height: "20px" }}
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}