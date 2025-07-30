"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Edit, Save, X, Eye, EyeOff, Key } from "lucide-react"
import { motion } from "framer-motion"
import { useRequireAuth } from "@/hooks/use-auth"
import { Toaster, toast } from "sonner"

// Mock data fetcher - in a real app, this would be an API call
const getProfileData = (userId: string, name: string, email: string) => {
  // In a real app, you'd fetch this from your DB based on userId
  const profiles: { [key: string]: any } = {
    "parent-001": { phone: "+1 (555) 123-4567", address: "123 Main Street" },
    "student-001": { phone: "+1 (555) 987-6543", address: "456 Oak Avenue" },
    "ta-001": { phone: "+1 (555) 876-5432", address: "789 Pine Lane" },
    "instructor-001": { phone: "+1 (555) 765-4321", address: "101 Maple Drive" },
  }
  return {
    name,
    email,
    ...profiles[userId],
  }
}

export default function GlobalProfilePage() {
  const { user, isLoading } = useRequireAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" })
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (user) {
      const profile = getProfileData(user.id, user.name, user.email)
      setFormData(profile)
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  const handleSave = () => {
    // API call to save formData would go here
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleCancel = () => {
    if (user) {
      const profile = getProfileData(user.id, user.name, user.email)
      setFormData(profile)
    }
    setIsEditing(false)
  }

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match.")
      return
    }
    if (passwordData.new.length < 8) {
      toast.error("New password must be at least 8 characters long.")
      return
    }
    // API call to change password would go here
    toast.success("Password changed successfully!")
    setPasswordData({ current: "", new: "", confirm: "" })
  }

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and security settings.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl bg-gossamer-100 text-gossamer-700">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{formData.name}</CardTitle>
                <CardDescription>{formData.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" /> Personal Information
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" /> Security
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="mt-6">
                <div className="flex flex-row items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Edit Information</h3>
                    <p className="text-sm text-muted-foreground">Update your personal details here.</p>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" /> Save
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditing} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} disabled={!isEditing} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-6">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password for enhanced security.</p>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="space-y-1.5 relative">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type={showCurrent ? "text" : "password"} value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}/>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" style={{top: 'calc(50% + 10px)'}} onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="space-y-1.5 relative">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type={showNew ? "text" : "password"} value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" style={{top: 'calc(50% + 10px)'}} onClick={() => setShowNew(!showNew)}>
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type={showNew ? "text" : "password"} value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
                  </div>
                  <Button className="w-full sm:w-auto" onClick={handlePasswordChange}>
                    <Key className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}