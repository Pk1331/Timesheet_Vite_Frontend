import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Lottie from "lottie-react"
import { motion } from "framer-motion"
import logoutAnimation from "../../src/assets/signout.json"
import { toast } from "react-toastify"
import api from "../../src/api"

const Logout = () => {
  const navigate = useNavigate()
  const [showLoader, setShowLoader] = useState(true)
  const text = "Logging out..."

  const logoutUser = async () => {
    try {
      const response = await api.post("logout/")
      if (response.status === 200) {
        console.log("Logout successful")
        localStorage.clear() 
        toast.success("Successfully logged out!") 
        setTimeout(() => {
          navigate("/") 
        }, 3000)
      } else {
        console.error("Logout failed:", response.statusText)
        toast.error("Logout failed!")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Error during logout!")
    }
  }

  
  useEffect(() => {
    logoutUser() 
  }, [])

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      {showLoader && (
        <div className="flex flex-col justify-center items-center">
          <Lottie
            animationData={logoutAnimation}
            loop
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
          />
          <div className="mt-4 text-white text-4xl font-semibold flex">
            {text.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 150,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Logout
