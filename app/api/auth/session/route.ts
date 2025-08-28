import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: "No active session" }, { status: 401 })
    }

    const { user } = session

    // Fetch the user's profile to get role and full name
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('first_name, last_name, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 })
    }

    // Construct the full user object for the client
    const clientUser = {
      id: user.id,
      email: user.email,
      name: `${profile.first_name} ${profile.last_name}`,
      role: profile.role,
    }

    return NextResponse.json({
      success: true,
      user: clientUser,
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(
      { success: false, error: "Session validation failed" },
      { status: 500 }
    )
  }
}