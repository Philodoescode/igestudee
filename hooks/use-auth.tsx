"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { UserRole, LoginCredentials } from "@/types/user"

// The user object we'll use in the context
type ClientUser = {
  id: string;
  email: string | undefined;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: ClientUser | null
  isLoading: boolean
  login: (credentials: Omit<LoginCredentials, 'userType'>) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // This function runs on initial load to check for an existing session.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', session.user.id)
          .single()
        
        if (profile && profile.role) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: `${profile.first_name} ${profile.last_name}`,
            role: profile.role as UserRole,
          })
        }
      }
      setIsLoading(false)
    }

    checkSession()

    // This listener handles state changes: login, logout, token refresh.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', session.user.id)
            .single()

          if (profile && profile.role) {
             setUser({
                id: session.user.id,
                email: session.user.email,
                name: `${profile.first_name} ${profile.last_name}`,
                role: profile.role as UserRole,
            })
          }
        } else {
          // If the session is null, it means the user logged out.
          setUser(null)
          // Redirect to login to ensure no protected routes are accessible.
          if (window.location.pathname !== '/login') {
            router.push('/login');
          }
        }
        setIsLoading(false);
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const login = async (credentials: Omit<LoginCredentials, 'userType'>): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!data.success || !data.user) {
          return { success: false, error: data.error || "Login failed." };
      }
      
      // FIX: Explicitly set the user state here with the data from the API.
      // This solves the race condition.
      setUser(data.user);
      
      // Now that the context is updated, we can safely redirect.
      if (data.redirectUrl) {
          router.push(data.redirectUrl);
      } else {
          router.push('/'); // Fallback redirect
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: "An unexpected network error occurred." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    // The onAuthStateChange listener will handle setting user to null and redirecting.
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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