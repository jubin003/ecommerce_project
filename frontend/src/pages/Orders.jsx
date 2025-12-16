import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/user/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#FFA726",
      processing: "#42A5F5",
      shipped: "#66BB6A",
      delivered: "#1db954",
      cancelled: "#EF5350",
    };
    return colors[status] || "#888";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        Loading orders...
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1>My Orders</h1>
          <button
            onClick={() => navigate("/user-home")}
            style={{
              padding: "10px 20px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>No orders yet</p>
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
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#1a1a1a",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  paddingBottom: "15px",
                  borderBottom: "1px solid #333",
                }}
              >
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#b3b3b3", fontSize: "14px" }}>
                    Order ID: {order._id}
                  </p>
                  <p style={{ margin: 0, color: "#b3b3b3", fontSize: "14px" }}>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      background: getStatusColor(order.status),
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {order.status}
                  </span>
                  <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#1db954" }}>
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Items:</h3>
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      gap: "15px",
                      padding: "10px",
                      background: "#0f0f0f",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={
                        item.vinyl?.vinylImage?.startsWith("http")
                          ? item.vinyl.vinylImage
                          : `http://localhost:5001${item.vinyl?.vinylImage}`
                      }
                      alt="Vinyl"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                        {item.vinyl?.song?.title || "Unknown Song"}
                      </p>
                      <p style={{ margin: 0, color: "#b3b3b3", fontSize: "14px" }}>
                        {item.vinyl?.song?.artist || "Unknown Artist"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 5px 0" }}>Qty: {item.quantity}</p>
                      <p style={{ margin: 0, color: "#1db954", fontWeight: "bold" }}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div
                style={{
                  padding: "15px",
                  background: "#0f0f0f",
                  borderRadius: "8px",
                }}
              >
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#b3b3b3" }}>
                  Shipping Address:
                </p>
                <p style={{ margin: 0 }}>{order.shippingAddress}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}