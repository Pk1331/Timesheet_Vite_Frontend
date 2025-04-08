import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "../components/Auth/Login"
import UserDashboard from "../components/Dashboards/UserDashboard"
import TeamLeaderDashboard from "../components/Dashboards/TeamLeaderDashboard"
import AdminDashboard from "../components/Dashboards/AdminDashboard"
import SuperAdminDashboard from "../components/Dashboards/SuperAdminDashboard"
import PrivateRoute from "./PrivateRoute"
import NotFound from "../components/Auth/NotFound"
import ChangePassword from "../components/Auth/ChangePassword"
import { useEffect } from "react"
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login) */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/user-dashboard/*"
          element={<PrivateRoute element={<UserDashboard />} />}
        />
        <Route
          path="/team-leader-dashboard/*"
          element={<PrivateRoute element={<TeamLeaderDashboard />} />}
        />
        <Route
          path="/admin-dashboard/*"
          element={<PrivateRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/super-admin-dashboard/*"
          element={<PrivateRoute element={<SuperAdminDashboard />} />}
        />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
