import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaTimes } from "react-icons/fa"
import { format } from "date-fns"
import api from "../../src/api"
import Lottie from "lottie-react"
import loaderAnimation from "../../src/assets/myloader2.json"

const EditTask = ({ editingTask, setEditingTask, fetchTasks, showToast }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    project: "",
    status: "To Do",
    priority: "Medium",
    start_date: new Date(),
    end_date: new Date(),
    assigned_to: "",
  })
  const [usertype, setUsertype] = useState("")
  const [projects, setProjects] = useState([])
  const [accountManagers, setAccountManagers] = useState([])
  const [teamLeaders, setTeamLeaders] = useState([])
  const [assignedTeam, setAssignedTeam] = useState(null)
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const userid = Number(localStorage.getItem("user_id"))
  const isDisabled = userid !== editingTask.created_by?.id

  useEffect(() => {
    if (editingTask) {
      let assignedUser = null

      if (editingTask.assigned_to) {
        if (editingTask.assigned_to.superadmin) {
          assignedUser = {
            id: editingTask.assigned_to.superadmin.id,
            username: editingTask.assigned_to.superadmin.username,
          }
        } else if (editingTask.assigned_to.admin) {
          assignedUser = {
            id: editingTask.assigned_to.admin.id,
            username: editingTask.assigned_to.admin.username,
          }
        } else if (editingTask.assigned_to.teamleader) {
          assignedUser = {
            id: editingTask.assigned_to.teamleader.id,
            username: editingTask.assigned_to.teamleader.username,
          }
        }
      }
      setTask((prevTask) => ({
        ...prevTask, // Keep previous state
        title: editingTask.title || "",
        description: editingTask.description || "",
        project: editingTask.project?.id || "",
        status: editingTask.status || "To Do",
        priority: editingTask.priority || "Medium",
        start_date: editingTask.start_date
          ? new Date(editingTask.start_date)
          : new Date(),
        end_date: editingTask.end_date
          ? new Date(editingTask.end_date)
          : new Date(),
        assigned_to: assignedUser?.id || "",
      }))

      if (editingTask.project?.id) {
        loadProjectData(editingTask.project.id)
      }
    }
  }, [editingTask])

  useEffect(() => {
    if (editingTask?.project?.id && projects.length > 0) {
      loadProjectData(editingTask.project.id)
    }
  }, [projects, editingTask])

  // useEffect(() => {
  //   if (
  //     task.assigned_to &&
  //     !accountManagers.some((m) => m.id === task.assigned_to)
  //   ) {
  //     const assignedUserDetails = {
  //       id: task.assigned_to,
  //       username:
  //         editingTask.assigned_to?.superadmin?.username ||
  //         editingTask.assigned_to?.admin?.username ||
  //         editingTask.assigned_to?.teamleader?.username ||
  //         "Unknown User",
  //     }
  //     setAccountManagers((prev) => [assignedUserDetails, ...prev])
  //   }
  // }, [task.assigned_to, accountManagers])

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

  const loadProjectData = (projectId) => {
    const selectedProject = projects.find((project) => project.id === projectId)

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
        .map((leader) => ({ id: leader.id, username: leader.username }))

      if (
        task.assigned_to &&
        !managers.some((m) => m.id === task.assigned_to)
      ) {
        const assignedUserDetails = {
          id: task.assigned_to,
          username:
            editingTask.assigned_to?.superadmin?.username ||
            editingTask.assigned_to?.admin?.username ||
            editingTask.assigned_to?.teamleader?.username ||
            "Unknown User",
        }
        managers.push(assignedUserDetails)
      }

      const assignedTeamType = assignedTeam?.team_type || ""
      const assignedTeamMembers = selectedProject.teams.flatMap((team) =>
        team.subteams.filter((subteam) => subteam.team === assignedTeamType)
      )

      setFilteredTeamMembers(
        assignedTeamMembers.length
          ? assignedTeamMembers
          : [{ id: "none", username: "No members assigned to this project" }]
      )

      setAccountManagers(managers)
      setTeamLeaders(leaders)
    }
  }

  const handleProjectChange = (e) => {
    const selectedProjectId = Number(e.target.value)

    if (!isNaN(selectedProjectId)) {
      setTask((prev) => ({
        ...prev,
        project: selectedProjectId,
        assigned_to: "",
      }))

      loadProjectData(selectedProjectId)
    } else {
      console.warn("Invalid project ID:", e.target.value)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask({
      ...task,
      [name]: value,
    })
  }

  const handleStartDateChange = (date) => {
    setTask({
      ...task,
      start_date: date,
    })
  }

  const handleEndDateChange = (date) => {
    setTask({
      ...task,
      end_date: date,
    })
  }

  const handleUpdateTask = async () => {
    try {
      setLoading(true)
      const formattedTask = {
        ...task,
        start_date: format(task.start_date, "yyyy-MM-dd"),
        end_date: format(task.end_date, "yyyy-MM-dd"),
      }
      await api.put(`tasks/${editingTask.id}/edit/`, formattedTask)
      showToast("Task updated successfully!")
      setEditingTask(null)
      fetchTasks()
    } catch (error) {
      showToast("Error updating task", "error")
      console.error("Error updating task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative max-h-[80vh] overflow-y-auto border border-gray-200">
          {/* Close Icon */}
          <button
            onClick={() => setEditingTask(null)}
            className="absolute top-6 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>

          <h3 className="text-xl font-bold mb-4">Edit Task</h3>

          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task Title"
              className={`border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none 
                ${
                  isDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white cursor-text"
                }`}
              disabled={isDisabled}
            />
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Task Description"
              className={`border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none 
                ${
                  isDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white cursor-text"
                }`}
              disabled={isDisabled}
            />
          </div>

          {/* Select Project */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Project</label>
            <select
              name="project"
              value={task.project}
              onChange={handleProjectChange}
              className={`border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none 
                ${
                  isDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white cursor-text"
                }`}
              disabled={isDisabled}
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

          {usertype === "SuperAdmin" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Account Manager
              </label>
              <select
                name="assigned_to"
                value={task.assigned_to || ""}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!accountManagers.length}
              >
                <option value="" disabled>
                  {accountManagers.length
                    ? "Select Account Manager"
                    : "No Account Managers Available"}
                </option>

                {accountManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {usertype === "Admin" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Team Leader
              </label>
              {teamLeaders.length > 0 ? (
                <select
                  name="assigned_to"
                  value={task.assigned_to ? String(task.assigned_to) : ""}
                  onChange={handleChange}
                  className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Team Leader
                  </option>

                  {/*  Find assigned leader's username dynamically */}
                  {task.assigned_to &&
                    teamLeaders.some(
                      (leader) => leader.id === task.assigned_to
                    ) && (
                      <option key={task.assigned_to} value={task.assigned_to}>
                        {teamLeaders.find(
                          (leader) => leader.id === task.assigned_to
                        )?.username || "Not Assigned"}
                      </option>
                    )}

                  {/*  Show other available leaders, excluding the assigned one */}
                  {teamLeaders
                    .filter((leader) => leader.id !== task.assigned_to)
                    .map((leader) => (
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

          {/* Assign to Team Member (TeamLeader Only) */}
          {usertype === "TeamLeader" && filteredTeamMembers.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Team Member
              </label>
              <select
                name="assigned_to"
                value={task.assigned_to ? String(task.assigned_to) : ""}
                onChange={handleChange}
                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Team Member
                </option>

                {/* Find and Show Assigned User */}
                {task.assigned_to &&
                  filteredTeamMembers.some(
                    (member) => member.id === task.assigned_to
                  ) && (
                    <option key={task.assigned_to} value={task.assigned_to}>
                      {filteredTeamMembers.find(
                        (member) => member.id === task.assigned_to
                      )?.username || "Not Assigned"}
                    </option>
                  )}

                {/*  Show Other Available Members, Excluding the Assigned One */}
                {filteredTeamMembers
                  .filter((member) => member.id !== task.assigned_to)
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.username}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <DatePicker
              selected={task.start_date}
              onChange={handleStartDateChange}
              className={`border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none 
                ${
                  isDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white cursor-text"
                }`}
              disabled={isDisabled}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={task.end_date}
              onChange={handleEndDateChange}
              className={`border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none 
                ${
                  isDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white cursor-text"
                }`}
              disabled={isDisabled}
            />
          </div>
          <button
            onClick={handleUpdateTask}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded w-full transition duration-300"
            style={{ width: "100%" }}
          >
            Update Task
          </button>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 w-full">
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

export default EditTask
