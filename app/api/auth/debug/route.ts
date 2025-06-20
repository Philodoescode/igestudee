import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MOCK_USERS } from "@/lib/auth"

export async function GET(request: Request) {
  // Get the email from the query string
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")
  const password = searchParams.get("password") || "P@sswOrd123" // Default to test password

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        error: "Email parameter is required",
      },
      { status: 400 },
    )
  }

  try {
    // Find user by email
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    // Generate a new hash for the provided password
    const newHash = await bcrypt.hash(password, 12)

    // Test verification against stored hash
    const isValidAgainstStored = await bcrypt.compare(password, user.password)

    // Test verification against new hash
    const isValidAgainstNew = await bcrypt.compare(password, newHash)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        isActive: user.isActive,
      },
      passwordInfo: {
        storedHash: user.password,
        newGeneratedHash: newHash,
        providedPassword: password,
        isValidAgainstStored,
        isValidAgainstNew,
      },
      message: "Debug information retrieved successfully",
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while retrieving debug information",
      },
      { status: 500 },
    )
  }
}
