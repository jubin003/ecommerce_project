import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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

  return (
<div style={{
      height: "100vh",
      width: "100vw",
      background: "#0d0d0d",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontFamily: "Poppins, sans-serif"
    }}>
      
      <h1 style={{ marginBottom: "30px", fontSize: "32px" }}>Login</h1>

      <form 
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          maxWidth: "600px",
          minWidth: "350px"
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            fontSize: "16px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            fontSize: "16px"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            background: "#6C5CE7",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s"
          }}
          onMouseOver={(e) => (e.target.style.background = "#7d6ff3")}
          onMouseOut={(e) => (e.target.style.background = "#6C5CE7")}
        >
          Login
        </button>
      </form>

    </div>
  );
}
