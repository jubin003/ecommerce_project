import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/login"); // redirect to login after registration
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
 <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          background: "#171717",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          border: "1px solid #222",
          boxShadow: "0 0 20px rgba(0,255,100,0.15)"
        }}
      >
        <h2 style={{ marginBottom: "25px", fontSize: "28px" }}>Create Account</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#111",
              color: "white",
              outline: "none"
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#111",
              color: "white",
              outline: "none"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#111",
              color: "white",
              outline: "none"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#1db954",
              border: "none",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.25s"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.boxShadow = "0 0 12px rgba(0,255,100,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: "15px", opacity: 0.7 }}>
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#1db954", marginLeft: "5px", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
