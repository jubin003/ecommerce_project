import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (vinylId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await API.put("/cart/update", { userId, vinylId, quantity: newQuantity });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (vinylId) => {
    try {
      await API.delete("/cart/remove", { data: { userId, vinylId } });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.vinyl?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        Loading cart...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "30px" }}>Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>Your cart is empty</p>
            <button
              onClick={() => navigate("/user-home")}
              style={{
                padding: "12px 24px",
                background: "#1db954",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div style={{ marginBottom: "30px" }}>
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    gap: "20px",
                    background: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    alignItems: "center",
                  }}
                >
                  {/* Vinyl Image */}
                  <img
                    src={
                      item.vinyl?.vinylImage?.startsWith("http")
                        ? item.vinyl.vinylImage
                        : `http://localhost:5001${item.vinyl?.vinylImage}`
                    }
                    alt="Vinyl"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Item Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0" }}>
                      {item.vinyl?.song?.title || "Unknown Song"}
                    </h3>
                    <p style={{ margin: "0 0 5px 0", color: "#b3b3b3" }}>
                      {item.vinyl?.song?.artist || "Unknown Artist"}
                    </p>
                    <p style={{ margin: 0, color: "#1db954", fontSize: "18px", fontWeight: "bold" }}>
                      ${item.vinyl?.price || 0}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => updateQuantity(item.vinyl._id, item.quantity - 1)}
                      style={{
                        width: "30px",
                        height: "30px",
                        background: "#333",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ width: "40px", textAlign: "center" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.vinyl._id, item.quantity + 1)}
                      style={{
                        width: "30px",
                        height: "30px",
                        background: "#333",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ width: "100px", textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                      ${((item.vinyl?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.vinyl._id)}
                    style={{
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div
              style={{
                background: "#1a1a1a",
                padding: "30px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 10px 0" }}>Total</h2>
                <p style={{ margin: 0, fontSize: "32px", color: "#1db954", fontWeight: "bold" }}>
                  ${calculateTotal()}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  padding: "15px 40px",
                  background: "#1db954",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}