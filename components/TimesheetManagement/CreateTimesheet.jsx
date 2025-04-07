import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaSave } from "react-icons/fa"
import api from "../../src/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { format } from "date-fns"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableItem } from "./SortableItem"

const CreateTimesheet = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      date: null,
      task: "",
      submittedTo: "",
      status: "To Do",
      description: "",
      hours: 0,
      project: "", // Add project field
    },
    {
      id: 2,
      date: null,
      task: "",
      submittedTo: "",
      status: "To Do",
      description: "",
      hours: 0,
      project: "", // Add project field
    },
    {
      id: 3,
      date: null,
      task: "",
      submittedTo: "",
      status: "To Do",
      description: "",
      hours: 0,
      project: "", // Add project field
    },
  ])
  const [usertype, setUsertype] = useState("")
  const [submittedToUsers, setSubmittedToUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")

    setUsertype(usertypeParam)
    fetchProjects(usertypeParam)
    fetchSubmittedToUsers()
    validateRows()
  }, [rows])

  const fetchSubmittedToUsers = async () => {
    try {
      const response = await api.get("teams/submitted-to-users/")
      setSubmittedToUsers(response.data.users || [])
      console.log(response.data.users)
    } catch (error) {
      console.error("Error fetching submitted to users:", error)
    }
  }

  const fetchProjects = async (usertypePara) => {
    try {
      const url =
        usertypePara === "SuperAdmin" ? "projects/" : "projects/assigned/"
      const projectsResponse = await api.get(url)
      setProjects(projectsResponse.data.projects || [])
      console.log(projectsResponse.data.projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleAddRowBelow = (index) => {
    const newRow = {
      id: rows.length + 1,
      date: null,
      task: "",
      submittedTo: "",
      status: "To Do",
      description: "",
      hours: 0,
      project: "",
    }
    const newRows = [...rows]
    newRows.splice(index + 1, 0, newRow)
    setRows(newRows)
  }

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      const newRows = rows
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, id: i + 1 }))
      setRows(newRows)
    }
  }

  const handleChange = (index, field, value) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    )
    setRows(newRows)
  }

  const validateRows = () => {
    const isValid = rows.every(
      (row) =>
        row.date &&
        row.project &&
        row.task.trim() &&
        row.submittedTo &&
        row.status &&
        row.description.trim() &&
        row.hours > 0
    )

    setIsSaveDisabled(!isValid)
  }

  const handleSave = () => {
    if (isSaveDisabled) {
      toast.error("Please fill in all details before saving.")
      return
    }

    setShowSaveConfirm(true)
  }

  const confirmSave = async () => {
    try {
      const username = localStorage.getItem("username")
      const formattedRows = rows.map((row) => ({
        ...row,
        date: row.date ? format(row.date, "yyyy-MM-dd") : null,
        created_by: username,
        submitted_to: row.submittedTo,
      }))
      const response = await api.post("timesheet-tables/create/", {
        timesheets: formattedRows,
        created_by: username,
      })
      if (response.data.status === "success") {
        toast.success("Timesheet table saved successfully!")
        setRows([
          {
            id: 1,
            date: null,
            task: "",
            submittedTo: "",
            status: "To Do",
            description: "",
            hours: 0,
            project: "",
          },
          {
            id: 2,
            date: null,
            task: "",
            submittedTo: "",
            status: "To Do",
            description: "",
            hours: 0,
            project: "",
          },
          {
            id: 3,
            date: null,
            task: "",
            submittedTo: "",
            status: "To Do",
            description: "",
            hours: 0,
            project: "",
          },
        ])
      } else {
        toast.error("Failed to save timesheet table!")
      }
    } catch (error) {
      toast.error("An error occurred while saving the timesheet table!")
    }
    setShowSaveConfirm(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-md ">
      <ToastContainer />
      <h3 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Create Timesheet
      </h3>

      <div className="overflow-x-auto max-w-full">
        {typeof window !== "undefined" && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rows}
              strategy={verticalListSortingStrategy}
            >
              <table className=" w-full border border-gray-300 rounded-xl shadow-md bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left border-b border-gray-300">
                    <th className="bg-white border-r border-gray-300 w-10"></th>
                    {[
                      "Date",
                      "Project",
                      "Task",
                      "Submitted To",
                      "Status",
                      "Description",
                      "Hours",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-5 py-4 font-semibold uppercase text-sm tracking-wide border-gray-300 border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row, index) => (
                    <SortableItem
                      key={row.id}
                      id={row.id}
                      index={index}
                      row={row}
                      handleChange={handleChange}
                      handleAddRowBelow={handleAddRowBelow}
                      handleRemoveRow={handleRemoveRow}
                      projects={projects}
                      submittedToUsers={submittedToUsers}
                    />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`px-4 py-2 rounded-lg shadow flex items-center ${
            isSaveDisabled
              ? "bg-gray-400 cursor-not-allowed "
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <FaSave className="mr-2" /> Save
        </button>
      </div>

      {showSaveConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Save</h3>
            <p>Are you sure you want to save this timesheet table?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateTimesheet
