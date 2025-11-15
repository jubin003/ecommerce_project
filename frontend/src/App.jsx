import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionInfo from "./pages/Subscriptions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Home (normal user) */}
        <Route
          path="/user-home"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserHome />
            </ProtectedRoute>
          }
        />

        {/* Admin Home */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route path="/subscriptions" element={
        <ProtectedRoute allowedRoles={["user"]}>
        <SubscriptionInfo />
        </ProtectedRoute>} 
        />
      </Routes>
      

    </BrowserRouter>
  );
}

export default App;
