"use client"

import { useState } from "react"
import type { Row } from "@tanstack/react-table"
import type { GuardianProfile, StudentRoster } from "@/types/student"
import { getGuardiansForStudent } from "../students/actions"
import { GuardianProfileModal } from "./guardian-profile-modal"
import { Loader2 } from "lucide-react"

interface GuardianInfoCellProps {
  row: Row<StudentRoster>
}

export function GuardianInfoCell({ row }: GuardianInfoCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [guardians, setGuardians] = useState<GuardianProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const student = row.original
  const primaryGuardianName = student.guardianName

  const handleOpenModal = async () => {
    if (!primaryGuardianName) return
    
    setIsLoading(true)
    setIsModalOpen(true)
    const fetchedGuardians = await getGuardiansForStudent(student.id)
    setGuardians(fetchedGuardians)
    setIsLoading(false)
  }
  
  if (!primaryGuardianName) {
    return <span className="text-muted-foreground">N/A</span>
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="text-emerald-600 hover:underline hover:text-emerald-700 font-medium"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : primaryGuardianName}
      </button>

      <GuardianProfileModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        guardians={guardians}
        studentName={student.fullName}
        isLoading={isLoading}
      />
    </>
  )
}