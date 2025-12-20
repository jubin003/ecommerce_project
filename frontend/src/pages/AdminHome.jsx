import { useState, useEffect } from "react";
import { logout } from "../utils/auth";
import AdminSongs from "./AdminSongs";
import AdminVinyls from "./AdminVinyls";
import AdminOrders from "./AdminOrders";
import API from "../api";
import Snowfall from "react-snowfall";

export default function AdminHome() {
  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, songs: 0, orders: 0, vinyls: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await API.get("/users");
        const songsRes = await API.get("/songs");
        const ordersRes = await API.get("/orders/all");
        const vinylsRes = await API.get("/vinyls");
        
        setStats({
          users: usersRes.data.length,
          songs: songsRes.data.length,
          orders: ordersRes.data.length,
          vinyls: vinylsRes.data.length,
        });
      } catch (err) {
        console.log("Error fetching stats:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, [view]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white" }}>
      <Snowfall color="#90D5FF" />
      
      {/* Header/Navigation */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        <h2 style={{ margin: 0 }}>🎵 Admin Dashboard</h2>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button
            onClick={() => setView("dashboard")}
            style={{
              padding: "10px 20px",
              background: view === "dashboard" ? "#1db954" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setView("songs")}
            style={{
              padding: "10px 20px",
              background: view === "songs" ? "#1db954" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            🎵 Songs
          </button>

          <button
            onClick={() => setView("vinyls")}
            style={{
              padding: "10px 20px",
              background: view === "vinyls" ? "#1db954" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            💿 Vinyls
          </button>

          <button
            onClick={() => setView("orders")}
            style={{
              padding: "10px 20px",
              background: view === "orders" ? "#1db954" : "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            📦 Orders
          </button>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              background: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px" }}>
        {/* Dashboard View */}
        {view === "dashboard" && (
          <div>
            <h2 style={{ marginBottom: "30px" }}>Overview</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "25px",
              }}
            >
              <div
                style={{
                  background: "#1a1a1a",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(29, 185, 84, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>👥</div>
                <h3 style={{ marginBottom: "10px", color: "#b3b3b3" }}>Total Users</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#1db954", margin: 0 }}>
                  {stats.users}
                </p>
              </div>

              <div
                style={{
                  background: "#1a1a1a",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(29, 185, 84, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎵</div>
                <h3 style={{ marginBottom: "10px", color: "#b3b3b3" }}>Total Songs</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#1db954", margin: 0 }}>
                  {stats.songs}
                </p>
              </div>

              <div
                style={{
                  background: "#1a1a1a",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(29, 185, 84, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>💿</div>
                <h3 style={{ marginBottom: "10px", color: "#b3b3b3" }}>Vinyls</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#1db954", margin: 0 }}>
                  {stats.vinyls}
                </p>
              </div>

              <div
                style={{
                  background: "#1a1a1a",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(29, 185, 84, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📦</div>
                <h3 style={{ marginBottom: "10px", color: "#b3b3b3" }}>Orders</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#1db954", margin: 0 }}>
                  {stats.orders}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Song Management View */}
        {view === "songs" && <AdminSongs />}

        {/* Vinyl Management View */}
        {view === "vinyls" && <AdminVinyls />}

        {/* Orders Management View */}
        {view === "orders" && <AdminOrders />}
      </div>
    </div>
  );
}