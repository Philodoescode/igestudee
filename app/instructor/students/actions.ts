'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function deleteStudents(studentIds: string[]): Promise<{ success: boolean; message: string }> {
  if (!studentIds || studentIds.length === 0) {
    return { success: false, message: "No students selected." }
  }

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