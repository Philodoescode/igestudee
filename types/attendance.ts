// types/attendance.ts

// Represents a single day's attendance for a student in a course
export type AttendanceDetail = {
  id: string
  date: string
  status: "Present" | "Absent" | "Tardy"
}

// A detailed record of a student's attendance for a specific session
export type TAttendanceRecord = {
  studentId: string
  name: string
  status: "Present" | "Absent" | "Tardy"
}

// A record for a single attendance-taking session
export type TAttendanceSession = {
  id: string
  date: string
  records: TAttendanceRecord[]
}

// A denormalized view of a group for the attendance page, including all its sessions
export type TAttendanceGroup = {
  id: string
  name: string
  course: string
  studentCount: number
  students: { id: string; name: string }[]
  sessions: TAttendanceSession[]
}