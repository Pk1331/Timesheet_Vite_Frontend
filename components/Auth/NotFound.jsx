import Lottie from "lottie-react"
import { motion } from "framer-motion"
import notFoundAnimation from "../../src/assets/notfound.json"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
      
      <Lottie
        animationData={notFoundAnimation}
        loop
        className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
      />

      {/* Page Not Found */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold mt-4 text-center tracking-wider font-['Poppins']"
      >
        Page Not Found
      </motion.h1>

      {/* 404 */}
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
        404
      </motion.p>
    </div>
  )
}

export default NotFound
