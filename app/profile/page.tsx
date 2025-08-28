// FILE: app/profile/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Edit, Save, X, Eye, EyeOff, Key, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

// This type mirrors the JSON structure returned by your `get_my_profile` function
type ProfileData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  [key: string]: any; // Allows for other fields like 'gender' from student_details
};

export default function GlobalProfilePage() {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // A separate state for the form so edits can be cancelled
  const [formData, setFormData] = useState({ first_name: "", last_name: "", phone_number: "" });
  
  const [passwordData, setPasswordData] = useState({ new: "", confirm: "" });
  const [showNew, setShowNew] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      if (!authUser) return;
      setIsLoading(true);
      // Fetching data using the correct RPC function
      const { data, error } = await supabase.rpc('get_my_profile');
      if (error) {
        toast.error("Failed to load profile data.");
        console.error(error);
      } else if (data) {
        const fetchedData = data as unknown as ProfileData;
        setProfileData(fetchedData);
        // Initialize form with fetched data
        setFormData({
          first_name: fetchedData.first_name || '',
          last_name: fetchedData.last_name || '',
          phone_number: fetchedData.phone_number || "",
        });
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [authUser, supabase]);

  const handleSave = async () => {
    // Saving data using the correct RPC function
    const { error } = await supabase.rpc('update_my_profile', {
      p_first_name: formData.first_name,
      p_last_name: formData.last_name,
      p_phone_number: formData.phone_number,
    });
    
    if (error) {
      toast.error(`Update failed: ${error.message}`);
    } else {
      setProfileData(prev => prev ? { ...prev, ...formData } : null);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      // Optionally, refresh the whole page to update the auth context if the name changed
      window.location.reload(); 
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number || "",
      });
    }
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    // Using standard Supabase method to update authenticated user's password
    const { error } = await supabase.auth.updateUser({ password: passwordData.new });
    
    if (error) {
      toast.error(`Failed to update password: ${error.message}`);
    } else {
      toast.success("Password changed successfully!");
      setPasswordData({ new: "", confirm: "" });
    }
  };

  if (isLoading || !profileData) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
      </div>
    );
  }

  const fullName = `${profileData.first_name} ${profileData.last_name}`;
  const initials = ((profileData.first_name?.[0] || '') + (profileData.last_name?.[0] || '')).toUpperCase();

  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and security settings.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl bg-gossamer-100 text-gossamer-700">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{isEditing ? `${formData.first_name} ${formData.last_name}` : fullName}</CardTitle>
                <CardDescription>{profileData.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" /> Personal Information</TabsTrigger>
                <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4" /> Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-6">
                <div className="flex flex-row items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Edit Information</h3>
                    <p className="text-sm text-muted-foreground">Update your personal details here.</p>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCancel}><X className="h-4 w-4 mr-2" /> Cancel</Button>
                        <Button size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save</Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} disabled={!isEditing} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} disabled={!isEditing} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={profileData.email} disabled />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password for enhanced security.</p>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="space-y-1.5 relative">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type={showNew ? "text" : "password"} value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7" style={{top: 'calc(50% + 10px)'}} onClick={() => setShowNew(!showNew)}>
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type={showNew ? "text" : "password"} value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
                  </div>
                  <Button className="w-full sm:w-auto" onClick={handlePasswordChange}>
                    <Key className="mr-2 h-4 w-4" /> Update Password
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