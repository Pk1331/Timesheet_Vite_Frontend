import React, { useState, useEffect } from "react"
import { FaTachometerAlt, FaSignOutAlt, FaBell, FaTimes } from "react-icons/fa"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import menuItems from "../../Utils/menuItems"
import TokenExpire from "./TokenExpire"
import { Popover } from "@mui/material"

const Sidebar = ({
  usertype,
  handleSidebarClick,
  isSidebarOpen,
  setSidebarOpen,
}) => {
  const [userInfo, setUserInfo] = useState({})
  const [selected, setSelected] = useState(
    localStorage.getItem("selectedMenuItem") || "Dashboard"
  )
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    setUserInfo({
      username: localStorage.getItem("username"),
      usertype: localStorage.getItem("usertype"),
      email: localStorage.getItem("email"),
      firstname: localStorage.getItem("firstname"),
    })
  }, [])

  useEffect(() => {
    localStorage.setItem("selectedMenuItem", selected)
  }, [selected])

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New task assigned!", read: false },
    { id: 2, message: "Meeting at 3 PM", read: false },
    { id: 3, message: "Timesheet approval pending", read: false },
  ])

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }
  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const notificationCount = notifications.filter((n) => !n.read).length
  return (
    <div className="relative group">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-100 text-black transition-all duration-300 shadow-lg ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        {isSidebarOpen && (
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-300">
              {/* App Name */}
              <span className="text-xl font-bold text-gray-800">
                TimesheetAPP
              </span>

              {/* Notification Bell */}
              <div className="relative mr-4">
                <FaBell
                  className="text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
                  onClick={handleBellClick}
                />

                {/* Notification Count Badge */}
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold px-1  rounded-full">
                    {notificationCount}
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex-grow overflow-y-auto">
              <nav className="mt-4">
                <ul className="space-y-2">
                  <SidebarItem
                    title="Dashboard"
                    icon={<FaTachometerAlt />}
                    onClick={() => {
                      handleSidebarClick("dashboard")
                      setSelected("Dashboard")
                    }}
                    isSelected={selected === "Dashboard"}
                  />

                  {/* Menu Items Without Dropdown */}
                  {menuItems[usertype]?.map(({ title, icon, key }) => (
                    <SidebarItem
                      key={key}
                      title={title}
                      icon={React.createElement(icon)}
                      onClick={() => {
                        handleSidebarClick(key)
                        setSelected(title)
                      }}
                      isSelected={selected === title}
                    />
                  ))}
                </ul>
              </nav>
            </div>

            <div className="p-4 bg-red-100 border-l-4 border-red-600">
              <h3 className="text-sm font-semibold text-black mb-2">
                Session Expiry
              </h3>
              <TokenExpire />
            </div>

            {/* Profile & Logout Section */}
            <div className="p-4 border-t border-gray-300 mt-auto">
              <div
                className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300"
                onClick={() => handleSidebarClick("profile")}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userInfo.username || "User"
                  )}&background=random&color=ffffff&bold=true`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-400"
                />
                <span className="text-sm font-semibold text-gray-800">
                  {userInfo.firstname || "User"}
                </span>
              </div>

              <div className="w-full mt-3 space-y-2">
                <ProfileButton
                  onClick={() => handleSidebarClick("Logout")}
                  icon={<FaSignOutAlt className="text-red-500 text-lg" />}
                  text="Logout"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <div className="fixed top-4 left-2">
          <button
            onClick={toggleSidebar}
            className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-opacity"
          >
            <IoChevronForward size={10} />
          </button>
        </div>
      )}

      {isSidebarOpen && (
        <div className="fixed top-4 left-[242px] transition-all duration-300">
          <button
            onClick={toggleSidebar}
            className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-opacity"
          >
            <IoChevronBack size={10} />
          </button>
        </div>
      )}

      {/* Notification Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            width: "300px",
            maxHeight: "400px",
            overflow: "hidden",
            padding: "10px",
            position: "relative",
          },
        }}
      >
        {/* Sticky Header (Title + Close Button) */}
        <div className="flex justify-between items-center p-2 border-b border-gray-300 bg-white sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Notification List */}
        <div className="max-h-64 overflow-y-auto p-2 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              No new notifications.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 rounded-lg shadow-sm text-sm flex justify-between items-center ${
                  notification.read
                    ? "bg-gray-300 text-gray-600"
                    : "bg-gray-100"
                }`}
              >
                <span>{notification.message}</span>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-500 text-xs font-semibold ml-2 hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Popover>
    </div>
  )
}

const SidebarItem = ({ title, icon, onClick, isSelected }) => (
  <li
    className={`flex items-center p-3 cursor-pointer transition-all duration-300 mx-3
      ${
        isSelected
          ? "border-l-4 border-green-500 bg-green-100"
          : "border-l-4 border-transparent"
      }
      hover:bg-gray-200`}
    onClick={onClick}
  >
    <span className="text-gray-600 text-lg">{icon}</span>
    <span className="ml-3 text-gray-800 font-medium">{title}</span>
  </li>
)

const ProfileButton = ({ onClick, icon, text }) => (
  <button
    className="w-full flex items-center px-4 py-2 rounded-lg transition duration-300 hover:bg-gray-200"
    onClick={onClick}
  >
    <span>{icon}</span>
    <span className="ml-3 text-sm font-medium">{text}</span>
  </button>
)

export default Sidebar
