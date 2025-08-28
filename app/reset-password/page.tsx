// app/reset-password/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Eye, EyeOff, Key, Loader2, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingElements } from "@/components/floating-elements"
import { createClient } from "@/lib/supabase/client"
import { Toaster, toast } from "sonner"

type PageStatus = "validating" | "invalid" | "form" | "success"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<PageStatus>("validating")
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // --- NEW: Manual Token Handling ---
    // This function will run once when the component mounts.
    // It manually checks the URL for the recovery token fragments.
    const handleManualRecovery = async () => {
      // Supabase sends the token in the URL hash like: #access_token=...&refresh_token=...
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // remove '#' and parse
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      console.log("DEBUG: Checking URL hash for tokens.", { hash });

      if (accessToken && refreshToken) {
        console.log("DEBUG: Found access and refresh tokens in URL. Attempting to set session.");
        
        // Manually set the session using the tokens from the URL.
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("DEBUG: Error setting session manually:", error.message);
          setStatus("invalid");
        } else {
          console.log("DEBUG: Session set successfully. Displaying password form.");
          setStatus("form");
          // Clean the URL to remove the tokens from the address bar for security.
          router.replace('/reset-password', { scroll: false });
        }
      } else {
        // If no tokens are found after a brief moment, the link is invalid.
        console.log("DEBUG: No tokens found in URL hash. Marking as invalid.");
        setStatus("invalid");
      }
    };

    // We still use a small timeout to ensure the browser has time to process the URL hash.
    const validationTimeout = setTimeout(handleManualRecovery, 500); // 0.5-second delay

    return () => {
      clearTimeout(validationTimeout);
    };
  }, [supabase.auth, router]);


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

    setIsSubmitting(true)
    // Now that we've manually set the session, this should succeed.
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)

    if (error) {
      if (error.message.includes("Auth session missing") || error.message.includes("Token has expired")) {
        toast.error("Your session has expired. Please request a new reset link.")
        setStatus("invalid")
      } else {
        toast.error(`Error: ${error.message}`)
      }
    } else {
      setStatus("success")
      await supabase.auth.signOut();
    }
  }

  const renderContent = () => {
    switch (status) {
      case "validating":
        return (
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="ml-4 text-muted-foreground">Validating link...</p>
          </div>
        )

      case "invalid":
        return (
          <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4">
            <FloatingElements />
            <motion.div className="max-w-md w-full relative z-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm text-center">
                <CardHeader>
                  <motion.div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                    <ShieldAlert className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle>Invalid or Expired Link</CardTitle>
                  <CardDescription>This password reset link is no longer valid. Please request a new one.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/forgot-password">Request New Link</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )
        
      case "success":
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
            <FloatingElements />
            <motion.div className="max-w-md w-full relative z-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
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
                  <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                     <Link href="/login">Proceed to Login</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )

      case "form":
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
            <FloatingElements />
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
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your new password" className="h-12 pr-12" required disabled={isSubmitting}/>
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7" style={{ top: 'calc(50% + 10px)' }} onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your new password" className="h-12" required disabled={isSubmitting}/>
                    </div>
                    <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                          </motion.div>
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
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {renderContent()}
    </>
  )
}