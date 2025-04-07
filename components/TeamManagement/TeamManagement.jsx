import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import CreateTeam from "./CreateTeam"
import TeamList from "./TeamList"

const TeamManagement = () => {
  const usertype = localStorage.getItem("usertype")
  const getDefaultRedirect = (usertype) => {
    switch (usertype) {
      case "SuperAdmin":
        return "/super-admin-dashboard/teams/list"
      case "Admin":
        return "/admin-dashboard/teams/assigned"
      case "TeamLeader":
        return "/team-leader-dashboard/teams/assigned"
      case "User":
        return "/user-dashboard/teams/assigned"
      default:
        return "/login"
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="list" element={<TeamList />} />
        <Route path="create-team" element={<CreateTeam />} />
        <Route path="assigned" element={<TeamList />} />

        <Route
          path="*"
          element={<Navigate to={getDefaultRedirect(usertype)} />}
        />
      </Routes>
    </div>
  )
}

export default TeamManagement
