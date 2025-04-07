import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import api from "../../src/api"
import { FaTimes } from "react-icons/fa"

const CreateProject = ({ closeModal, fetchProjects, showToast }) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "",
    start_date: null,
    deadline: null,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewProject({ ...newProject, [name]: value })
  }

  const handleDateChange = (date, field) => {
    setNewProject({ ...newProject, [field]: date })
  }

  const validateFields = () => {
    const newErrors = {}
    if (!newProject.name) newErrors.name = "Project name is required"
    if (!newProject.description)
      newErrors.description = "Project description is required"
    if (!newProject.status) newErrors.status = "Project status is required"
    if (!newProject.start_date) newErrors.start_date = "Start date is required"
    if (!newProject.deadline) newErrors.deadline = "Deadline is required"
    if (
      newProject.start_date &&
      newProject.deadline &&
      newProject.start_date > newProject.deadline
    ) {
      newErrors.date = "Start date cannot be greater than deadline"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateProject = async (event) => {
    event.preventDefault();
    if (!validateFields()) return

    try {
      const response = await api.post("projects/create/", {
        ...newProject,
        start_date: newProject.start_date
          ? newProject.start_date.toISOString().split("T")[0]
          : "",
        deadline: newProject.deadline
          ? newProject.deadline.toISOString().split("T")[0]
          : "",
      })

      if (response.status === 201) {
        showToast("Project created successfully")

        setNewProject({
          name: "",
          description: "",
          status: "",
          start_date: null,
          deadline: null,
        })
        setErrors({})

        if (fetchProjects) fetchProjects()

        if (closeModal) closeModal()
      } else {
        showToast("Project creation failed", "error")
      }
    } catch (error) {
      showToast("Project creation failed", "error")
      console.error("Error creating project:", error)
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
          <h3 className="text-2xl font-bold mb-4 text-center text-blue-600">
            Create New Project
          </h3>

          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            <FaTimes size={20} />
          </button>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleChange}
                placeholder="Project Name"
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <textarea
                name="description"
                value={newProject.description}
                onChange={handleChange}
                placeholder="Project Description"
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-4">
              <select
                name="status"
                value={newProject.status}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            <div className="mb-4">
              <DatePicker
                selected={newProject.start_date}
                onChange={(date) => handleDateChange(date, "start_date")}
                placeholderText="Start Date"
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div className="mb-4">
              <DatePicker
                selected={newProject.deadline}
                onChange={(date) => handleDateChange(date, "deadline")}
                placeholderText="Deadline"
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
            </div>

            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}

            <div className="flex justify-end gap-4 mt-4">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded transition duration-300"
              >
                Cancel
              </button>

              {/* Create Project Button */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded transition duration-300"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateProject
