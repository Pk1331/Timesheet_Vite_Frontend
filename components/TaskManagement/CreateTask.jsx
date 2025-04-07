import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format } from "date-fns"
import api from "../../src/api"
import { IoClose } from "react-icons/io5"
import Lottie from "lottie-react"
import loaderAnimation from "../../src/assets/myloader2.json"

const CreateTask = ({ closeModal, fetchTasks, showToast }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    status: "To Do",
    priority: "Medium",
    start_date: new Date(),
    end_date: new Date(),
    assigned_to: "",
  })

  const [projects, setProjects] = useState([])
  const [usertype, setUsertype] = useState("")
  const [accountManagers, setAccountManagers] = useState([])
  const [teamLeaders, setTeamLeaders] = useState([])
  const [assignedTeam, setAssignedTeam] = useState(null)
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")

    setUsertype(usertypeParam)
    fetchProjects(usertypeParam)
  }, [])

  // Fetch Projects Based on the Role
  const fetchProjects = async (usertypePara) => {
    try {
      const url =
        usertypePara === "SuperAdmin" ? "projects/" : "projects/assigned/"
      const projectsResponse = await api.get(url)
      setProjects(projectsResponse.data.projects || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  // Fetching  Logged Teamleader Team
  useEffect(() => {
    const fetchAssignedTeam = async () => {
      if (usertype === "TeamLeader") {
        try {
          const response = await api.get("teams/teamleader/assigned_team/")
          setAssignedTeam(response.data.team)
        } catch (error) {
          console.error("Error fetching assigned team:", error)
        }
      }
    }
    fetchAssignedTeam()
  }, [usertype])

  // Changes in the Input Fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewTask({
      ...newTask,
      [name]: value,
    })
  }

  // Handing Things based on Project Change
  const handleProjectChange = (e) => {
    const selectedProjectId = parseInt(e.target.value)
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    )
    if (selectedProject) {
      const managers =
        selectedProject.teams.flatMap((team) => team.account_managers) || []
      const leaders = selectedProject.teams
        .flatMap((team) => [
          team.team_leader_search,
          team.team_leader_creative,
          team.team_leader_development,
        ])
        .filter(Boolean)
        .map((leader) => ({
          id: leader.id,
          username: leader.username,
        }))
      const assignedTeamType = assignedTeam?.team_type || ""
      const assignedTeamMembers = selectedProject.teams.flatMap((team) => {
        return team.subteams.filter((subteam) => {
          return subteam.team === assignedTeamType
        })
      })

      if (assignedTeamMembers.length === 0) {
        setFilteredTeamMembers([
          {
            id: "none",
            username: "No members of your team assigned to Selected Project",
          },
        ])
      } else {
        setFilteredTeamMembers(assignedTeamMembers)
      }
      setNewTask((prev) => ({
        ...prev,
        project: selectedProjectId,
        assigned_to: "",
      }))

      setAccountManagers(managers)
      setTeamLeaders(leaders)
    } else {
      console.log("No project found with this ID.")
    }
  }

  const handleStartDateChange = (date) => {
    setNewTask({
      ...newTask,
      start_date: date,
    })
  }

  const handleEndDateChange = (date) => {
    setNewTask({
      ...newTask,
      end_date: date,
    })
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!newTask.project) {
      toast.error("Please select a project before creating a task")
      return
    }

    try {
      const formattedTask = {
        ...newTask,
        start_date: format(newTask.start_date, "yyyy-MM-dd"),
        end_date: format(newTask.end_date, "yyyy-MM-dd"),
      }
      await api.post("tasks/create/", formattedTask)
      showToast("Task created successfully!")
      setNewTask({
        title: "",
        description: "",
        project: "",
        status: "To Do",
        priority: "Medium",
        start_date: new Date(),
        end_date: new Date(),
        assigned_to: "",
      })
      if (closeModal) closeModal()
      if (fetchTasks) fetchTasks()
    } catch (error) {
      showToast("Error creating task", "error")
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative max-h-[80vh] overflow-y-auto border border-gray-200">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">
            Create New Task
          </h3>

          {/* Close Icon */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          >
            <IoClose size={24} />
          </button>

          {/* Task Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Title</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleChange}
              placeholder="Task Title"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Description</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Select Project */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Project</label>
            <select
              name="project"
              value={newTask.project}
              onChange={handleProjectChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assign to Account Manager (Only for SuperAdmins) */}
          {usertype === "SuperAdmin" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Account Manager
              </label>
              <select
                name="assigned_to"
                value={newTask.assigned_to}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!accountManagers.length}
              >
                <option value="" disabled>
                  {accountManagers.length
                    ? "Select Account Manager"
                    : "No Account Managers Assigned"}
                </option>
                {accountManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assign to Teamleaders (only for Admins) */}
          {usertype === "Admin" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Team Leader
              </label>
              {teamLeaders.length > 0 ? (
                <select
                  name="assigned_to"
                  value={newTask.assigned_to}
                  onChange={handleChange}
                  className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Team Leader
                  </option>
                  {teamLeaders.map((leader) => (
                    <option key={leader.id} value={leader.id}>
                      {leader.username}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No team leaders available.
                </p>
              )}
            </div>
          )}

          {/* Assigned to Team Members (By logged Teamleadee) */}
          {usertype === "TeamLeader" && filteredTeamMembers.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Team Member
              </label>
              <select
                name="assigned_to"
                value={newTask.assigned_to}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Team Member
                </option>
                {filteredTeamMembers.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                    disabled={member.id === "none"}
                  >
                    {member.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Task Status */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Status</label>
            <select
              name="status"
              value={newTask.status}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Task Priority */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Priority</label>
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          {/* Task Start Date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <DatePicker
              selected={newTask.start_date}
              onChange={handleStartDateChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Task End Date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={newTask.end_date}
              onChange={handleEndDateChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Create Task Button */}
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            onClick={handleCreateTask}
          >
            Create Task
          </button>
        </div>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-70 flex items-center justify-center z-50">
          <Lottie
            animationData={loaderAnimation}
            loop
            className="w-2/4 h-2/4"
          />
        </div>
      )}
    </>
  )
}

export default CreateTask
