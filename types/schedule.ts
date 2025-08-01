// types/schedule.ts

// Represents a scheduled session created by a TA
export type TASession = {
  id: string
  title: string
  description?: string
  dateTime: string // ISO 8601 format
  durationMinutes: number
  meetingLink: string
}

// Represents a TA's availability for a given day of the week
export type TAAvailabilitySlot = {
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
  slots: string[] // e.g., ["09:00-11:00", "14:00-17:00"]
}