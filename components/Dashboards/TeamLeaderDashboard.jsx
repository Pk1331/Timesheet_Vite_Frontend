import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../Common/DashboardLayout"
import DashboardRoutes from "../Common/DashboardRoutes"

const TeamLeaderDashboard = () => {
  const navigate = useNavigate()
  const [usertype, setUsertype] = useState("")

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")
    setUsertype(usertypeParam)
  }, [])

  const handleSidebarClick = (section) => {
    if (usertype === "TeamLeader" && section === "projects") {
      navigate("/team-leader-dashboard/projects/view-assigned")
    } else {
      navigate(`/team-leader-dashboard/${section}`)
    }
  }

  return (
    <DashboardLayout
      handleSidebarClick={handleSidebarClick}
      usertype={usertype}
    >
      <DashboardRoutes usertype="TeamLeader" />
    </DashboardLayout>
  )
}

export default TeamLeaderDashboard
