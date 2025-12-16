import { useEffect, useState } from "react";
import API from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      alert("Order status updated successfully!");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
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
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "25px" }}>Order Management</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.7 }}>No orders yet</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#0f0f0f",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #333",
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#888" }}>
                    Order ID: {order._id}
                  </p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>
                    Customer: {order.user?.name || "Unknown"}
                  </p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#b3b3b3" }}>
                    Email: {order.user?.email || "N/A"}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
                    Date: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold", color: "#1db954" }}>
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        background: getStatusColor(order.status),
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ marginBottom: "15px", fontSize: "16px" }}>Order Items:</h4>
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      gap: "15px",
                      padding: "12px",
                      background: "#1a1a1a",
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
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div
                style={{
                  padding: "15px",
                  background: "#1a1a1a",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#888" }}>
                  Shipping Address:
                </p>
                <p style={{ margin: 0 }}>{order.shippingAddress}</p>
              </div>

              {/* Status Update Controls */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => updateOrderStatus(order._id, "pending")}
                  disabled={order.status === "pending"}
                  style={{
                    padding: "10px 20px",
                    background: order.status === "pending" ? "#555" : "#FFA726",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: order.status === "pending" ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Pending
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, "processing")}
                  disabled={order.status === "processing"}
                  style={{
                    padding: "10px 20px",
                    background: order.status === "processing" ? "#555" : "#42A5F5",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: order.status === "processing" ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Processing
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, "shipped")}
                  disabled={order.status === "shipped"}
                  style={{
                    padding: "10px 20px",
                    background: order.status === "shipped" ? "#555" : "#66BB6A",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: order.status === "shipped" ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Shipped
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, "delivered")}
                  disabled={order.status === "delivered"}
                  style={{
                    padding: "10px 20px",
                    background: order.status === "delivered" ? "#555" : "#1db954",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: order.status === "delivered" ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Delivered
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, "cancelled")}
                  disabled={order.status === "cancelled"}
                  style={{
                    padding: "10px 20px",
                    background: order.status === "cancelled" ? "#555" : "#EF5350",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: order.status === "cancelled" ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}