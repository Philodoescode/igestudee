"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole, LoginCredentials } from "@/lib/auth"

interface AuthContextType {
  user: Omit<User, "password"> | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Session check error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      console.log("🔑 Login attempt from client:", {
        email: credentials.email,
        userType: credentials.userType,
        timestamp: new Date().toISOString(),
      })

      // Check if this is a test user for client-side validation
      const testUsers = [
        { email: "parent.test@example.com", userType: "parent" },
        { email: "emma.johnson@example.com", userType: "student" },
        { email: "ta.test@example.com", userType: "ta" },
        { email: "instructor.test@example.com", userType: "instructor" },
      ]

      const matchingTestUser = testUsers.find((user) => user.email.toLowerCase() === credentials.email.toLowerCase())

      if (matchingTestUser && matchingTestUser.userType !== credentials.userType) {
        console.log(
          `⚠️ Warning: Test user ${credentials.email} is a ${matchingTestUser.userType}, but trying to log in as ${credentials.userType}`,
        )
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      console.log("📡 Login response:", {
        status: response.status,
        success: data.success,
        error: data.error || "None",
        redirectUrl: data.redirectUrl || "None",
      })

      if (data.success && data.user) {
        setUser(data.user)

        console.log("✅ Login successful, redirecting to:", data.redirectUrl)

        // Redirect to appropriate dashboard
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
        }

        return { success: true }
      } else {
        console.log("❌ Login failed:", data.error)

        // Enhanced error message for test users
        if (matchingTestUser && credentials.password !== "P@sswOrd123") {
          return {
            success: false,
            error: "Invalid password for test user. Please use 'P@sswOrd123'.",
          }
        }

        return {
          success: false,
          error: data.error || "Login failed. Please try again.",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook for protecting routes
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, allowedRoles, router])

  return { user, isLoading }
}
