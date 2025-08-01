import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession } from "@/lib/auth"
import type { LoginCredentials } from "@/types/user"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userType } = body as LoginCredentials

    // Debug logging
    console.log("📝 Login attempt:", {
      email,
      userType,
      passwordLength: password?.length || 0,
    })

    // Validate input
    if (!email || !password || !userType) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, password, and user type are required.",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 },
      )
    }

    // For debugging purposes, log if this is a test user
    const testUsers = [
      "parent.test@example.com",
      "emma.johnson@example.com",
      "ta.test@example.com",
      "instructor.test@example.com",
    ]

    if (testUsers.includes(email.toLowerCase())) {
      console.log(`🧪 Test user login attempt detected: ${email} (${userType})`)

      // If this is a test user, we can debug the password hash
      if (password === "P@sswOrd123") {
        console.log("✅ Test user credentials match expected values")
      } else {
        console.log("❌ Test user credentials do not match expected values")
        console.log(
          `   Expected: "P@sswOrd123", Received: "${password.substring(0, 3)}${"*".repeat(password.length - 3)}"`,
        )
      }
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long.",
        },
        { status: 400 },
      )
    }

    // Authenticate user
    const authResult = await authenticateUser({ email, password, userType })

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error,
        },
        { status: 401 },
      )
    }

    // Create session
    if (authResult.user) {
      await createSession(authResult.user)
    }

    return NextResponse.json({
      success: true,
      user: authResult.user,
      redirectUrl: authResult.redirectUrl,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}
