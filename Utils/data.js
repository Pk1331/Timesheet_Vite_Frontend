// utils/data.js

// User data with assigned teams
export const users = [
  { id: 1, name: "John Doe", team: "Dev" },
  { id: 2, name: "Jane Smith", team: "Dev" },
  { id: 3, name: "Alice Johnson", team: "Dev" },
  { id: 4, name: "Bob Brown", team: "Dev" },
  { id: 5, name: "Charlie Davis", team: "Dev" },
]

// Dummy data with hours worked for each user, each day (Mon-Fri)
export const dummyData = [
  // Week 1 Data (March 24 to March 28)
  { userId: 1, projectId: 101, hours: 8, date: "2025-03-24" }, // Mon
  { userId: 1, projectId: 102, hours: 7, date: "2025-03-25" }, // Tue
  { userId: 1, projectId: 103, hours: 8, date: "2025-03-26" }, // Wed
  { userId: 1, projectId: 101, hours: 6, date: "2025-03-27" }, // Thu
  { userId: 1, projectId: 102, hours: 7, date: "2025-03-28" }, // Fri

  { userId: 2, projectId: 103, hours: 7, date: "2025-03-24" }, // Mon
  { userId: 2, projectId: 102, hours: 8, date: "2025-03-25" }, // Tue
  { userId: 2, projectId: 101, hours: 6, date: "2025-03-26" }, // Wed
  { userId: 2, projectId: 103, hours: 8, date: "2025-03-27" }, // Thu
  { userId: 2, projectId: 101, hours: 7, date: "2025-03-28" }, // Fri

  { userId: 3, projectId: 101, hours: 8, date: "2025-03-24" }, // Mon
  { userId: 3, projectId: 102, hours: 8, date: "2025-03-25" }, // Tue
  { userId: 3, projectId: 103, hours: 7, date: "2025-03-26" }, // Wed
  { userId: 3, projectId: 101, hours: 8, date: "2025-03-27" }, // Thu
  { userId: 3, projectId: 102, hours: 7, date: "2025-03-28" }, // Fri

  { userId: 4, projectId: 101, hours: 6, date: "2025-03-24" }, // Mon
  { userId: 4, projectId: 102, hours: 7, date: "2025-03-25" }, // Tue
  { userId: 4, projectId: 103, hours: 8, date: "2025-03-26" }, // Wed
  { userId: 4, projectId: 101, hours: 7, date: "2025-03-27" }, // Thu
  { userId: 4, projectId: 102, hours: 8, date: "2025-03-28" }, // Fri

  { userId: 5, projectId: 103, hours: 7, date: "2025-03-24" }, // Mon
  { userId: 5, projectId: 101, hours: 6, date: "2025-03-25" }, // Tue
  { userId: 5, projectId: 102, hours: 7, date: "2025-03-26" }, // Wed
  { userId: 5, projectId: 103, hours: 8, date: "2025-03-27" }, // Thu
  { userId: 5, projectId: 101, hours: 6, date: "2025-03-28" }, // Fri

  // Week 2 Data (March 31 to April 4)
  { userId: 1, projectId: 101, hours: 8, date: "2025-03-31" }, // Mon
  { userId: 1, projectId: 102, hours: 7, date: "2025-04-01" }, // Tue
  { userId: 1, projectId: 103, hours: 8, date: "2025-04-02" }, // Wed
  { userId: 1, projectId: 101, hours: 6, date: "2025-04-03" }, // Thu
  { userId: 1, projectId: 102, hours: 7, date: "2025-04-04" }, // Fri

  { userId: 2, projectId: 103, hours: 7, date: "2025-03-31" }, // Mon
  { userId: 2, projectId: 102, hours: 8, date: "2025-04-01" }, // Tue
  { userId: 2, projectId: 101, hours: 6, date: "2025-04-02" }, // Wed
  { userId: 2, projectId: 103, hours: 8, date: "2025-04-03" }, // Thu
  { userId: 2, projectId: 101, hours: 7, date: "2025-04-04" }, // Fri

  { userId: 3, projectId: 101, hours: 8, date: "2025-03-31" }, // Mon
  { userId: 3, projectId: 102, hours: 8, date: "2025-04-01" }, // Tue
  { userId: 3, projectId: 103, hours: 7, date: "2025-04-02" }, // Wed
  { userId: 3, projectId: 101, hours: 8, date: "2025-04-03" }, // Thu
  { userId: 3, projectId: 102, hours: 7, date: "2025-04-04" }, // Fri

  { userId: 4, projectId: 101, hours: 6, date: "2025-03-31" }, // Mon
  { userId: 4, projectId: 102, hours: 7, date: "2025-04-01" }, // Tue
  { userId: 4, projectId: 103, hours: 8, date: "2025-04-02" }, // Wed
  { userId: 4, projectId: 101, hours: 7, date: "2025-04-03" }, // Thu
  { userId: 4, projectId: 102, hours: 8, date: "2025-04-04" }, // Fri

  { userId: 5, projectId: 103, hours: 7, date: "2025-03-31" }, // Mon
  { userId: 5, projectId: 101, hours: 6, date: "2025-04-01" }, // Tue
  { userId: 5, projectId: 102, hours: 7, date: "2025-04-02" }, // Wed
  { userId: 5, projectId: 103, hours: 8, date: "2025-04-03" }, // Thu
  { userId: 5, projectId: 101, hours: 6, date: "2025-04-04" }, // Fri

  // Week 3 Data (April 7 to April 11)
  { userId: 1, projectId: 101, hours: 8, date: "2025-04-07" }, // Mon
  { userId: 1, projectId: 102, hours: 7, date: "2025-04-08" }, // Tue
  { userId: 1, projectId: 103, hours: 8, date: "2025-04-09" }, // Wed
  { userId: 1, projectId: 101, hours: 6, date: "2025-04-10" }, // Thu
  { userId: 1, projectId: 102, hours: 7, date: "2025-04-11" }, // Fri

  { userId: 2, projectId: 103, hours: 7, date: "2025-04-07" }, // Mon
  { userId: 2, projectId: 102, hours: 8, date: "2025-04-08" }, // Tue
  { userId: 2, projectId: 101, hours: 6, date: "2025-04-09" }, // Wed
  { userId: 2, projectId: 103, hours: 8, date: "2025-04-10" }, // Thu
  { userId: 2, projectId: 101, hours: 7, date: "2025-04-11" }, // Fri

  { userId: 3, projectId: 101, hours: 8, date: "2025-04-07" }, // Mon
  { userId: 3, projectId: 102, hours: 8, date: "2025-04-08" }, // Tue
  { userId: 3, projectId: 103, hours: 7, date: "2025-04-09" }, // Wed
  { userId: 3, projectId: 101, hours: 8, date: "2025-04-10" }, // Thu
  { userId: 3, projectId: 102, hours: 7, date: "2025-04-11" }, // Fri
]

// Projects list (Passed as a prop)
export const projects = [
  { id: 101, name: "Project Alpha" },
  { id: 102, name: "Project Beta" },
  { id: 103, name: "Project Gamma" },
]
