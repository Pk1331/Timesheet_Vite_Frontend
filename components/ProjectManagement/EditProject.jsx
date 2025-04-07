import React, { useState, useEffect } from "react"
import { FaTimes } from "react-icons/fa"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import api from "../../src/api"

const EditProject = ({
  editingProject,
  setEditingProject,
  fetchProjects,
  showToast,
}) => {
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    status: "",
    start_date: null,
    deadline: null,
  })

  useEffect(() => {
    if (editingProject) {
      setEditData({
        name: editingProject.name,
        description: editingProject.description,
        status: editingProject.status,
        start_date: new Date(editingProject.start_date),
        deadline: new Date(editingProject.deadline),
      })
    }
  }, [editingProject])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData({
      ...editData,
      [name]: value,
    })
  }

  const handleDateChange = (date, field) => {
    setEditData({
      ...editData,
      [field]: date,
    })
  }

  const handleEditProject = async (e) => {
    e.preventDefault()

    try {
      await api.put(`projects/${editingProject.id}/edit/`, {
        ...editData,
        start_date: editData.start_date
          ? editData.start_date.toISOString().split("T")[0]
          : "",
        deadline: editData.deadline
          ? editData.deadline.toISOString().split("T")[0]
          : "",
      })
      showToast("Project updated successfully!")
      setEditingProject(null)
      fetchProjects()
    } catch (error) {
      showToast("Failed to update project", "error")
      console.error("Error updating project:", error)
    }
  }

  if (!editingProject) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setEditingProject(null)}
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-xl font-bold mb-4">Edit Project</h3>
        <form onSubmit={handleEditProject} className="space-y-4">
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={editData.status}
            onChange={handleChange}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <DatePicker
            selected={editData.start_date}
            onChange={(date) => handleDateChange(date, "start_date")}
            placeholderText="Start Date"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            calendarClassName="rounded-lg shadow-lg"
          />
          <DatePicker
            selected={editData.deadline}
            onChange={(date) => handleDateChange(date, "deadline")}
            placeholderText="Deadline"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            calendarClassName="rounded-lg shadow-lg"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded w-full transition duration-300"
          >
            Update Project
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProject
