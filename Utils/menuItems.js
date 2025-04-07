import {
  FaTasks,
  FaUsers,
  FaClipboardList,
  FaUserCog,
  FaClock,
  FaChartBar,
  FaTelegram,
} from "react-icons/fa"

const commonMenu = [
  { title: "Projects", icon: FaTasks, key: "projects/view-assigned" },
  { title: "Teams", icon: FaUsers, key: "teams/assigned" },
  { title: "Tasks", icon: FaClipboardList, key: "tasks/assigned" },
  { title: "Timesheets", icon: FaClock, key: "timesheets" },
]

const menuItems = {
  SuperAdmin: [
    { title: "Projects", icon: FaTasks, key: "projects/list" },
    { title: "Teams", icon: FaUsers, key: "teams/list" },
    { title: "Tasks", icon: FaClipboardList, key: "tasks/list" },
    { title: "Users", icon: FaUserCog, key: "users-list" },
    ...commonMenu.slice(3),
    {
      title: "Reports & Analytics",
      icon: FaChartBar,
      key: "reports-and-analytics",
    },
    { title: "Telegram", icon: FaTelegram, key: "send-message" },
  ],
  Admin: [
    ...commonMenu,
    {
      title: "Reports & Analytics",
      icon: FaChartBar,
      key: "reports-and-analytics",
    },
    { title: "Telegram", icon: FaTelegram, key: "send-message" },
  ],
  TeamLeader: [
    ...commonMenu,
    {
      title: "Reports & Analytics",
      icon: FaChartBar,
      key: "reports-and-analytics",
    },
    { title: "Telegram", icon: FaTelegram, key: "send-message" },
  ],
  User: [
    ...commonMenu,
    { title: "Telegram", icon: FaTelegram, key: "send-message" },
  ],
}

export default menuItems
