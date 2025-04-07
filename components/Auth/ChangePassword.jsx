import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import api from "../../src/api"
import { FaLock, FaUnlockAlt, FaEye, FaEyeSlash } from "react-icons/fa"

const ChangePassword = () => {
  const [step, setStep] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [receivedCode, setReceivedCode] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const navigate = useNavigate()

  useEffect(() => {
    const userType = localStorage.getItem("usertype")
    if (userType) {
      setIsLoggedIn(true)
      setStep(3)
    }
  }, [])

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleRequestCode = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("request-password-reset-code/", {
        username_or_email: usernameOrEmail,
      })
      setReceivedCode(response.data.code)
      setStep(2)
      toast.success("Verification code sent to your Telegram")
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      )
    }
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    if (verificationCode === receivedCode) {
      setStep(3)
    } else {
      toast.error("Verification code does not match")
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    try {
      const payload = isLoggedIn
        ? {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }
        : {
            username_or_email: usernameOrEmail,
            verification_code: verificationCode,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }
      try {
        const response = await api.post("change-password/", payload)
        if (response.data.status === "success") {
          toast.success("Password changed successfully", { autoClose: 2000 })
          navigate("/")
        }
      } catch (error) {
        toast.error("Password change failed")
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      )
    }
  }

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Header */}
      <header className="bg-[#ED2224] py-4 shadow-md flex justify-center items-center">
        <div className="relative w-40 h-12">
          <img
            src="/Logo/ivista_logo.svg"
            alt="Company Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow bg-gray-100">
        {/* Left Section */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center bg-white relative">
          <img
            src="/Password/Reset.svg"
            alt="Background Image"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Right Section - Change Password Form */}
        <div className="md:w-1/2 flex justify-center items-center p-6">
          <div className="bg-white p-8 shadow-xl w-full max-w-lg rounded-lg border border-gray-200">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              {isLoggedIn ? "Change Password" : "Reset Password"}
            </h2>

            {step === 1 && (
              <form onSubmit={handleRequestCode} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-500 text-white p-3 rounded-lg w-full hover:bg-red-600 transition duration-300 font-semibold shadow-md"
                >
                  Request Verification Code
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-500 text-white p-3 rounded-lg w-full hover:bg-red-600 transition duration-300 font-semibold shadow-md"
                >
                  Verify Code
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleChangePassword} className="space-y-5">
                {/* Show Current Password for Logged-in Users Only */}
                {isLoggedIn && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Current Password
                    </label>
                    <div className="flex items-center border border-gray-300 p-3 rounded-lg relative bg-gray-50">
                      <FaLock className="text-red-500 mr-2" />
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-transparent outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.current ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    New Password
                  </label>
                  <div className="flex items-center border border-gray-300 p-3 rounded-lg relative bg-gray-50">
                    <FaUnlockAlt className="text-red-500 mr-2" />
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.new ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Confirm New Password
                  </label>
                  <div className="flex items-center border border-gray-300 p-3 rounded-lg relative bg-gray-50">
                    <FaUnlockAlt className="text-red-500 mr-2" />
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.confirm ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-red-500 text-white p-3 rounded-lg w-full hover:bg-red-600 transition duration-300 font-semibold shadow-md"
                >
                  {isLoggedIn ? "Change Password" : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Footer - Always Sticks to Bottom */}
      <footer className="bg-black py-4 text-center text-white text-sm shadow-md">
        © {new Date().getFullYear()} iVistaz Ecom Services. All Rights Reserved.
      </footer>
    </div>
  )
}

export default ChangePassword
