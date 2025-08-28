import { createClient } from "@/lib/supabase/server"
import { StudentTable } from "../components/student-table"
import type { StudentRoster } from "@/types/student"
import { Toaster } from "@/components/ui/sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cookies } from "next/headers" 

export default async function StudentManagementPage() {
  cookies() 

  const supabase = createClient()
  // MODIFIED: Call the new, simpler RPC function
  const { data: students, error } = await supabase.rpc("get_all_students_roster")

  console.log("ALL STUDENTS ROSTER DATA:", JSON.stringify(students, null, 2));
  if (error) {
    console.error("ALL STUDENTS ROSTER ERROR:", error);
  }

  if (error) {
    console.error("Error fetching all students roster:", error)
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
                Could not retrieve the student roster. Please try again later.
                <pre className="mt-2 whitespace-pre-wrap text-xs">{error.message}</pre>
            </AlertDescription>
        </Alert>
    )
  }

  const formattedStudents: StudentRoster[] = (students || []).map(s => ({
    id: s.id,
    fullName: s.full_name,
    email: s.email,
    phone: s.phone_number,
    dob: s.date_of_birth,
    guardianName: s.guardian_name,
    groups: s.groups || [],
  }));

  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
        <p className="text-gray-600 mt-1">
          A centralized place to view, manage, and export all student data in the system.
        </p>
      </div>
      <StudentTable data={formattedStudents} />
    </div>
  )
}