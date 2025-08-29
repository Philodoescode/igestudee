// FILE: components/complete-profile-modal.tsx
"use client"

import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

interface CompleteProfileModalProps {
  isOpen: boolean
}

export function CompleteProfileModal({ isOpen }: CompleteProfileModalProps) {
  const router = useRouter()

  const handleRedirect = () => {
    // Navigate the user to their profile page to update details.
    router.push("/student/profile")
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            Action Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm text-muted-foreground">
            Please complete your profile by adding your <strong>school</strong> and <strong>grade</strong>. This helps us tailor your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={handleRedirect} 
            className="w-full bg-gossamer-800 hover:bg-gossamer-900"
          >
            Go to Profile Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}