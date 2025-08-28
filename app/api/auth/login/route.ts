import { type NextRequest, NextResponse } from "next/server"
import { createClient } from '@/lib/supabase/server'
import type { LoginCredentials } from "@/types/user"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // The client sends userType, but Supabase auth doesn't use it.
    // We only need email and password for authentication.
    const { email, password } = body as Omit<LoginCredentials, 'userType'>

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Invalid credentials' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('first_name, last_name, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { success: false, error: 'User profile not found. Please contact support.' },
        { status: 500 }
      )
    }
    
    const clientUser = {
      id: user.id,
      email: user.email,
      name: `${profile.first_name} ${profile.last_name}`,
      role: profile.role,
    }

    const getRedirectUrl = (role: string | null) => {
        switch (role) {
            case "student": return "/student";
            case "parent": return "/parent";
            case "instructor": return "/instructor";
            case "admin": return "/admin";
            default: return "/login";
        }
    }

    return NextResponse.json({
      success: true,
      user: clientUser,
      redirectUrl: getRedirectUrl(profile.role),
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}