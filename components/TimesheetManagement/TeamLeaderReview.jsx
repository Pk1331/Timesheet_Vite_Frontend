import React, { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaCheck, FaTimes } from "react-icons/fa"
import api from "../../src/api"

const TeamLeaderReview = () => {
  const [timesheetTables, setTimesheetTables] = useState([])
  const [rejectingTable, setRejectingTable] = useState(null)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    fetchTimesheetTablesForReview()
  }, [])

  const fetchTimesheetTablesForReview = async () => {
    try {
      const response = await api.get("timesheet-tables/review/")
      setTimesheetTables(response.data.timesheet_tables || [])
    } catch (error) {
      console.error("Error fetching timesheet tables for review:", error)
    }
  }

  const handleReview = async (tableId, action, feedback = "") => {
    try {
      await api.post(`timesheet-tables/${tableId}/team-leader-review/`, {
        action,
        feedback,
      })
      toast.success(`Timesheet table ${action} successfully!`)
      fetchTimesheetTablesForReview()
      setRejectingTable(null)
      setFeedback("")
    } catch (error) {
      console.error(`Error ${action} timesheet table:`, error)
    }
  }

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />
      <h3 className="text-2xl font-bold mb-6">Timesheet Tables for Review</h3>
      {timesheetTables.length === 0 ? (
        <div className="text-center text-gray-500">
          No timesheet tables for review.
        </div>
      ) : (
        timesheetTables.map((table) => (
          <div
            key={table.id}
            className="mb-6 bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Project</th>
                    <th className="px-4 py-2 border">Task</th>
                    <th className="px-4 py-2 border">Submitted To</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {table.timesheets.map((timesheet) => (
                    <tr key={timesheet.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2 whitespace-nowrap">
                        {timesheet.date}
                      </td>
                      <td className="border px-4 py-2">{timesheet.project}</td>
                      <td className="border px-4 py-2">{timesheet.task}</td>
                      <td className="border px-4 py-2">
                        {timesheet.submitted_to}
                      </td>
                      <td className="border px-4 py-2">{timesheet.status}</td>
                      <td className="border px-4 py-2">
                        {timesheet.description}
                      </td>
                      <td className="border px-4 py-2">{timesheet.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-green-500 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition duration-300"
                onClick={() => handleReview(table.id, "approve")}
              >
                <FaCheck />
                <span>Approve</span>
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition duration-300"
                onClick={() => setRejectingTable(table.id)}
              >
                <FaTimes />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ))
      )}

      {rejectingTable && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-2/5">
            <h3 className="text-xl font-bold mb-4">Reject Timesheet Table</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Enter feedback"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setRejectingTable(null)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(rejectingTable, "reject", feedback)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamLeaderReview
