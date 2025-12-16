import { useState, useEffect } from "react";
import { logout } from "../utils/auth";
import AdminSongs from "./AdminSongs";
import AdminVinyls from "./AdminVinyls";
import API from "../api";

export default function AdminHome() {
  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, songs: 0, subscriptions: 0, orders: 0, vinyls: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await API.get("/users");
        const songsRes = await API.get("/songs");
        const subsRes = await API.get("/subscriptions");
        const ordersRes = await API.get("/orders/all");
        const vinylsRes = await API.get("/vinyls");
        
        setStats({
          users: usersRes.data.length,
          songs: songsRes.data.length,
          subscriptions: subsRes.data.length,
          orders: ordersRes.data.length,
          vinyls: vinylsRes.data.length,
        });
      } catch (err) {
        console.log("Error fetching stats:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to bottom right, #2b2d42, #8d99ae)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "30px",
          borderRadius: "15px",
          color: "white",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Admin Dashboard</h1>

        {/* Navigation Buttons */}
        <div style={{ marginBottom: "25px", textAlign: "center" }}>
          <button
            onClick={() => setView("dashboard")}
            style={{
              padding: "12px 25px",
              marginRight: "10px",
              background: view === "dashboard" ? "#ef233c" : "#666",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => setView("songs")}
            style={{
              padding: "12px 25px",
              marginRight: "10px",
              background: view === "songs" ? "#d90429" : "#666",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Manage Songs
          </button>

          <button
            onClick={() => setView("vinyls")}
            style={{
              padding: "12px 25px",
              marginRight: "10px",
              background: view === "vinyls" ? "#d90429" : "#666",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Manage Vinyls
          </button>

          <button
            onClick={logout}
            style={{
              padding: "12px 25px",
              background: "#000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Dashboard View */}
        {view === "dashboard" && (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Overview</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "25px",
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>Total Users</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.users}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>Total Songs</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.songs}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>Vinyls</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.vinyls}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>Orders</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.orders}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>Subscriptions</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.subscriptions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Song Management View */}
        {view === "songs" && <AdminSongs />}

        {/* Vinyl Management View */}
        {view === "vinyls" && <AdminVinyls />}
      </div>
    </div>
  );
}