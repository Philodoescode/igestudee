"use client"

import { useAuth } from "@/hooks/use-auth"

export default function TADashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")[0] || "TA"

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {firstName}!
      </h1>
      <h2 className="mt-4 text-lg text-gray-600">
        Please head to the <a href="/ta/courses" className="text-green-600 hover:underline">Courses & Groups</a> section to manage your students.
      </h2>
    </div>
  )
}