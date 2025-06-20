import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No active session",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Session validation failed",
      },
      { status: 500 },
    )
  }
}
