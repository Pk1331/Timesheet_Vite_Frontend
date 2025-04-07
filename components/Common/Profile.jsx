import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaSave, FaLock } from "react-icons/fa"
import api from "../../src/api"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
  })
  const [originalUserInfo, setOriginalUserInfo] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("user_id")
        const response = await api.get(`users/${userId}/`)
        setUserInfo(response.data)
        setOriginalUserInfo(response.data)
      } catch (error) {
        console.error("Error fetching user info:", error)
      }
    }

    fetchUserInfo()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }))
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleUpdateProfile = async () => {
    const trimmedUserInfo = {
      ...userInfo,
      first_name: userInfo.first_name.trim(),
      last_name: userInfo.last_name.trim(),
    }

    if (!validateEmail(trimmedUserInfo.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (JSON.stringify(trimmedUserInfo) === JSON.stringify(originalUserInfo)) {
      toast.info("No changes detected. Update not required.")
      return
    }

    try {
      const userId = localStorage.getItem("user_id")
      await api.put(`update-profile/${userId}/`, trimmedUserInfo)
      toast.success("Profile updated successfully")
      setOriginalUserInfo(trimmedUserInfo)
      setUserInfo(trimmedUserInfo)
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Error updating profile:", error)
    }
  }

  const handleChangePassword = () => {
    navigate("/change-password")
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Profile Settings
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={userInfo.first_name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={userInfo.last_name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleUpdateProfile}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaSave className="inline-block mr-2" />
          Update Profile
        </button>

        <button
          onClick={handleChangePassword}
          className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-md font-medium text-lg hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <FaLock className="inline-block mr-2" />
          Change Password
        </button>
      </div>
    </div>
  )
}

export default Profile
