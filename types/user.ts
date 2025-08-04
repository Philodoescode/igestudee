// Basic user role definition
export type UserRole = "parent" | "student" | "instructor" | "admin"

// Comprehensive user model, often used for authentication and session management
export interface User {
  id: string
  email: string
  password: string // This should ideally be handled server-side only
  role: UserRole
  name: string
  isActive: boolean
  lastLogin?: Date
  profile?: {
    firstName: string
    lastName: string
    phone?: string
    address?: string
    emergencyContact?: string
    childId?: string // For parents
  }
}

// Credentials used for the login process
export interface LoginCredentials {
  email: string
  password: string
  userType: UserRole
}

// Simplified student model for course/group contexts
export type Student = {
  id: string
  name: string
  registeredCourses: ("ICT" | "Mathematics")[]
}

// Simplified instructor model
export type Instructor = {
  id: string
  name: string
}