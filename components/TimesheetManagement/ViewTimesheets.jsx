import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaUser, FaCalendarAlt, FaListAlt, FaDownload } from "react-icons/fa"
import { CSVLink } from "react-csv"
import api from "../../src/api"

const ViewTimesheets = () => {
  const [usertype, setUsertype] = useState("")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUsertype, setSelectedUsertype] = useState("")
  const [viewMode, setViewMode] = useState("Daily")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timesheetTables, setTimesheetTables] = useState([])

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")
    setUsertype(usertypeParam)
    fetchUsers(usertypeParam)
  }, [])

  const fetchUsers = async (usertypeParam) => {
    try {
      let url = "users/"
      if (usertypeParam === "SuperAdmin") {
        url += "?usertype=Admin,TeamLeader,User"
      } else if (usertypeParam === "Admin") {
        url += "?usertype=TeamLeader,User"
      } else if (usertypeParam === "TeamLeader") {
        const userId = localStorage.getItem("user_id")
        url += `?team_leader=${userId}`
      }
      const response = await api.get(url)
      setUsers(response.data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleUserChange = async (e) => {
    const selectedUserId = e.target.value
    setSelectedUser(selectedUserId)
    setTimesheetTables([])

    // Fetch the selected user's usertype
    try {
      const response = await api.get(`users/${selectedUserId}/`)
      setSelectedUsertype(response.data.usertype)
    } catch (error) {
      console.error("Error fetching selected user's usertype:", error)
    }
  }

  const handleViewModeChange = (e) => {
    setViewMode(e.target.value)
    setTimesheetTables([])
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setTimesheetTables([])
  }

  const fetchTimesheetTables = async () => {
    try {
      let table_status = ""
      if (selectedUsertype === "User") {
        table_status = "Approved by Team Leader"
      } else if (selectedUsertype === "TeamLeader") {
        table_status = "Approved by Admin"
      }
      const response = await api.get("timesheet-tables/", {
        params: {
          user: selectedUser,
          viewMode: viewMode,
          date: selectedDate.toISOString().split("T")[0],
          table_status: table_status,
        },
      })
      setTimesheetTables(response.data.timesheet_tables || [])
    } catch (error) {
      console.error("Error fetching timesheet tables:", error)
    }
  }

  useEffect(() => {
    if (selectedUser) {
      fetchTimesheetTables()
    }
  }, [selectedUser, selectedUsertype, viewMode, selectedDate])

  const generateCSVData = () => {
    const csvData = []
    timesheetTables.forEach((table) => {
      table.timesheets.forEach((timesheet) => {
        csvData.push({
          Date: timesheet.date,
          Task: timesheet.task,
          "Submitted To": timesheet.submitted_to,
          Status: timesheet.status,
          Description: timesheet.description,
          Hours: timesheet.hours,
        })
      })
    })
    return csvData
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-6 space-x-4">
        {(usertype === "SuperAdmin" ||
          usertype === "Admin" ||
          usertype === "TeamLeader") && (
          <>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 flex items-center">
                <FaUser className="mr-2" />
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={handleUserChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select User
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 flex items-center">
                <FaListAlt className="mr-2" />
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={handleViewModeChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Daily">Daily View</option>
                <option value="Monthly">Monthly View</option>
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 flex items-center">
                <FaCalendarAlt className="mr-2" />
                {viewMode === "Daily" ? "Select Date" : "Select Month"}
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                showMonthYearPicker={viewMode === "Monthly"}
                dateFormat={viewMode === "Monthly" ? "MM/yyyy" : "MM/dd/yyyy"}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mb-4">
        <CSVLink
          data={generateCSVData()}
          filename={`${
            users.find((user) => user.id === Number(selectedUser))?.username ||
            "user"
          }_${selectedDate.toISOString().split("T")[0]}.csv`}
          className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaDownload className="mr-2" />
          Download CSV
        </CSVLink>
      </div>
      <div>
        {/* Display timesheet tables based on selected user, view mode, and date */}
        {timesheetTables.length === 0 ? (
          <div className="text-center text-gray-500">
            No timesheet tables found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="shadow-lg rounded-lg overflow-hidden">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                {/* Table Header */}
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-5 text-left border whitespace-nowrap">
                      Date
                    </th>
                    <th className="py-3 px-5 text-left border">Task</th>
                    <th className="py-3 px-5 text-left border">Submitted To</th>
                    <th className="py-3 px-5 text-left border">Status</th>
                    <th className="py-3 px-5 text-left border">Description</th>
                    <th className="py-3 px-5 text-left border">Hours</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {timesheetTables.map((table) => (
                    <React.Fragment key={table.id}>
                      {table.timesheets.map((timesheet, index) => (
                        <tr
                          key={`${table.id}-${timesheet.id}`}
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition-all duration-200`}
                        >
                          <td className="py-3 px-5 border whitespace-nowrap">
                            {timesheet.date}
                          </td>
                          <td className="py-3 px-5 border">{timesheet.task}</td>
                          <td className="py-3 px-5 border">
                            {timesheet.submitted_to}
                          </td>
                          <td className="py-3 px-5 border">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                timesheet.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : timesheet.status === "On Progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {timesheet.status}
                            </span>
                          </td>
                          <td className="py-3 px-5 border">
                            {timesheet.description}
                          </td>
                          <td className="py-3 px-5 border">
                            {timesheet.hours}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewTimesheets
