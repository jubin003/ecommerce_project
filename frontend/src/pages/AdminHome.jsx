// frontend/src/pages/AdminHome.jsx

import { logout } from "../utils/auth";
export default function AdminHome() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome Admin!</h2>

       <button 
        onClick={logout} 
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Logout
      </button>
    </div>
  );
}
