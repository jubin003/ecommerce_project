// frontend/src/pages/AdminHome.jsx
import { useState, useEffect } from "react";
import { logout } from "../utils/auth";
import AdminSongs from "./AdminSongs";
import API from "../api";

export default function AdminHome() {
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'songs'
  const [stats, setStats] = useState({ users: 0, songs: 0, subscriptions: 0 });

  // Fetch basic stats for dashboard
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await API.get("/users"); // all users
        const songsRes = await API.get("/songs"); // all songs
        const subsRes = await API.get("/subscriptions"); // all subscription plans
        setStats({
          users: usersRes.data.length,
          songs: songsRes.data.length,
          subscriptions: subsRes.data.length,
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
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #2b2d42, #8d99ae)",
        padding: "20px",
      }}
    >
      {/* MAIN WRAPPER */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "30px",
          borderRadius: "15px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

        {/* BUTTONS */}
        <div style={{ marginBottom: "25px" }}>
          <button
            onClick={() => setView("dashboard")}
            style={{
              padding: "12px 25px",
              marginRight: "10px",
              background: "#ef233c",
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
              background: "#d90429",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Manage Songs
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

        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <div>
            <h2>Overview</h2>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                marginTop: "25px",
                flexWrap: "wrap",
              }}
            >
              {/* CARD 1 */}
              <div
                style={{
                  width: "200px",
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                }}
              >
                <h3>Total Users</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.users}
                </p>
              </div>

              {/* CARD 2 */}
              <div
                style={{
                  width: "200px",
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                }}
              >
                <h3>Total Songs</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {stats.songs}
                </p>
              </div>

              {/* CARD 3 */}
              <div
                style={{
                  width: "200px",
                  padding: "20px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
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

        {/* SONG MANAGEMENT VIEW */}
        {view === "songs" && <AdminSongs />}
      </div>
    </div>
  );
}
