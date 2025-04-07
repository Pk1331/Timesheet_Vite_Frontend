import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import { FaTasks, FaClock, FaCheckCircle } from "react-icons/fa"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const projectCounts = {
  ongoing: 10,
  upcoming: 5,
  completed: 30,
}

const duration = 2.5

const dummyUserData = [
  { name: "User1", hours: 40 },
  { name: "User2", hours: 35 },
  { name: "User3", hours: 30 },
  { name: "User4", hours: 25 },
  { name: "User5", hours: 60 },
  { name: "User6", hours: 55 },
  { name: "User7", hours: 100 },
  { name: "User8", hours: 120 },
  { name: "User9", hours: 123 },
  { name: "User10", hours: 143 },
]

const dummyTeamData = [
  { team: "Development", hours: 500 },
  { team: "Design", hours: 350 },
  { team: "SEO", hours: 420 },
  { team: "Content", hours: 300 },
  { team: "Marketing", hours: 480 },
]

const ProjectSummary = () => {
  // const [workingHoursData, setWorkingHoursData] = useState([])

  // useEffect(() => {
  //   fetchWorkingHoursData()
  // }, [])

  // const fetchWorkingHoursData = async () => {
  //   try {
  //     const response = await fetch("working-hours/")
  //     const data = await response.json()
  //     setWorkingHoursData(data.working_hours)
  //   } catch (error) {
  //     console.error("Error fetching working hours data:", error)
  //   }
  // }

  const top5Users = dummyUserData.sort((a, b) => b.hours - a.hours).slice(0, 5)

  return (
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8">
        {[
          {
            title: "Ongoing Projects",
            count: projectCounts.ongoing,
            icon: <FaTasks size={45} className="text-blue-500" />,
            borderColor: "border-blue-500",
          },
          {
            title: "Upcoming Projects",
            count: projectCounts.upcoming,
            icon: <FaClock size={45} className="text-yellow-500" />,
            borderColor: "border-yellow-500",
          },
          {
            title: "Completed Projects",
            count: projectCounts.completed,
            icon: <FaCheckCircle size={45} className="text-green-500" />,
            borderColor: "border-green-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center p-6 rounded-xl shadow-lg border-2 ${item.borderColor} bg-white transition-transform transform hover:scale-105 hover:shadow-xl`}
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              <CountUp start={0} end={item.count} duration={duration} />
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Top 5 Users Hours Bar Chart */}
        <div>
          <h3 className="text-xl font-bold mb-4">Top 5 Users (Hours Worked)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top5Users} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#8884d8" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Teams in X-Month Bar Chart */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            Top Teams (Hours Worked in X-Month)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyTeamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#82ca9d" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ProjectSummary
