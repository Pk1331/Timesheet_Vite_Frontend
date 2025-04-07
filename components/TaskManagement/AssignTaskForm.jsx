import React, { useState, useEffect } from "react"
import api from "../../src/api"
import { FaTimes } from "react-icons/fa"
import Lottie from "lottie-react"
import loaderAnimation from "../../src/assets/myloader2.json"

const AssignTaskForm = ({
  assignTask,
  setassignTask,
  fetchTasks,
  showToast,
}) => {
  console.log(assignTask.id)
  const [usertype, setUsertype] = useState("")
  const [projects, setProjects] = useState([])
  const [teamLeaders, setTeamLeaders] = useState([])
  const [selectedTeamLeader, setSelectedTeamLeader] = useState("")
  const [assignedTeam, setAssignedTeam] = useState(null)
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([])
  const [selectedSubteamMember, setSelectedSubteamMember] = useState("")
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
      console.log(projectsResponse.data.projects)
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

  useEffect(() => {
    if (assignTask?.project) {
      const selectedProject = projects.find(
        (project) => project.id === assignTask.project.id
      )
      if (selectedProject) {
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
        setTeamLeaders(leaders)
        setSelectedTeamLeader("")
        setSelectedSubteamMember("")
      }
    }
  }, [assignTask, projects])

  const handleTeamLeaderChange = (e) => {
    setSelectedTeamLeader(e.target.value)
  }

  const handleSubteamMemberChange = (e) => {
    setSelectedSubteamMember(e.target.value)
  }

  const handleAssign = async () => {
    setLoading(true)
    try {
      let assignedTo = selectedTeamLeader
      if (usertype === "TeamLeader") {
        assignedTo = selectedSubteamMember
      }
      await api.post(`tasks/${assignTask.id}/assign/`, {
        assigned_to: assignedTo,
      })
      showToast("Task assigned successfully")
      setassignTask(null)
      fetchTasks()
    } catch (error) {
      showToast("Error assigning task", "error")
      console.error("Error assigning task:", error)
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
            onClick={() => setassignTask(null)}
            className="absolute top-6 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>

          <h3 className="text-xl font-bold mb-4">Assign Task</h3>

          {usertype === "Admin" && teamLeaders.length > 0 ? (
            <select
              name="assigned_to"
              value={selectedTeamLeader}
              onChange={handleTeamLeaderChange}
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

          {usertype === "TeamLeader" && filteredTeamMembers.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Assign to Team Member
              </label>
              <select
                name="assigned_to"
                value={selectedSubteamMember}
                onChange={handleSubteamMemberChange}
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

          <div className="flex justify-end space-x-4 mt-3">
            <button
              onClick={() => setassignTask(null)}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className={`bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center justify-center space-x-2 transition duration-300 ${
                (
                  usertype === "Admin"
                    ? !selectedTeamLeader
                    : !selectedSubteamMember
                )
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                usertype === "Admin"
                  ? !selectedTeamLeader
                  : !selectedSubteamMember
              }
            >
              Assign
            </button>
          </div>
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

export default AssignTaskForm
