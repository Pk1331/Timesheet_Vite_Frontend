import api from "../../src/api"
import { Button } from "@mui/material"
import Lottie from "lottie-react"
import loaderAnimation from "../../src/assets/myloader2.json"

const DeleteTask = ({ taskId, fetchTasks, showToast, closeMenu }) => {
  const [loading, setLoading] = useState(false)
  const handleDelete = async () => {
    try {
      setLoading(true)
      await api.delete(`tasks/${taskId}/delete/`)
      fetchTasks()
      closeMenu()
      showToast("Task deleted successfully!")
    } catch (error) {
      showToast("Failed to delete task", "error")
      console.error("Error deleting task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={handleDelete} color="secondary">
        Delete
      </Button>

      {loading && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 w-full">
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

export default DeleteTask
