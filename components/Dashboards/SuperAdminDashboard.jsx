import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../Common/DashboardLayout"
import DashboardRoutes from "../Common/DashboardRoutes"

const SuperAdminDashboard = () => {
  const navigate = useNavigate()
  const [usertype, setUsertype] = useState("")

  useEffect(() => {
    setUsertype(localStorage.getItem("usertype") || "")
  }, [])

  const handleSidebarClick = (section) => {
    navigate(`/super-admin-dashboard/${section}`)
  }

  return (
    <DashboardLayout handleSidebarClick={handleSidebarClick} usertype={usertype}>
      <DashboardRoutes usertype={usertype} />
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
