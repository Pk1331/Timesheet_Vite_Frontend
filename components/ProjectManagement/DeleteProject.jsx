import React, { useState } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Button, CircularProgress } from "@mui/material"
import api from "../../src/api"

const DeleteProject = ({ projectId, fetchProjects, closeMenu, showToast }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await api.delete(`/projects/${projectId}/delete/`)
      fetchProjects()
      showToast("Project deleted successfully!")
      closeMenu()
    } catch (error) {
      showToast("Failed to delete project", "error") 
      console.error("Error deleting project:", error)
    }
    setLoading(false)
  }

  return (
    <Button
      onClick={handleDelete}
      color="secondary"
      disabled={loading}
      variant="contained"
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: "white" }} />
      ) : (
        "Delete"
      )}
    </Button>
  )
}

export default DeleteProject
