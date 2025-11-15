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
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Welcome Admin!</h2>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setView("dashboard")}
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView("songs")}
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Manage Songs
        </button>
        <button
          onClick={logout}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {view === "dashboard" && (
          <div>
            <h3>Admin Dashboard</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "20px" }}>
              <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "150px" }}>
                <h4>Total Users</h4>
                <p>{stats.users}</p>
              </div>
              <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "150px" }}>
                <h4>Total Songs</h4>
                <p>{stats.songs}</p>
              </div>
              <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "150px" }}>
                <h4>Subscription Plans</h4>
                <p>{stats.subscriptions}</p>
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              <p>Use the buttons above to manage songs or view other admin features.</p>
            </div>
          </div>
        )}

        {view === "songs" && <AdminSongs />}
      </div>
    </div>
  );
}
