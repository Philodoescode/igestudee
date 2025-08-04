// types/grading.ts

// Represents a student's grade for a specific assignment or entry
export type StudentGrade = {
  studentId: string
  name: string
  grade: number | null // Grade is a number or null if not graded
}

// Represents a single grading event or assignment entry created by an instructor
export type GradingEntry = {
  id: string
  instructorName: string
  date: string // YYYY-MM-DD
  title: string
  maxScore: number // Max possible score for this entry
  studentGrades: StudentGrade[]
}

// Represents a specific assignment for a student in a course context
export type AssignmentDetail = {
  id: string
  title: string
  dueDate: string
  status: "Graded" | "Submitted" | "Missing" | "Late" | "Needs Grading"
  grade: string | null
  gradedBy: string
}

// Represents a specific quiz for a student in a course context
export type QuizDetail = {
  id: string
  title: string
  dueDate: string
  status: "Passed" | "Failed" | "Pending"
  score: number | null
  maxScore: number
  gradedBy: string
}