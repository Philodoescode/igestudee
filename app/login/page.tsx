"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Users, UserCheck, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingElements } from "@/components/floating-elements"
import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/types/user"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "" as UserRole | "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password || !formData.userType) {
      setError("Please fill in all fields.")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        userType: formData.userType as UserRole,
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

  const userTypes = [
    {
      value: "student",
      label: "Student",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      description: "Access your personalized dashboard, course materials, and progress tracking",
    },
    {
      value: "parent",
      label: "Parent",
      icon: Users,
      color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]",
      description: "View your child's progress, upcoming sessions, and manage payments",
    },
    {
      value: "ta",
      label: "Teaching Assistant",
      icon: UserCheck,
      color: "from-purple-500 to-pink-500",
      description: "Access student groups, moderate discussions, and assist with courses",
    },
    {
      value: "instructor",
      label: "Instructor",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      description: "Comprehensive platform management and student oversight",
    },
  ]

  const selectedUserType = userTypes.find((type) => type.value === formData.userType)

  // Quick login buttons for testing
  const testAccounts = [
    { email: "parent.test@example.com", userType: "parent", label: "Test Parent" },
    { email: "emma.johnson@example.com", userType: "student", label: "Test Student" },
    { email: "ta.test@example.com", userType: "ta", label: "Test TA" },
    { email: "instructor.test@example.com", userType: "instructor", label: "Test Instructor" },
  ]

  const quickLogin = (email: string, userType: UserRole) => {
    setFormData({
      email,
      password: "P@sswOrd123",
      userType,
    })
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
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="p-4 rounded-2xl flex items-center justify-center h-[80px] w-[80px]">
              <Image
                src="/igestudee-initial-logo.png"
                alt="Igestudee Logo"
                width={48}
                height={48}
                priority
              />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to access your learning dashboard</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="userType">I am a...</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => handleInputChange("userType", value)}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className="h-12"
                      required
                      disabled={isSubmitting}
                    />
                  </motion.div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 pr-12"
                      required
                      disabled={isSubmitting}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isSubmitting}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div
                            key="hide"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="show"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Eye className="h-4 w-4 text-gray-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[var(--color-gossamer-600)] focus:ring-[var(--color-gossamer-500)] border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900 cursor-pointer">
                      Remember me
                    </Label>
                  </motion.div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--color-gossamer-600)] hover:text-[var(--color-gossamer-500)] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[var(--color-gossamer-600)] to-[var(--color-gossamer-700)] hover:from-[var(--color-gossamer-700)] hover:to-[var(--color-gossamer-800)] shadow-lg"
                    disabled={isSubmitting || isLoading}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          Signing in...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="signin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Sign In
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>

              {/* Quick Login for Testing */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="mt-6"
              >
                <div className="text-center mb-3">
                  <span className="text-xs text-gray-500">Quick Login (Testing)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {testAccounts.map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin(account.email, account.userType as UserRole)}
                      disabled={isSubmitting}
                      className="text-xs"
                    >
                      {account.label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Demo Alert */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <Alert className="mt-6 border-[var(--color-gossamer-200)] bg-[var(--color-gossamer-50)]">
                  <CheckCircle className="h-4 w-4 text-[var(--color-gossamer-600)]" />
                  <AlertDescription className="text-[var(--color-gossamer-800)]">
                    <strong>Test Credentials:</strong> Use the following test accounts with password "P@sswOrd123":
                    <ul className="mt-2 list-disc pl-5 text-xs">
                      <li>
                        <strong>Parent:</strong> parent.test@example.com
                      </li>
                      <li>
                        <strong>Student:</strong> emma.johnson@example.com
                      </li>
                      <li>
                        <strong>TA:</strong> ta.test@example.com
                      </li>
                      <li>
                        <strong>Instructor:</strong> instructor.test@example.com
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-gray-600">
            New to our platform?{" "}
            <Link
              href="/contact"
              className="text-[var(--color-gossamer-600)] hover:text-[var(--color-gossamer-500)] font-medium transition-colors"
            >
              Contact us for enrollment
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}