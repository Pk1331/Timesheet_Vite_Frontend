import React, { useState } from "react"
import Sidebar from "./Sidebar"

const DashboardLayout = ({ children, handleSidebarClick, usertype }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <Sidebar
        handleSidebarClick={handleSidebarClick}
        usertype={usertype}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } overflow-hidden`}
      >
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
