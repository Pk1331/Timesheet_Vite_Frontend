import React from "react"
import { Box, Typography, Grid } from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { parseISO, isWithinInterval, format } from "date-fns"
import { users, dummyData, projects } from "../../Utils/data"

// Get the user's team
const getTeam = (userId) => {
  const user = users.find((user) => user.id === userId)
  return user ? user.team : "Unknown"
}

// Define a constant to ensure the correct order of weekdays (Mon-Fri)
const weekdaysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri"]

const ReportMain = ({ selectedDateRange, selectedUser, selectedProject }) => {
  if (
    !selectedDateRange ||
    !selectedDateRange.startDate ||
    !selectedDateRange.endDate
  ) {
    return <Typography variant="h6">Invalid Date Range</Typography>
  }

  const startDate = new Date(selectedDateRange.startDate)
  const endDate = new Date(selectedDateRange.endDate)

  // Filter data based on selected range and project
  const filteredData = dummyData.filter((entry) => {
    const entryDate = parseISO(entry.date)
    return (
      isWithinInterval(entryDate, { start: startDate, end: endDate }) &&
      (selectedUser ? entry.userId === parseInt(selectedUser) : true) &&
      (selectedProject ? entry.projectId === selectedProject : true)
    )
  })

  // Group data by day + team (or by user if selected)
  const summary = {}

  filteredData.forEach((entry) => {
    const day = format(parseISO(entry.date), "EEE") // Mon, Tue, etc.
    const key = selectedUser
      ? `${day}-${entry.userId}`
      : `${day}-${getTeam(entry.userId)}`

    if (!summary[key]) {
      summary[key] = {
        day,
        team: selectedUser
          ? users.find((user) => user.id === entry.userId).name
          : getTeam(entry.userId),
        hours: 0,
      }
    }
    summary[key].hours += entry.hours
  })

  // Create an ordered list of the summary data based on weekdaysOrder
  const chartData = weekdaysOrder
    .map((weekday) => {
      return Object.values(summary).find((entry) => entry.day === weekday)
    })
    .filter(Boolean)

  // Calculate the total hours for each user for the PieChart
  const userTotals = users.map((user) => {
    const userData = filteredData.filter((entry) => entry.userId === user.id)
    const totalHours = userData.reduce((total, entry) => total + entry.hours, 0)
    return { name: user.name, value: totalHours }
  })

  // Calculate the total hours for all users
  const totalHoursWorked = userTotals.reduce(
    (total, user) => total + user.value,
    0
  )

  // Pie chart colors (can be customized)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A1A1A1"]

  return (
    <Box mt={4} p={3} bgcolor="#fff" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" gutterBottom>
        Timesheet Report ({selectedDateRange.type})
      </Typography>

      <Grid container spacing={3}>
        {/* BarChart */}
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} hours`, "Hours Worked"]}
              />
              <Bar dataKey="hours" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* PieChart */}
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userTotals}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
                labelLine={false}
              >
                {userTotals.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const percentage = ((value / totalHoursWorked) * 100).toFixed(
                    2
                  )
                  return [`${name} - ${value} hours`, `${percentage}%`]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6">Total Weekly Hours per User:</Typography>
        {userTotals.map((user) => (
          <Typography key={user.name}>
            {user.name} - {user.value} hours
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default ReportMain
