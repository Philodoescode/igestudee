import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error("Supabase logout error:", error)
        throw error
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during logout.",
      },
      { status: 500 },
    )
  }
}