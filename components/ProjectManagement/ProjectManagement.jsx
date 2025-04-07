import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import CreateProject from "./CreateProject"
import ProjectList from "./ProjectList"
import ViewAssignedProjects from "./ViewAssignedProjects"

const ProjectManagement = () => {
  const usertype = localStorage.getItem("usertype")

  const getDefaultRedirect = (usertype) => {
    switch (usertype) {
      case "SuperAdmin":
        return "/super-admin-dashboard/projects/list"
      case "Admin":
        return "/admin-dashboard/projects/view-assigned"
      case "TeamLeader":
        return "/team-leader-dashboard/projects/assigned"
      case "User":
        return "/user-dashboard/projects/assigned"
      default:
        return "/login" // Redirect to login if user type is undefined
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="list" element={<ProjectList />} />
        <Route path="create-project" element={<CreateProject />} />
        <Route path="view-assigned" element={<ViewAssignedProjects />} />
        <Route
          path="*"
          element={<Navigate to={getDefaultRedirect(usertype)} />}
        />
      </Routes>
    </div>
  )
}

export default ProjectManagement
