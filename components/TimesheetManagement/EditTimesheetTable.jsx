import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import api from "../../src/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { format } from "date-fns"

const EditTimesheetTable = ({
  editingTable,
  setEditingTable,
  fetchTimesheetTables,
}) => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (editingTable && editingTable.timesheets) {
      setRows(editingTable.timesheets)
    }
  }, [editingTable])

  const handleChange = (index, field, value) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    )
    setRows(newRows)
  }

  const handleSave = async () => {
    try {
      const formattedRows = rows.map((row) => ({
        ...row,
        date: row.date ? format(new Date(row.date), "yyyy-MM-dd") : null,
      }))
      const response = await api.put(`timesheet-tables/${editingTable.id}/edit/`,{ timesheets: formattedRows })
      if (response.data.status === "success") {
        toast.success("Timesheet table updated successfully!")
        fetchTimesheetTables()
        setEditingTable(null)
      } else {
        toast.error("Failed to update timesheet table!")
      }
    } catch (error) {
      toast.error("An error occurred while updating the timesheet table!")
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h3 className="text-xl font-bold mb-4">Edit Timesheet Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Task</th>
              <th className="px-4 py-2 border">Submitted To</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Hours</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  <DatePicker
                    selected={new Date(row.date)}
                    onChange={(date) => handleChange(index, "date", date)}
                    className="border p-2 rounded w-full"
                    placeholderText="Select Date"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={row.task}
                    onChange={(e) =>
                      handleChange(index, "task", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={row.submitted_to}
                    onChange={(e) =>
                      handleChange(index, "submitted_to", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      handleChange(index, "status", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="To Do">To Do</option>
                    <option value="On Progress">On Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <textarea
                    value={row.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    value={row.hours}
                    onChange={(e) =>
                      handleChange(index, "hours", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                    min="0"
                    step="0.5"
                    max="10"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setEditingTable(null)}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default EditTimesheetTable
