import React, { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import api from "../../src/api"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"

const Login = () => {
  const [superuser, setsuperuser] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setsuperuser((data) => ({ ...data, [e.target.name]: e.target.value }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("login/", superuser)
      if (response.data.status === "success") {
        const {
          firstname,
          username,
          usertype,
          email,
          user_id,
          access_token_expiry,
        } = response.data

        // Store necessary data in localStorage
        localStorage.setItem("firstname", firstname)
        localStorage.setItem("username", username)
        localStorage.setItem("usertype", usertype)
        localStorage.setItem("email", email)
        localStorage.setItem("user_id", user_id)
        localStorage.setItem("access_token_expiry", access_token_expiry)

        toast.success("Login successful! Redirecting...", { autoClose: 2000 })

        setTimeout(() => {
          const routes = {
            SuperAdmin: "/super-admin-dashboard",
            Admin: "/admin-dashboard",
            TeamLeader: "/team-leader-dashboard",
            User: "/user-dashboard",
          }
          navigate(routes[usertype] || "/")
        }, 2000)

        setsuperuser({ username: "", password: "" })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Username is incorrect")
        } else if (error.response.status === 401) {
          toast.error("Password is incorrect")
        } else {
          toast.error(error.response.data.message || "Something went wrong!")
        }
      } else if (error.request) {
        toast.error("No response from server. Check network connection.")
      } else {
        toast.error("An unexpected error occurred.")
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-white">
          {/* Left Side - Image */}
          <div className="hidden md:block md:w-1/2 relative">
            <img
              src="/Login/Loginpage.svg"
              alt="Background Image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-md">
              <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Please sign in to your account
              </p>
              <form
                onSubmit={handleSubmit}
                className="space-y-5 border border-gray-300 p-6 rounded-lg bg-white shadow-md"
                method="POST"
              >
                {/* Username */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                    value={superuser.username}
                    name="username"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      name="password"
                      value={superuser.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEye className="text-gray-500" />
                      ) : (
                        <FaEyeSlash className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
                  type="submit"
                >
                  Sign In
                </button>
              </form>

              {/* Forgot Password */}
              <p className="text-center text-gray-600 mt-4">
                Forgot your password?{" "}
                <a
                  href="/change-password"
                  className="text-blue-500 hover:underline"
                >
                  Reset here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
