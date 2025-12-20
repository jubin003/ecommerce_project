import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await API.get(`/payment/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.payment.order);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0f0f",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #333",
              borderTop: "4px solid #1db954",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "#1a1a1a",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#1db954",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 30px",
          }}
        >
          <span style={{ fontSize: "50px" }}>✓</span>
        </div>

        <h1 style={{ marginBottom: "15px", color: "#1db954" }}>Payment Successful!</h1>
        <p style={{ fontSize: "18px", marginBottom: "30px", color: "#b3b3b3" }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {order && (
          <div
            style={{
              background: "#0f0f0f",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "30px",
              textAlign: "left",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#888" }}>
              Order ID: {order._id}
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#888" }}>
              Total Amount: <span style={{ color: "#1db954", fontWeight: "bold" }}>Rs. {order.totalAmount.toFixed(2)}</span>
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
              Status: <span style={{ color: "#FFA726", fontWeight: "bold" }}>Processing</span>
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "12px 30px",
              background: "#1db954",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/user-home")}
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
            Continue Shopping
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}