import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";

function App() {
  const role = localStorage.getItem("role"); // 'user' or 'admin'

  return (
    <Router>
      <Routes>
        <Route path="/musify" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-home" element={role === "user" ? <UserHome /> : <Navigate to="/login" />} />
        <Route path="/admin-home" element={role === "admin" ? <AdminHome /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
