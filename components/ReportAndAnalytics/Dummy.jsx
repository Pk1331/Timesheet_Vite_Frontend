import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import ReportHeader from "./ReportHeader"
const dummyData = {
  totalHours: 320,
  pendingTimesheets: 12,
  approvedTimesheets: 56,
  topEmployees: [
    { name: "Alice", hours: 40 },
    { name: "Bob", hours: 38 },
    { name: "Charlie", hours: 35 },
  ],
  projectHours: [
    { name: "Project A", hours: 120 },
    { name: "Project B", hours: 90 },
    { name: "Project C", hours: 110 },
  ],
}

const ReportsAndAnalytics = () => {
  return (
    <>
      <ReportHeader />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Reports & Analytics
        </h2>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Total Hours Logged</h3>
            <p className="text-2xl text-blue-500 font-bold">
              {dummyData.totalHours}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Pending Timesheets</h3>
            <p className="text-2xl text-red-500 font-bold">
              {dummyData.pendingTimesheets}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Approved Timesheets</h3>
            <p className="text-2xl text-green-500 font-bold">
              {dummyData.approvedTimesheets}
            </p>
          </div>
        </div>

        {/* Bar Chart: Top Employees */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Top Employees by Hours Worked
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.topEmployees}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Project-wise Hours Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">
            Project-wise Hours Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.projectHours}
                dataKey="hours"
                nameKey="name"
                outerRadius={100}
              >
                {dummyData.projectHours.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#4CAF50", "#FF9800", "#2196F3"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export default ReportsAndAnalytics
