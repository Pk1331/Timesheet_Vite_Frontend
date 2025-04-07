import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../Common/DashboardLayout"
import DashboardRoutes from "../Common/DashboardRoutes"

const UserDashboard = () => {
  const navigate = useNavigate()
  const [usertype, setUsertype] = useState("")

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")
    setUsertype(usertypeParam)
  }, [])

  const handleSidebarClick = (section) => {
    navigate(`/user-dashboard/${section}`)
  }

  return (
    <DashboardLayout
      handleSidebarClick={handleSidebarClick}
      usertype={usertype}
    >
      <DashboardRoutes usertype="User" />
    </DashboardLayout>
  )
}

export default UserDashboard
