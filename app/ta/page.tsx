"use client"

import { useRequireAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function TADashboard() {
  const { user, isLoading } = useRequireAuth(["ta"])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6 flex flex-col min-h-screen">
      {/* Welcome Header - Modified for responsiveness */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Added 'flex-wrap' to allow items to wrap to the next line on smaller screens. */}
        {/* Added 'gap-y-4' to provide vertical spacing when items wrap. */}
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your student groups today.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Teaching Assistant
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Placeholder message for the rest of the page */}
      <div className="flex-grow flex flex-col items-center justify-center text-center py-16 px-4">
        <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          The full content will be available soon.
        </p>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl">
          We're diligently working to enhance your dashboard experience with more features and detailed insights. Please check back later for exciting updates!
        </p>
      </div>
    </div>
  )
}