"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, Heart, Phone, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import type { GuardianProfile } from "@/types/student"

interface GuardianProfileModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  guardians: GuardianProfile[]
  studentName: string
  isLoading: boolean
}

export function GuardianProfileModal({
  isOpen,
  setIsOpen,
  guardians,
  studentName,
  isLoading,
}: GuardianProfileModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % guardians.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + guardians.length) % guardians.length)
  }

  const currentGuardian = guardians[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guardian Profile</DialogTitle>
          <DialogDescription>
            Contact information for {studentName}'s guardian(s).
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : !currentGuardian ? (
           <div className="flex items-center justify-center h-48 text-muted-foreground">
            No guardian information found.
          </div>
        ) : (
          <div className="py-4">
            <Card className="border-0 shadow-none">
              <CardHeader className="p-0 text-center mb-4">
                <CardTitle className="text-xl">{currentGuardian.full_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-0">
                <div className="flex items-center text-sm">
                  <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Job:</span>
                  <span className="ml-auto text-muted-foreground">{currentGuardian.job_title}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Heart className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Relationship:</span>
                  <span className="ml-auto text-muted-foreground">{currentGuardian.relationship}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <a href={`tel:${currentGuardian.phone_number}`} className="ml-auto text-emerald-600 hover:underline">
                    {currentGuardian.phone_number}
                  </a>
                </div>
              </CardContent>
            </Card>

            {guardians.length > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <p className="text-sm text-muted-foreground">
                  Guardian {currentIndex + 1} of {guardians.length}
                </p>
                <Button variant="ghost" size="sm" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}