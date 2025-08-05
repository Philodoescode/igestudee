"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingElements } from "@/components/floating-elements"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.")
      return
    }

    setIsSubmitting(true)

    try {
      // NOTE: The login function in use-auth now only needs email and password
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (!result.success) {
        setError(result.error || "Login failed. Please try again.")
      }
      // Success case is handled by the login function (redirect)
    } catch (error) {
      console.error("Login submission error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-gossamer-50)] via-[var(--color-gossamer-100)] to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-28 relative overflow-hidden">
      <FloatingElements />

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div className="flex justify-center mb-6" whileHover={{ scale: 1.05 }}>
            <div className="p-4 rounded-2xl flex items-center justify-center h-[80px] w-[80px]">
              <Image src="/igestudee-initial-logo.png" alt="Igestudee Logo" width={48} height={48} priority />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="Enter your email" className="h-12" required disabled={isSubmitting} />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                    <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} placeholder="Enter your password" className="h-12 pr-12" required disabled={isSubmitting} />
                    <motion.button type="button" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={isSubmitting}>
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div key="hide" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          </motion.div>
                        ) : (
                          <motion.div key="show" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                            <Eye className="h-4 w-4 text-gray-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between">
                  <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[var(--color-gossamer-600)] focus:ring-[var(--color-gossamer-500)] border-gray-300 rounded" disabled={isSubmitting}/>
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900 cursor-pointer">Remember me</Label>
                  </motion.div>
                  <Link href="/forgot-password" className="text-sm text-[var(--color-gossamer-600)] hover:text-[var(--color-gossamer-500)]">Forgot password?</Link>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-[var(--color-gossamer-600)] to-[var(--color-gossamer-700)] hover:from-[var(--color-gossamer-700)] hover:to-[var(--color-gossamer-800)] shadow-lg" disabled={isSubmitting || isLoading}>
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                          <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                          Signing in...
                        </motion.div>
                      ) : (
                        <motion.span key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sign In</motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <p className="text-sm text-gray-600">
            New to our platform?{" "}
            <Link href="/contact" className="text-[var(--color-gossamer-600)] hover:text-[var(--color-gossamer-500)] font-medium">Contact us for enrollment</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}