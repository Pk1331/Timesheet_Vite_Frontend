import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaPlus, FaMinus, FaGripLines } from "react-icons/fa"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"
import { IconButton, Tooltip } from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"

export const SortableItem = ({
  id,
  index,
  row,
  handleChange,
  handleAddRowBelow,
  handleRemoveRow,
  projects,
  submittedToUsers,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [errors, setErrors] = useState({})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const validateField = (field, value) => {
    let error = ""

    switch (field) {
      case "date":
        if (!value) error = "Date is required."
        break
      case "project":
        if (!value) error = "Project is required."
        break
      case "task":
        if (!value || value.length < 3)
          error = "Task must be at least 3 characters."
        break
      case "submittedTo":
        if (!value) error = "Please select a recipient."
        break
      case "status":
        if (!value) error = "Status is required."
        break
      case "description":
        if (!value || value.length < 5)
          error = "Description must be at least 5 characters."
        break
      case "hours":
        if (value === "" || value < 0 || value > 12)
          error = "Hours must be between 0 and 12."
        break
      default:
        break
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }))
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border-b border-gray-300 hover:bg-gray-50 transition"
    >
      <td
        className="px-4 py-3 cursor-grab border-r border-gray-300 w-12"
        {...listeners}
      >
        <FaGripLines className="w-6 h-6 text-gray-500 hover:text-gray-700 transition" />
      </td>

      {/* Select Date */}
      <td className="px-4 py-3 border-r border-gray-300 w-auto min-w-[150px]">
        <DatePicker
          selected={row.date}
          onChange={(date) => {
            handleChange(index, "date", date)
            validateField("date", date)
          }}
          className={`border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 ${
            errors.date ? "border-red-500" : ""
          }`}
          placeholderText="Select Date"
        />
        {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
      </td>

      {/* Select Project */}
      <td className="px-4 py-3 border-r border-gray-300 w-52">
        <Select
          onValueChange={(value) => {
            handleChange(index, "project", value)
            validateField("project", value)
          }}
        >
          <SelectTrigger
            className={`w-full bg-white text-black border border-gray-300 rounded-md shadow-sm ${
              errors.project ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border border-gray-300 shadow-lg rounded-md">
            {projects.map((project) => (
              <SelectItem
                key={project.id}
                value={project.name}
                className="bg-white text-black hover:bg-gray-100"
              >
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project && (
          <p className="text-red-500 text-xs">{errors.project}</p>
        )}
      </td>

      {/* Enter the Task */}
      <td className="px-4 py-3 border-r border-gray-300 w-auto min-w-[400px]">
        <Input
          type="text"
          value={row.task}
          onChange={(e) => {
            handleChange(index, "task", e.target.value)
            validateField("task", e.target.value)
          }}
          className={`w-full ${errors.task ? "border-red-500" : ""}`}
          placeholder="Enter task"
        />
        {errors.task && <p className="text-red-500 text-xs">{errors.task}</p>}
      </td>

      {/* Select Submitted To */}
      <td className="px-4 py-3 border-r border-gray-300 w-52">
        <Select
          onValueChange={(value) => {
            handleChange(index, "submittedTo", value)
            validateField("submittedTo", value)
          }}
        >
          <SelectTrigger
            className={`w-full bg-white text-black border border-gray-300 rounded-md shadow-sm ${
              errors.submittedTo ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border border-gray-300 shadow-lg rounded-md">
            {submittedToUsers.map((user) => (
              <SelectItem
                key={user.id}
                value={user.username}
                className="bg-white text-black hover:bg-gray-100"
              >
                {user.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.submittedTo && (
          <p className="text-red-500 text-xs">{errors.submittedTo}</p>
        )}
      </td>

      {/* Select Status */}
      <td className="px-4 py-3 border-r border-gray-300 w-40">
        <Select
          onValueChange={(value) => {
            handleChange(index, "status", value)
            validateField("status", value)
          }}
        >
          <SelectTrigger
            className={`w-full bg-white text-black border border-gray-300 rounded-md shadow-sm ${
              errors.status ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border border-gray-300 shadow-lg rounded-md">
            {["To Do", "On Progress", "On Hold", "Completed"].map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="bg-white text-black hover:bg-gray-100"
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-500 text-xs">{errors.status}</p>
        )}
      </td>

      {/* Enter Description */}
      <td className="px-4 py-3 border-r border-gray-300 w-auto min-w-[200px]">
        <Textarea
          value={row.description}
          onChange={(e) => {
            handleChange(index, "description", e.target.value)
            validateField("description", e.target.value)
          }}
          className={`w-full ${errors.description ? "border-red-500" : ""}`}
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description}</p>
        )}
      </td>

      {/* Enter Hours */}
      <td className="px-4 py-3 border-r border-gray-300 min-w-[150px] text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() =>
              handleChange(
                index,
                "hours",
                Math.max(0, (parseFloat(row.hours) || 0) - 0.5).toFixed(1)
              )
            }
            className="px-2 py-1 bg-gray-200 rounded-l"
          >
            −
          </button>
          <input
            type="text"
            value={row.hours}
            onChange={(e) => {
              let value = e.target.value
              if (value === "") {
                handleChange(index, "hours", "")
                return
              }
              let floatValue = Math.max(0, Math.min(12, parseFloat(value) || 0))
              handleChange(index, "hours", floatValue.toFixed(1))
              validateField("hours", floatValue)
            }}
            className={`w-14 text-center border border-gray-300 focus:ring-2 focus:ring-blue-500 ${
              errors.hours ? "border-red-500" : ""
            }`}
            placeholder="0-12"
          />
          <button
            onClick={() =>
              handleChange(
                index,
                "hours",
                Math.min(12, (parseFloat(row.hours) || 0) + 0.5).toFixed(1)
              )
            }
            className="px-2 py-1 bg-gray-200 rounded-r"
          >
            +
          </button>
        </div>
        {errors.hours && (
          <p className="text-red-500 text-xs mt-1">{errors.hours}</p>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 border-r border-gray-300 min-w-[100px] text-center">
        <div className="flex items-center justify-center space-x-2">
          <Tooltip title="Add Row">
            <IconButton
              onClick={() => handleAddRowBelow(index)}
              color="success"
              size="small"
            >
              <AddCircleIcon fontSize="medium" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Remove Row">
            <IconButton
              onClick={() => handleRemoveRow(index)}
              color="error"
              size="small"
            >
              <RemoveCircleIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </div>
      </td>
    </tr>
  )
}
