import React, { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import api from "../../src/api"
import Lottie from "lottie-react"
import loaderAnimation from "../../src/assets/myloader2.json"

const UserManagement = () => {
  const [formData, setFormData] = useState({
    usertype: "",
    firstname: "",
    lastname: "",
    email: "",
    team: "",
    subteam: "",
    password: "",
    chat_id: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loggedInUsertype, setLoggedInUsertype] = useState("")
  const [loggedInUserID, setLoggedInUserID] = useState(null)
  const [loggedInUsername, setLoggedInUsername] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const usertypeParam = localStorage.getItem("usertype")
    const userID = localStorage.getItem("user_id")
    const username = localStorage.getItem("username")
    setLoggedInUsertype(usertypeParam)
    setLoggedInUserID(userID ? parseInt(userID, 10) : null)
    setLoggedInUsername(username || "")
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post("register/", formData)
      if (response.data.status === "success") {
        toast.success(response.data.usertype + " registered successfully!")
        setFormData({
          usertype: "",
          firstname: "",
          lastname: "",
          email: "",
          team: "",
          subteam: "",
          password: "",
          chat_id: "",
        })
      } else {
        toast.error(response.data.error || "Registration failed!")
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error("An error occurred during registration!")
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  if (loggedInUsertype !== "SuperAdmin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold text-red-600">
          Access Denied. Only SuperAdmin can create users.
        </h2>
      </div>
    )
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-100 p-6">
        {/* Left Section */}
        <div className="md:w-1/2 flex items-center justify-center border border-gray-300 min-h-screen rounded-s-lg">
          <img
            src="/UserManagement/img1.svg"
            alt="Background Image"
            className="rounded-lg"
          />
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center items-center bg-white min-h-screen p-6 rounded-e-lg">
          <div className="bg-white p-10 shadow-2xl w-full max-w-md rounded-xl border border-gray-200">
            <h2 className="text-4xl font-bold text-center text-red-600 mb-8">
              User Management
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6" method="POST">
              {/* User Type Selection */}
              <div className="relative">
                <select
                  name="usertype"
                  value={formData.usertype}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                >
                  <option value="" disabled>
                    Select User Type
                  </option>
                  {(loggedInUserID === 1 || loggedInUsername === "Narayan") && (
                    <option value="SuperAdmin">SuperAdmin</option>
                  )}
                  <option value="Admin">Admin</option>
                  <option value="TeamLeader">Team Leader</option>
                  <option value="User">User</option>
                </select>
              </div>

              {/* Input Fields */}
              {["firstname", "lastname", "email", "chat_id"].map(
                (field, index) => (
                  <input
                    key={index}
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.replace("_", " ")}`}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  />
                )
              )}

              {/* Team Selection */}
              {(formData.usertype === "TeamLeader" ||
                formData.usertype === "User") && (
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                >
                  <option value="" disabled>
                    Select Team
                  </option>
                  <option value="Search">Search</option>
                  <option value="Creative">Creative</option>
                  <option value="Development">Development</option>
                </select>
              )}

              {/* Subteam Selection */}
              {formData.usertype === "User" && formData.team && (
                <select
                  name="subteam"
                  value={formData.subteam}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                >
                  <option value="" disabled>
                    Select Subteam
                  </option>
                  {formData.team === "Search" && (
                    <>
                      <option value="SEO">SEO</option>
                      <option value="SMO">SMO</option>
                      <option value="SEM">SEM</option>
                    </>
                  )}
                  {formData.team === "Creative" && (
                    <>
                      <option value="Design">Design</option>
                      <option value="Content Writing">Content Writing</option>
                    </>
                  )}
                  {formData.team === "Development" && (
                    <>
                      <option value="Web Development">Web Development</option>
                      <option value="Python Development">
                        Python Development
                      </option>
                    </>
                  )}
                </select>
              )}

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye className="text-gray-600" />
                  ) : (
                    <FaEyeSlash className="text-gray-600" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Register
              </button>
            </form>
          </div>
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

export default UserManagement
