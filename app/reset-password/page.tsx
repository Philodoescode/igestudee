"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Eye, EyeOff, Key, Loader2, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingElements } from "@/components/floating-elements"
import { createClient } from "@/lib/supabase/client"
import { Toaster, toast } from "sonner"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Supabase's onAuthStateChange handles the 'PASSWORD_RECOVERY' event
    // when the user lands on this page from the email link.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidToken(true)
      }
    })

    // Also check on initial mount in case the event was missed
    if (window.location.hash.includes("type=recovery")) {
      setIsValidToken(true)
    }

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      setIsSuccess(true)
    }
  }

  // View for successful password reset
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
        <FloatingElements />
        <motion.div
          className="max-w-md w-full relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div
                className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle>Password Reset Successfully</CardTitle>
              <CardDescription>You can now log in with your new password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  Proceed to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // View for invalid or expired token
  if (!isValidToken && !isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4">
            <FloatingElements />
            <motion.div className="max-w-md w-full relative z-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm text-center">
                    <CardHeader>
                        <motion.div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                            <ShieldAlert className="h-8 w-8 text-white" />
                        </motion.div>
                        <CardTitle>Invalid Link</CardTitle>
                        <CardDescription>This password reset link is invalid or has expired.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">Please request a new password reset link from the forgot password page.</p>
                        <Link href="/forgot-password"><Button>Request New Link</Button></Link>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
  }

  // Main view for the password reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
      <FloatingElements />
      <Toaster position="top-center" richColors />
      <motion.div className="max-w-md w-full relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-600" />
              Set a New Password
            </CardTitle>
            <CardDescription>Please enter and confirm your new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 relative">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="h-12 pr-12"
                  required
                  disabled={isLoading}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7" style={{ top: 'calc(50% + 10px)' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="h-12"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </motion.span>
                  ) : (
                    <motion.span key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Reset Password
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}