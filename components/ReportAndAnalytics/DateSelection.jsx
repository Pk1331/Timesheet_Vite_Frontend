import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import {
  format,
  subWeeks,
  addWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns"
import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Popover,
  TextField,
} from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

const dateOptions = ["This Week", "This Month", "This Year", "Custom"]

const DateSelection = ({ onDateChange }) => {
  const [selectedRange, setSelectedRange] = useState("This Week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [anchorEl, setAnchorEl] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  })

  // Recalculate date range whenever selectedRange or currentDate changes
  useEffect(() => {
    console.log("useEffect triggered")
    console.log("currentDate:", currentDate)
    console.log("selectedRange:", selectedRange)
    updateParentDateRange()
  }, [selectedRange, currentDate, customDateRange])

  // Recalculate start and end date based on current selection
  const getDateRange = () => {
    switch (selectedRange) {
      case "This Week":
        console.log("Calculating 'This Week' range")
        const startOfThisWeek = startOfWeek(currentDate, { weekStartsOn: 1 })
        const endOfThisWeek = endOfWeek(currentDate, { weekStartsOn: 1 })
        console.log("Start of this week:", startOfThisWeek)
        console.log("End of this week:", endOfThisWeek)
        return `${format(startOfThisWeek, "dd MMM")} → ${format(
          endOfThisWeek,
          "dd MMM"
        )}`
      case "This Month":
        console.log("Calculating 'This Month' range")
        return format(currentDate, "MMMM yyyy")
      case "This Year":
        console.log("Calculating 'This Year' range")
        return "1 Jan → 31 Dec"
      case "Custom":
        console.log("Calculating 'Custom' range")
        return `${format(customDateRange.startDate, "dd/MM/yyyy")} → ${format(
          customDateRange.endDate,
          "dd/MM/yyyy"
        )}`
      default:
        return "Select Date Range"
    }
  }

  const updateParentDateRange = () => {
    let startDate, endDate

    switch (selectedRange) {
      case "This Week":
        console.log("Updating 'This Week' range")
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
        endDate = endOfWeek(currentDate, { weekStartsOn: 1 })
        break
      case "This Month":
        console.log("Updating 'This Month' range")
        startDate = startOfMonth(currentDate)
        endDate = endOfMonth(currentDate)
        break
      case "This Year":
        console.log("Updating 'This Year' range")
        startDate = startOfYear(currentDate)
        endDate = endOfYear(currentDate)
        break
      case "Custom":
        console.log("Updating 'Custom' range")
        startDate = customDateRange.startDate
        endDate = customDateRange.endDate
        break
      default:
        return
    }

    console.log("Calculated startDate:", startDate)
    console.log("Calculated endDate:", endDate)

    // Pass the updated range to the parent component
    onDateChange(selectedRange, { startDate, endDate })
  }

  // Handle previous date navigation
  const handlePrevious = () => {
    console.log("Navigating to previous")
    let newDate
    switch (selectedRange) {
      case "This Week":
        newDate = subWeeks(currentDate, 1)
        break
      case "This Month":
        newDate = subMonths(currentDate, 1)
        break
      case "This Year":
        newDate = subYears(currentDate, 1)
        break
      default:
        return
    }
    console.log("New Date after Previous:", newDate)
    setCurrentDate(newDate) // Update current date
  }

  // Handle next date navigation
  const handleNext = () => {
    console.log("Navigating to next")
    let newDate
    switch (selectedRange) {
      case "This Week":
        newDate = addWeeks(currentDate, 1)
        break
      case "This Month":
        newDate = addMonths(currentDate, 1)
        break
      case "This Year":
        newDate = addYears(currentDate, 1)
        break
      default:
        return
    }
    console.log("New Date after Next:", newDate)
    setCurrentDate(newDate) // Update current date
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      p={2}
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 2,
        width: "fit-content",
      }}
    >
      <Button
        variant="outlined"
        endIcon={<ChevronDown size={16} />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {selectedRange}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {dateOptions.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              setSelectedRange(option)
              setAnchorEl(null)
              if (option === "Custom") setShowDatePicker(true)
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      {!["This Year", "Custom"].includes(selectedRange) && (
        <>
          <IconButton onClick={handlePrevious}>
            <ChevronLeft size={20} />
          </IconButton>
          <Typography variant="body1">{getDateRange()}</Typography>
          <IconButton onClick={handleNext}>
            <ChevronRight size={20} />
          </IconButton>
        </>
      )}

      {selectedRange === "This Year" && (
        <Typography variant="body1">{getDateRange()}</Typography>
      )}

      <Popover
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 50, left: window.innerWidth / 2 - 150 }}
      >
        <Box p={2} sx={{ bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" mb={1}>
            Select Date Range
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" gap={2}>
              <DatePicker
                label="Start Date"
                value={customDateRange.startDate}
                onChange={(date) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    startDate: date || prev.startDate,
                  }))
                }
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={customDateRange.endDate}
                onChange={(date) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    endDate: date || prev.endDate,
                  }))
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              setShowDatePicker(false)
              updateParentDateRange() // Update the parent when custom date is applied
            }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default DateSelection
 