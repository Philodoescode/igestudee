'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GuardianProfile } from "@/types/student"

export async function deleteStudents(studentIds: string[]): Promise<{ success: boolean; message: string }> {
  if (!studentIds || studentIds.length === 0) {
    return { success: false, message: "No students selected." }
  }

  // NOTE: Using Admin Client for deletion as it requires elevated privileges
  const supabaseAdmin = createAdminClient()

  const { error } = await supabaseAdmin.rpc('delete_student_profiles', {
    p_student_ids: studentIds,
  })

  if (error) {
    console.error("Error deleting students:", error)
    return { success: false, message: `Failed to delete students: ${error.message}` }
  }

  revalidatePath("/instructor/students")
  return { success: true, message: `Successfully deleted ${studentIds.length} student(s).` }
}


export async function getGuardiansForStudent(studentId: string): Promise<GuardianProfile[]> {
  // NOTE: Using Server Client here as it runs with the user's session
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_student_guardians', { p_student_id: studentId })

  if (error) {
    console.error("Error fetching guardians:", error)
    return [] // Return empty array on error
  }

  return data || []
}