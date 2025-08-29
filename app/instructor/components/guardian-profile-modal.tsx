"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Briefcase, Heart, Phone, ChevronLeft, ChevronRight, Loader2, Star } from "lucide-react"
import type { GuardianProfile } from "@/types/student"

interface GuardianProfileModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  guardians: GuardianProfile[]
  studentName: string
  isLoading: boolean
  onSetPrimary: (guardianId: number) => void
}

export function GuardianProfileModal({
  isOpen,
  setIsOpen,
  guardians,
  studentName,
  isLoading,
  onSetPrimary,
}: GuardianProfileModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedGuardianId, setSelectedGuardianId] = useState<number | null>(null)
  
  useEffect(() => {
    if (guardians.length > 0) {
        const primary = guardians.find(g => g.is_primary)
        if (primary) {
            setSelectedGuardianId(primary.id)
            // Set the initial view to the primary guardian
            const primaryIndex = guardians.findIndex(g => g.id === primary.id)
            setCurrentIndex(primaryIndex !== -1 ? primaryIndex : 0)
        } else {
            setSelectedGuardianId(guardians[0]?.id || null) // Fallback to first
            setCurrentIndex(0)
        }
    }
  }, [guardians])


  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % guardians.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + guardians.length) % guardians.length)
  }

  const handleSave = () => {
    if (selectedGuardianId) {
        onSetPrimary(selectedGuardianId)
    }
  }

  const currentGuardian = guardians[currentIndex]
  const canSelectPrimary = guardians.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guardian Profiles</DialogTitle>
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
          <div>
            <div className="py-4">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-0 text-center mb-4">
                  <CardTitle className="text-xl flex items-center justify-center gap-2">
                    {currentGuardian.full_name}
                    {currentGuardian.is_primary && <Star className="h-5 w-5 text-amber-400 fill-amber-400" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Job:</span>
                    <span className="ml-auto text-muted-foreground">{currentGuardian.job_title || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Heart className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Relationship:</span>
                    <span className="ml-auto text-muted-foreground">{currentGuardian.relationship || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    {currentGuardian.phone_number ? (
                       <a href={`tel:${currentGuardian.phone_number}`} className="ml-auto text-emerald-600 hover:underline">
                        {currentGuardian.phone_number}
                      </a>
                    ) : (
                      <span className="ml-auto text-muted-foreground">Unknown</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {guardians.length > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Guardian {currentIndex + 1} of {guardians.length}
                  </p>
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>

            {canSelectPrimary && (
                <div className="pt-4 border-t">
                    <Label className="font-semibold">Set Primary Guardian</Label>
                    <RadioGroup value={String(selectedGuardianId)} onValueChange={(val) => setSelectedGuardianId(Number(val))} className="mt-2 space-y-1">
                        {guardians.map(g => (
                             <div key={g.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={String(g.id)} id={`g-${g.id}`} />
                                <Label htmlFor={`g-${g.id}`}>{g.full_name}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )}
             <DialogFooter className="pt-4 mt-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                {canSelectPrimary && <Button onClick={handleSave}>Save Changes</Button>}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}