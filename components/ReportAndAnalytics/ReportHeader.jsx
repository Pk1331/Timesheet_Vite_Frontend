import React, { useState, useEffect } from "react"
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Box,
  Button,
  Menu,
} from "@mui/material"
import { Download as DownloadIcon } from "@mui/icons-material"

const ReportHeader = ({
  setSelectedUser,
  setSelectedProject,
  handleDownload,
}) => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", team: "Dev" },
    { id: 2, name: "Jane Smith", team: "Dev" },
    { id: 3, name: "Alice Johnson", team: "Dev" },
    { id: 4, name: "Bob Brown", team: "Dev" },
    { id: 5, name: "Charlie Davis", team: "Dev" },
  ])

  const [projects, setProjects] = useState([
    { id: 101, name: "Project Alpha" },
    { id: 102, name: "Project Beta" },
    { id: 103, name: "Project Gamma" },
  ])

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    // Uncomment when backend is ready
    // fetch("/api/users")
    //   .then((res) => res.json())
    //   .then((data) => setUsers(data))
    //   .catch((err) => console.error("Error fetching users:", err))
    // fetch("/api/projects")
    //   .then((res) => res.json())
    //   .then((data) => setProjects(data))
    //   .catch((err) => console.error("Error fetching projects:", err))
  }, [])

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (format) => {
    setAnchorEl(null)
    if (format) {
      handleDownload(format) // Pass selected format to parent function
    }
  }

  return (
    <Box p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>User</InputLabel>
            <Select
              defaultValue=""
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <MenuItem value="">All Users</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Project</InputLabel>
            <Select
              defaultValue=""
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <MenuItem value="">All Projects</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Download Button */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleMenuClick}
            fullWidth
          >
            Download
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleMenuClose(null)}
          >
            <MenuItem onClick={() => handleMenuClose("csv")}>CSV</MenuItem>
            <MenuItem onClick={() => handleMenuClose("xlsx")}>
              Excel (.xlsx)
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReportHeader
