import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import CreateTask from "./CreateTask"
import TaskList from "./TaskList"

const TaskManagement = () => {
  const usertype = localStorage.getItem("usertype")

  const getDefaultRedirect = (usertype) => {
    const redirects = {
      SuperAdmin: "/super-admin-dashboard/tasks/list",
      Admin: "/admin-dashboard/tasks/assigned",
      TeamLeader: "/team-leader-dashboard/tasks/assigned",
      User: "/user-dashboard/tasks/assigned",
    }
    return redirects[usertype] || "/login"
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="list" element={<TaskList />} />
        <Route path="create-task" element={<CreateTask />} />
        <Route path="assigned" element={<TaskList />} />
        <Route
          path="*"
          element={<Navigate to={getDefaultRedirect(usertype)} />}
        />
      </Routes>
    </div>
  )
}

export default TaskManagement
