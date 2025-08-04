import type { AttendanceDetail } from "./attendance"
import type { AssignmentDetail, QuizDetail } from "./grading"
import type { Student } from "./user"

// Represents a single video resource within a course
export type VideoDetail = {
  id: string
  title: string
  description: string
  locked: boolean
}

// Represents the overall progress of a student in a course
export type CourseProgress = {
  assignmentsCompleted: number // Percentage, e.g., 75 for 75%
  quizzesPassed: [number, number] // [passedCount, totalCount]
  attendanceRate: number // Percentage, e.g., 98 for 98%
}

// Detailed information about a course's staff
export type CourseDetailsInfo = {
  instructor: string
  ta: string // This can be deprecated or used for a secondary instructor
  contact: string // Main contact email
}

// A comprehensive view of a course for a student, including all materials
export type CourseDetail = {
  id: string
  title: string
  group: string // e.g., "Group A"
  endMonth: string // e.g., "June"
  progress: CourseProgress
  videos: VideoDetail[]
  assignments: AssignmentDetail[]
  quizzes: QuizDetail[]
  attendance: AttendanceDetail[]
  details: CourseDetailsInfo
}

// Core course entity
export type Course = {
  id: string
  title: string
  instructorId: string
}

// A specific offering of a course in a given month and year
export type CourseSession = {
  id:string
  courseId: string
  month: string // 'Jan', 'Feb', etc.
  year: number
  status: "active" | "inactive"
}

// A group of students within a specific course session, managed by an instructor
export type Group = {
  id: string
  sessionId: string
  groupName: string // "Group 1", "Group 2", etc.
  students: Student[]
  // The following are added for the old /groups page, can be merged later
  courseName?: any
  instructorName?: any
  studentCount?: any
  isActive?: any
}