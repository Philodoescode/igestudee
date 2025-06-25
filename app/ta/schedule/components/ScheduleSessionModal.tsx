"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, set } from "date-fns"
import { Loader2, AlertCircle } from "lucide-react"
import { type TASession, type TAAvailabilitySlot } from "@/lib/database"

interface ScheduleSessionModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: (session: TASession) => void
  sessionToEdit: TASession | null
  availability: TAAvailabilitySlot[]
}

const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleSessionModal({ isOpen, setIsOpen, onSave, sessionToEdit, availability }: ScheduleSessionModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (sessionToEdit) {
      const sessionDate = new Date(sessionToEdit.dateTime)
      setTitle(sessionToEdit.title)
      setDescription(sessionToEdit.description || "")
      setDate(format(sessionDate, "yyyy-MM-dd"))
      setStartTime(format(sessionDate, "HH:mm"))
      const endDate = new Date(sessionDate.getTime() + sessionToEdit.durationMinutes * 60000)
      setEndTime(format(endDate, "HH:mm"))
      setMeetingLink(sessionToEdit.meetingLink)
    } else {
      // Reset form when opening for a new session
      setTitle("")
      setDescription("")
      setDate("")
      setStartTime("")
      setEndTime("")
      setMeetingLink("")
    }
    setErrors({})
  }, [sessionToEdit, isOpen])

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = "Title is required."
    if (!date) newErrors.date = "Date is required."
    if (!startTime) newErrors.startTime = "Start time is required."
    if (!endTime) newErrors.endTime = "End time is required."
    if (endTime <= startTime) newErrors.endTime = "End time must be after start time."
    if (!meetingLink.trim()) {
        newErrors.meetingLink = "Meeting link is required."
    } else if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(meetingLink)) {
        newErrors.meetingLink = "Please enter a valid URL."
    }

    // Validate against availability
    if (date && startTime && endTime) {
        const selectedDayIndex = new Date(date + 'T00:00:00').getDay();
        const selectedDayName = dayMap[selectedDayIndex] as TAAvailabilitySlot['day'];
        const dayAvailability = availability.find(a => a.day === selectedDayName);

        if (!dayAvailability || dayAvailability.slots.length === 0) {
            newErrors.date = `You are not available on ${selectedDayName}s.`
        } else {
            const isInSlot = dayAvailability.slots.some(slot => {
                const [slotStart, slotEnd] = slot.split('-');
                return startTime >= slotStart && endTime <= slotEnd;
            });
            if (!isInSlot) {
                newErrors.startTime = `The selected time is outside your available slots for ${selectedDayName}s.`
            }
        }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return

    setIsSaving(true)
    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)
    const durationMinutes = (endDateTime.getTime() - startDateTime.getTime()) / 60000

    const sessionData: TASession = {
      id: sessionToEdit?.id || `session-${Date.now()}`,
      title,
      description,
      dateTime: startDateTime.toISOString(),
      durationMinutes,
      meetingLink,
    }
    
    // Simulate API call
    setTimeout(() => {
      onSave(sessionData)
      setIsSaving(false)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{sessionToEdit ? "Edit Session" : "Schedule New Session"}</DialogTitle>
          <DialogDescription>Fill in the details for the online session.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., ICT Midterm Review" />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              {errors.startTime && <p className="text-xs text-red-500">{errors.startTime}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              {errors.endTime && <p className="text-xs text-red-500">{errors.endTime}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="meeting-link">Meeting Link</Label>
            <Input id="meeting-link" value={meetingLink} onChange={e => setMeetingLink(e.target.value)} placeholder="https://zoom.us/j/..." />
             {errors.meetingLink && <p className="text-xs text-red-500">{errors.meetingLink}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Topics to be covered, etc." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sessionToEdit ? "Save Changes" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}