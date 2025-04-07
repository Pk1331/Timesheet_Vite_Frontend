import React, { useEffect, useState } from "react"
import Select from "react-select"
import { Box, Button, TextField, Typography } from "@mui/material"
import { CloudUpload, Send } from "@mui/icons-material"
import api from "../../src/api"
import Lottie from "lottie-react"
import loaderAnimation from "../../src/assets/myloader2.json"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const SendTelegram = () => {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("all-users/")
        const userOptions = response.data.users.map((user) => ({
          value: user.id,
          label: user.username,
        }))
        setUsers(userOptions)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (!selectedUsers.length || !message.trim()) {
      alert("Please select users and enter a message.")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append(
      "users",
      JSON.stringify(selectedUsers.map((user) => user.value))
    )
    formData.append("message", message)
    if (file) {
      formData.append("file", file)
    }

    try {
      await api.post("send-telegram/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Message Sent Successfully!")
      setSelectedUsers([])
      setMessage("")
      setFile(null)
    } catch (error) {
      toast.error("Something Went Wrong...")
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          maxWidth: 500,
          margin: "auto",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          Send Telegram Message
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Multi-Select Users using react-select */}
          <div className="border border-gray-300 p-3 rounded-lg w-full bg-gray-50">
            <p className="font-semibold text-gray-700 mb-2">Select User</p>
            <Select
              isMulti
              options={users}
              value={selectedUsers}
              onChange={handleUserChange}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={{
                control: (styles) => ({
                  ...styles,
                  backgroundColor: "white",
                  borderColor: "#D1D5DB",
                  boxShadow: "none",
                  ":hover": { borderColor: "#9CA3AF" },
                }),
                menu: (styles) => ({
                  ...styles,
                  backgroundColor: "white",
                  zIndex: 1000,
                }),
                option: (styles, { isFocused, isSelected }) => ({
                  ...styles,
                  backgroundColor: isSelected
                    ? "#3B82F6"
                    : isFocused
                    ? "#E2E8F0"
                    : "white",
                  color: isSelected ? "white" : "#1F2937",
                }),
                placeholder: (styles) => ({
                  ...styles,
                  color: "#9CA3AF",
                }),
              }}
            />
          </div>

          {/* Message Input */}
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* File Upload */}
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{ my: 2 }}
          >
            Attach File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {file && (
            <Typography variant="body2" color="textSecondary">
              Attached: {file.name}
            </Typography>
          )}

          {/* Send Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Send />}
          >
            Send Message
          </Button>
        </form>
      </Box>

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

export default SendTelegram
