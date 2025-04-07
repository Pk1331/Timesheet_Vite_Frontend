import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import api from "../../src/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaComment,
  FaCalendarAlt,
} from "react-icons/fa"
import EditTimesheetTable from "./EditTimesheetTable"

const TimesheetList = () => {
  const [timesheetTables, setTimesheetTables] = useState([])
  const [editingTable, setEditingTable] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [viewingComments, setViewingComments] = useState(null)
  const [comments, setComments] = useState("")
  const [usertype, setUsertype] = useState("")

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")
    setUsertype(usertypeParam)
    fetchTimesheetTables()
  }, [selectedDate])

  const fetchTimesheetTables = async () => {
    try {
      const response = await api.get("timesheet-tables/pending-review/", {
        params: {
          date: selectedDate.toISOString().split("T")[0],
          viewMode: "Daily",
        },
      })
      setTimesheetTables(response.data.timesheet_tables || [])
    } catch (error) {
      console.error("Error fetching timesheet tables:", error)
    }
  }

  const fetchComments = async (timesheetTableId) => {
    try {
      const response = await api.get(
        `timesheet-tables/${timesheetTableId}/comments/`
      )
      setComments(response.data.comments)
      setViewingComments(true)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleDelete = async (timesheetTableId) => {
    try {
      await api.delete(`timesheet-tables/${timesheetTableId}/delete/`)
      toast.success("Timesheet table deleted successfully!")
      fetchTimesheetTables()
    } catch (error) {
      toast.error("Failed to delete timesheet table!")
      console.error("Error deleting timesheet table:", error)
    }
  }

  const handleSendForReview = async (timesheetTableId) => {
    try {
      await api.post(`timesheet-tables/${timesheetTableId}/send-to-review/`)
      toast.success("Timesheet table sent for review successfully!")
      fetchTimesheetTables()
    } catch (error) {
      console.error("Error sending timesheet table for review:", error)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h3 className="text-xl font-bold mb-4">Timesheet List</h3>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="block text-gray-800 font-semibold mb-2">
          📅 Select Date
        </label>
        <div className="relative w-48">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 pl-3">
            <FaCalendarAlt className="text-blue-500" />
          </span>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border border-gray-300 p-3 pl-14 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md text-gray-800 text-base transition-all duration-200 hover:border-blue-500"
            placeholderText="Choose a date..."
          />
        </div>
      </div>

      {/* Table */}
      {timesheetTables.length === 0 ? (
        <div className="text-center text-gray-500">
          No timesheet tables found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <table className="w-full table-auto border-collapse rounded-lg">
              {/* Table Header */}
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-5 py-3 text-center border">Date</th>
                  <th className="px-5 py-3 text-center border">Project</th>
                  <th className="px-5 py-3 text-left border">Task</th>
                  <th className="px-5 py-3 text-left border">Submitted To</th>
                  <th className="px-5 py-3 text-left border">Status</th>
                  <th className="px-5 py-3 text-left border">Description</th>
                  <th className="px-5 py-3 text-left border">Hours</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {timesheetTables.map((table) =>
                  table.timesheets.map((timesheet, index) => (
                    <tr
                      key={timesheet.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-all duration-200`}
                    >
                      <td className="border px-5 py-3 text-center flex items-center justify-center space-x-2 whitespace-nowrap">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>{timesheet.date}</span>
                      </td>
                      <td className="border px-5 py-3">{timesheet.project}</td>
                      <td className="border px-5 py-3">{timesheet.task}</td>
                      <td className="border px-5 py-3">
                        {timesheet.submitted_to}
                      </td>
                      <td className="border px-5 py-3">
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
                      <td className="border px-5 py-3">
                        {timesheet.description}
                      </td>
                      <td className="border px-5 py-3">{timesheet.hours}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-4 space-x-3">
            {usertype === "User" &&
              timesheetTables[0].status !== "Approved by Team Leader" && (
                <>
                  {timesheetTables[0].status === "Rejected by Team Leader" && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-600 transition duration-300"
                      onClick={() => fetchComments(timesheetTables[0].id)}
                    >
                      <FaComment />
                      <span>View Comments</span>
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition duration-300"
                    onClick={() => setEditingTable(timesheetTables[0])}
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition duration-300"
                    onClick={() => setConfirmDelete(timesheetTables[0].id)}
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition duration-300"
                    onClick={() => handleSendForReview(timesheetTables[0].id)}
                  >
                    <FaPaperPlane />
                    <span>Send for Review</span>
                  </button>
                </>
              )}
            {usertype === "TeamLeader" &&
              timesheetTables[0].status !== "Approved by Admin" && (
                <>
                  {timesheetTables[0].status === "Rejected by Admin" && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-600 transition duration-300"
                      onClick={() => fetchComments(timesheetTables[0].id)}
                    >
                      <FaComment />
                      <span>View Comments</span>
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition duration-300"
                    onClick={() => setEditingTable(timesheetTables[0])}
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition duration-300"
                    onClick={() => setConfirmDelete(timesheetTables[0].id)}
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition duration-300"
                    onClick={() => handleSendForReview(timesheetTables[0].id)}
                  >
                    <FaPaperPlane />
                    <span>Send for Review</span>
                  </button>
                </>
              )}
          </div>
        </div>
      )}

      {/* Edit Timesheet Modal */}
      {editingTable && (
        <EditTimesheetTable
          editingTable={editingTable}
          setEditingTable={setEditingTable}
          fetchTimesheetTables={fetchTimesheetTables}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this timesheet table?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(confirmDelete)
                  setConfirmDelete(null)
                }}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {viewingComments && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-2/5">
            <button
              onClick={() => setViewingComments(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <textarea
              value={comments}
              readOnly
              className="border p-2 rounded w-full mb-4"
              style={{ height: "200px" }}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setViewingComments(null)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimesheetList
