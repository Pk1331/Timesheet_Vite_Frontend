import React, { useState, useEffect } from "react"
import { FaClock } from "react-icons/fa"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material"

const TokenExpire = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)

  const getTimeLeft = (expiryTime) => {
    const now = new Date().getTime()
    const expiryDate = new Date(expiryTime).getTime()
    const difference = expiryDate - now
    return difference > 0 ? difference : 0
  }

  const formatTime = (timeInMs) => {
    const days = Math.floor(timeInMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (timeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    const accessTokenExpiry = localStorage.getItem("access_token_expiry")
    if (!accessTokenExpiry) return

    let lastReminderTime = localStorage.getItem("last_reminder_time")

    const updateTimeLeft = () => {
      const timeRemaining = getTimeLeft(accessTokenExpiry)
      setTimeLeft(formatTime(timeRemaining))

      if (timeRemaining <= 0) {
        setIsSessionExpired(true)
        handleLogout()
      } else {
        const currentHour = Math.floor(timeRemaining / (1000 * 60 * 60))
        const previousReminderHour = lastReminderTime
          ? parseInt(lastReminderTime, 10)
          : null

        if (
          timeRemaining <= 86400000 &&
          currentHour % 3 === 0 &&
          currentHour !== previousReminderHour
        ) {
          localStorage.setItem("last_reminder_time", currentHour)
          setOpenPopup(true)
        }
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  if (isSessionExpired) {
    return (
      <div className="text-center text-sm font-medium text-gray-500">
        Session expired. Redirecting...
      </div>
    )
  }

  return (
    <div className="flex justify-start items-center space-x-2">
      <FaClock className="text-black text-lg" />
      <div className="text-sm text-black font-medium">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </div>

      {/* MUI Dialog Pop-up */}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Session Expiry Reminder"}
        </DialogTitle>
        <DialogContent>
          <div>Your session will expire in {timeLeft.hours} hours!</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TokenExpire
