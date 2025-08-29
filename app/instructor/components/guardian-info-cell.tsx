"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Row } from "@tanstack/react-table"
import type { GuardianProfile, StudentRoster } from "@/types/student"
import { getGuardiansForStudent, setPrimaryGuardian } from "../students/actions"
import { GuardianProfileModal } from "./guardian-profile-modal"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GuardianInfoCellProps {
  row: Row<StudentRoster>
}

export function GuardianInfoCell({ row }: GuardianInfoCellProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [guardians, setGuardians] = useState<GuardianProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const student = row.original
  const primaryGuardianName = student.guardianName

  const handleOpenModal = async () => {
    if (!primaryGuardianName) return
    
    setIsLoading(true)
    setIsModalOpen(true)
    try {
        const fetchedGuardians = await getGuardiansForStudent(student.id)
        setGuardians(fetchedGuardians)
    } catch (error) {
        toast.error("Failed to fetch guardian details.")
        setIsModalOpen(false)
    } finally {
        setIsLoading(false)
    }
  }

  const handleSetPrimary = async (guardianId: number) => {
    const promise = setPrimaryGuardian(student.id, guardianId)
    
    toast.promise(promise, {
        loading: "Updating primary guardian...",
        success: (data) => {
            router.refresh()
            setIsModalOpen(false)
            return data.message
        },
        error: (data) => data.message,
    })
  }
  
  if (!primaryGuardianName) {
    return <span className="text-muted-foreground">Unknown</span>
  }

  // Display only first and second name
  const displayName = primaryGuardianName.split(' ').slice(0, 2).join(' ')

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="text-emerald-600 hover:underline hover:text-emerald-700 font-medium"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : displayName}
      </button>

      <GuardianProfileModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        guardians={guardians}
        studentName={student.fullName}
        isLoading={isLoading}
        onSetPrimary={handleSetPrimary}
      />
    </>
  )
}