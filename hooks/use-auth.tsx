// START OF hooks/use-auth.tsx
"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
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
    // --- THE DEFINITIVE FIX ---
    // If we are on the reset-password page, we do NOT want this global listener to run.
    // The reset-password page handles its own auth flow manually to protect the
    // one-time-use recovery token from being cleared by this listener.
    if (pathname === '/reset-password') {
      console.log("DEBUG: On /reset-password page. Skipping global AuthProvider listener.");
      setIsLoading(false); // Set loading to false so the rest of the app doesn't hang.
      return; // Exit the effect entirely.
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          supabase
              .rpc('get_my_profile') // CHANGE: Use the correct RPC function
              .then(({ data: profile, error: profileError }) => {
                if (profileError || !profile || !profile.role) {
                  // Logic remains the same, but the call is different
                  console.error("Critical: User has session but no profile. Signing out.", profileError);
                  supabase.auth.signOut();
                } else {
                  setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: `${profile.first_name} ${profile.last_name}`,
                    role: profile.role as UserRole,
                  });
                }
              });

        } else {
          setUser(null);
          const isPublic = PUBLIC_PATHS.some(path => pathname === path || (path !== '/' && pathname.startsWith(path)));
          if (!isPublic) {
            router.push('/login');
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

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
      return { success: false, error: "An unexpected network error occurred." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
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
  const pathname = usePathname(); // Get pathname to check if we're on the reset page

  useEffect(() => {
    // Also skip this hook's logic on the reset page
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
// END OF hooks/use-auth.tsx