// app/parent/settings/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Shield, Eye, EyeOff, Key, Bell, Globe, CheckCircle, Percent } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)

  const [notificationPreferences, setNotificationPreferences] = useState({
    gradeThreshold: 80,
    gradeAlerts: true,
    attendanceAlerts: true,
    weeklySummary: false,
  })

  const [preferences, setPreferences] = useState({
    language: "en",
    autoLogout: true,
  })

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }

    setIsChangingPassword(true)

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordChangeSuccess(true)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Hide success message after 3 seconds
      setTimeout(() => setPasswordChangeSuccess(false), 3000)
    }, 1000)
  }

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: string, value: any) => {
    setNotificationPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-poppins font-bold mb-2 flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Account Settings
          </h1>
          <p className="text-gray-300 text-lg">Manage your account security and preferences</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Notification Preferences */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-emerald-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Customize how you receive alerts and updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gradeAlerts">Grade Alerts</Label>
                    <p className="text-sm text-gray-500">Notify me if a grade drops below a threshold.</p>
                  </div>
                  <Switch
                    id="gradeAlerts"
                    checked={notificationPreferences.gradeAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("gradeAlerts", checked)}
                  />
                </div>
                {notificationPreferences.gradeAlerts && (
                  <div className="space-y-2 pl-4 border-l-2 ml-2">
                    <Label htmlFor="gradeThreshold">Grade Threshold (%)</Label>
                    <div className="relative">
                      <Input
                        id="gradeThreshold"
                        type="number"
                        value={notificationPreferences.gradeThreshold}
                        onChange={(e) => handleNotificationChange("gradeThreshold", Number.parseInt(e.target.value))}
                        className="pl-8"
                      />
                      <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                    <p className="text-sm text-gray-500">Notify me for any unexcused absence or tardy.</p>
                  </div>
                  <Switch
                    id="attendanceAlerts"
                    checked={notificationPreferences.attendanceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("attendanceAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklySummary">Weekly Summary Email</Label>
                    <p className="text-sm text-gray-500">Receive a summary of your child's progress each week.</p>
                  </div>
                  <Switch
                    id="weeklySummary"
                    checked={notificationPreferences.weeklySummary}
                    onCheckedChange={(checked) => handleNotificationChange("weeklySummary", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* General Preferences */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-emerald-600" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange("language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Logout</h4>
                    <p className="text-sm text-gray-500">Automatically log out after 30 minutes of inactivity</p>
                  </div>
                  <Switch
                    checked={preferences.autoLogout}
                    onCheckedChange={(checked) => handlePreferenceChange("autoLogout", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Security Settings */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                  Security
                </CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence>
                  {passwordChangeSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">Password changed successfully!</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))} placeholder="Enter current password" className="pr-10"/>
                    <motion.button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowCurrentPassword(!showCurrentPassword)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      {showCurrentPassword ? (<EyeOff className="h-4 w-4 text-gray-400" />) : (<Eye className="h-4 w-4 text-gray-400" />)}
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))} placeholder="Enter new password" className="pr-10"/>
                    <motion.button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowNewPassword(!showNewPassword)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      {showNewPassword ? (<EyeOff className="h-4 w-4 text-gray-400" />) : (<Eye className="h-4 w-4 text-gray-400" />)}
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Confirm new password" className="pr-10"/>
                    <motion.button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      {showConfirmPassword ? (<EyeOff className="h-4 w-4 text-gray-400" />) : (<Eye className="h-4 w-4 text-gray-400" />)}
                    </motion.button>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handlePasswordChange} disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">
                    <AnimatePresence mode="wait">
                      {isChangingPassword ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                          <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}/>
                          Changing Password...
                        </motion.div>
                      ) : (
                        <motion.div key="change" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}