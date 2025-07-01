"use client"

import { useAuth } from "@/hooks/use-auth"

export default function StudentDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] || "Student"

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {firstName}!
      </h1>
      <h2 className="mt-4 text-lg text-gray-600">
        Please head to the <a href="/student/courses" className="text-green-600 hover:underline">Courses</a> section to continue your learning.
      </h2>
    </div>
  )
}
