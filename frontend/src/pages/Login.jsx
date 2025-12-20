import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Snowfall from "react-snowfall";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user._id);

      if (res.data.user.role === "admin") navigate("/admin-home");
      else navigate("/user-home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", registerForm);
      alert("Registered successfully! Please login.");
      setIsLogin(true);
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white", position: "relative" }}>
      <Snowfall color="#90D5FF" />
      
      {/* Header */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "20px 40px",
          borderBottom: "1px solid #333",
        }}
      >
        <h2 style={{ margin: 0 }}>🎵 Music Store</h2>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            padding: "40px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "450px",
            border: "1px solid #333",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Toggle Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "30px",
              background: "#0f0f0f",
              padding: "5px",
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: "12px",
                background: isLogin ? "#1db954" : "transparent",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: "12px",
                background: !isLogin ? "#1db954" : "transparent",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s",
              }}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h2 style={{ marginBottom: "25px", textAlign: "center" }}>Welcome Back</h2>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#b3b3b3" }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#0f0f0f",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#b3b3b3" }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#0f0f0f",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#1db954",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#1ed760";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#1db954";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Login
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister}>
              <h2 style={{ marginBottom: "25px", textAlign: "center" }}>Create Account</h2>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#b3b3b3" }}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#0f0f0f",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#b3b3b3" }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#0f0f0f",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#b3b3b3" }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#0f0f0f",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#1db954",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#1ed760";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#1db954";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}