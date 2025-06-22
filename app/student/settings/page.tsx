"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Key, Save, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function StudentSettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    newAnnouncements: true,
    upcomingDeadlines: true,
    newGrades: true,
    forumReplies: false,
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleNotificationChange = (id: keyof typeof notificationSettings, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [id]: checked }))
  }

  const handlePasswordChange = () => {
    // Handle password change logic
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and notification preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "newAnnouncements",
                  label: "New Announcements",
                  description: "Get notified about new course or general announcements.",
                },
                {
                  id: "upcomingDeadlines",
                  label: "Upcoming Deadlines",
                  description: "Receive reminders for assignments and quizzes.",
                },
                {
                  id: "newGrades",
                  label: "New Grades",
                  description: "Get an alert when a new grade is posted.",
                },
                {
                  id: "forumReplies",
                  label: "Forum Replies",
                  description: "Notify me about replies to my forum posts.",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={notificationSettings[item.id as keyof typeof notificationSettings]}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(item.id as keyof typeof notificationSettings, checked)
                    }
                  />
                </div>
              ))}
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input id="current-password" type={showCurrent ? "text" : "password"} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input id="new-password" type={showNew ? "text" : "password"} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type={showNew ? "text" : "password"} />
              </div>

              <Button>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}