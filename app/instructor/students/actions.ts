'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GuardianProfile } from "@/types/student"

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


export async function getGuardiansForStudent(studentId: string): Promise<GuardianProfile[]> {
  const supabase = createClient()
  
  // FINAL FIX: Changed the parameter key to the simplified 'student_id'
  const { data, error } = await supabase.rpc('get_student_guardians', { 
    student_id: studentId 
  })

  if (error) {
    console.error("Error fetching guardians:", error)
    throw new Error("Failed to fetch guardian information.")
  }

  return data || []
}

export async function setPrimaryGuardian(studentId: string, guardianId: number): Promise<{ success: boolean, message: string }> {
    const supabase = createClient()
    
    const { error } = await supabase.rpc('set_primary_guardian', {
        p_student_id: studentId,
        p_guardian_id: guardianId
    })

    if (error) {
        console.error("Error setting primary guardian:", error)
        return { success: false, message: `Failed to update primary guardian: ${error.message}` }
    }

    revalidatePath('/instructor/students')
    return { success: true, message: "Primary guardian updated successfully." }
}