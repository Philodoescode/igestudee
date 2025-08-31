"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { UserRole, LoginCredentials } from "@/types/user"

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

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
  '/under-construction',
  '/about',
  '/courses',
  '/contact',
];

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Skip global listener on reset-password page, handled manually there.
    if (pathname === '/reset-password') {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && user?.id !== session.user.id) {
        const { data: profile, error } = await supabase.rpc('get_my_profile');
        
        if (error || !profile) {
          console.error("Auth Error: Profile fetch failed. Signing out.", error);
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: `${profile.first_name} ${profile.last_name}`,
            role: profile.role as UserRole,
          });
        }
      } else if (!session) {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, supabase, pathname]); // Added user?.id and pathname to dependencies for robustness

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
      
      setUser(data.user);
      
      if (data.redirectUrl) {
          router.push(data.redirectUrl);
      } else {
          router.push('/');
      }

      return { success: true };
    } catch (e) {
      console.error("Login network error:", e);
      return { success: false, error: "An unexpected network error occurred." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setIsLoading(false) // Set loading to false after logout
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
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/reset-password') {
        return;
    }

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
  }, [user, isLoading, allowedRoles, router, pathname])

  return { user, isLoading }
}