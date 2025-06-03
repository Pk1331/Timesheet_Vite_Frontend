import { useEffect, useState } from "react"
import Lottie from "lottie-react"
import { motion } from "framer-motion"
import notFoundAnimation from "./assets/notfound.json"

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://timesheet-app-backend-ds6w.onrender.com/api/auth-check/",
          {
            method: "GET",
            credentials: "include",
          }
        )

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])
  if (isAuthenticated === false) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        {/* Lottie Animation */}
        <Lottie
          animationData={notFoundAnimation}
          loop
          className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
        />

        {/* "Access Denied" with Smooth Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mt-4 text-center tracking-wider font-['Poppins']"
        >
          Access Denied
        </motion.h1>

        {/* Glowing "403" with Pulse Effect */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-6xl md:text-8xl font-extrabold mt-4 text-red-500 neon-glow"
        >
          403
        </motion.p>
      </div>
    )
  }

  return element
}

export default PrivateRoute
