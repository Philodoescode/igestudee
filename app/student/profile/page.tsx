"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { User, Shield, Edit, Save, X, Eye, EyeOff, Key, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

// Type for a single school from the database
type School = { id: number; name: string };

// Type for the full student profile data from the RPC
type StudentProfileData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  gender: 'Male' | 'Female' | null;
  date_of_birth: string | null;
  grade: number | null;
  school_id: number | null; // NEW: Added school_id
};

export default function StudentProfilePage() {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // NEW: State for the list of schools
  const [schools, setSchools] = useState<School[]>([]);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
    grade: "",
    school_id: "" as string | number, // Can be number or empty string
  });
  
  const [passwordData, setPasswordData] = useState({ new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchInitialData() {
      if (!authUser) return;
      setIsLoading(true);
      
      // Fetch both profile and school list concurrently
      const [profileResult, schoolsResult] = await Promise.all([
        supabase.rpc('get_my_student_profile'),
        supabase.rpc('get_all_schools')
      ]);

      // Handle profile data
      if (profileResult.error) {
        toast.error("Failed to load profile data.");
        console.error(profileResult.error);
      } else if (profileResult.data) {
        const fetchedData = profileResult.data as StudentProfileData;
        setProfileData(fetchedData);
        setFormData({
          first_name: fetchedData.first_name || '',
          last_name: fetchedData.last_name || '',
          phone_number: fetchedData.phone_number || "",
          gender: fetchedData.gender || "",
          date_of_birth: fetchedData.date_of_birth || "",
          grade: fetchedData.grade?.toString() || "",
          school_id: fetchedData.school_id || "",
        });
      }
      
      // Handle school list data
      if (schoolsResult.error) {
        toast.error("Failed to load school list.");
      } else {
        setSchools(schoolsResult.data || []);
      }
      
      setIsLoading(false);
    }
    fetchInitialData();
  }, [authUser, supabase]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    
    // MODIFIED: Grade validation
    const gradeAsInt = formData.grade ? parseInt(formData.grade, 10) : null;
    if (formData.grade && (isNaN(gradeAsInt) || gradeAsInt < 1 || gradeAsInt > 12)) {
      toast.error("Invalid grade. Must be between 1 and 12.");
      return;
    }

    const schoolIdAsInt = formData.school_id ? parseInt(String(formData.school_id), 10) : null;

    // MODIFIED: Call RPC with new school_id parameter
    const { error } = await supabase.rpc('update_my_profile', {
      p_first_name: formData.first_name,
      p_last_name: formData.last_name,
      p_phone_number: formData.phone_number,
      p_gender: formData.gender,
      p_date_of_birth: formData.date_of_birth,
      p_grade: gradeAsInt,
      p_school_id: schoolIdAsInt
    });
    
    if (error) {
      toast.error(`Update failed: ${error.message}`);
    } else {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload(); 
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone_number: profileData.phone_number || "",
        gender: profileData.gender || "",
        date_of_birth: profileData.date_of_birth || "",
        grade: profileData.grade?.toString() || "",
        school_id: profileData.school_id || "",
      });
    }
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) { toast.error("New passwords do not match."); return; }
    if (passwordData.new.length < 8) { toast.error("New password must be at least 8 characters long."); return; }
    
    const { error } = await supabase.auth.updateUser({ password: passwordData.new });
    if (error) { toast.error(`Failed to update password: ${error.message}`); } 
    else { toast.success("Password changed successfully!"); setPasswordData({ new: "", confirm: "" }); }
  };

  if (isLoading || !profileData) {
    return (<div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600"/></div>);
  }

  const fullName = `${profileData.first_name} ${profileData.last_name}`;
  const initials = ((profileData.first_name?.[0] || '') + (profileData.last_name?.[0] || '')).toUpperCase();
  const selectedSchoolName = schools.find(s => s.id === formData.school_id)?.name || "Select school...";

  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and security settings.</p>
      </motion.div>
      <Card>
        <CardHeader className="border-b"><div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left"><Avatar className="h-24 w-24"><AvatarFallback className="text-3xl bg-gossamer-100 text-gossamer-700">{initials}</AvatarFallback></Avatar><div><CardTitle className="text-2xl">{isEditing ? `${formData.first_name} ${formData.last_name}` : fullName}</CardTitle><CardDescription>{profileData.email}</CardDescription></div></div></CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="personal"><User className="mr-2 h-4 w-4"/> Personal</TabsTrigger><TabsTrigger value="security"><Shield className="mr-2 h-4 w-4"/> Security</TabsTrigger></TabsList>
            <TabsContent value="personal" className="mt-6">
              <form onSubmit={handleSave}>
                <div className="flex flex-row items-center justify-between mb-6"><div><h3 className="text-lg font-medium">Edit Information</h3><p className="text-sm text-muted-foreground">Update personal details.</p></div><div className="flex space-x-2">{isEditing ? (<><Button variant="outline" size="sm" type="button" onClick={handleCancel}><X className="h-4 w-4 mr-2"/> Cancel</Button><Button size="sm" type="submit"><Save className="h-4 w-4 mr-2"/> Save</Button></>) : (<Button variant="outline" size="sm" type="button" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2"/> Edit</Button>)}</div></div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-1.5"><Label htmlFor="first_name">First Name</Label><Input id="first_name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} disabled={!isEditing} /></div><div className="space-y-1.5"><Label htmlFor="last_name">Last Name</Label><Input id="last_name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} disabled={!isEditing} /></div></div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-1.5"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={profileData.email} disabled /></div><div className="space-y-1.5"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone_number || ''} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} disabled={!isEditing}/></div></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5"><Label htmlFor="date_of_birth">Date of Birth</Label><Input id="date_of_birth" type="date" value={formData.date_of_birth || ''} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} disabled={!isEditing}/></div>
                    <div className="space-y-1.5"><Label htmlFor="gender">Gender</Label><Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})} disabled={!isEditing}><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* NEW: School Combobox */}
                    <div className="space-y-1.5"><Label htmlFor="school">School</Label>
                      <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                        <PopoverTrigger asChild><Button variant="outline" role="combobox" aria-expanded={isComboboxOpen} className="w-full justify-between" disabled={!isEditing}>{selectedSchoolName}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/></Button></PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search schools..."/><CommandList><CommandEmpty>No school found.</CommandEmpty><CommandGroup>
                          {schools.map((school) => (<CommandItem key={school.id} value={school.name} onSelect={() => {setFormData({...formData, school_id: school.id}); setIsComboboxOpen(false);}}><Check className={cn("mr-2 h-4 w-4", formData.school_id === school.id ? "opacity-100" : "opacity-0")}/>{school.name}</CommandItem>))}
                        </CommandGroup></CommandList></Command></PopoverContent>
                      </Popover>
                    </div>
                     <div className="space-y-1.5"><Label htmlFor="grade">Grade (1-12)</Label><Input id="grade" type="number" min="1" max="12" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} disabled={!isEditing}/></div>
                  </div>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="security" className="mt-6">
              <div><h3 className="text-lg font-medium">Change Password</h3><p className="text-sm text-muted-foreground">Update your password.</p></div>
              <div className="space-y-4 mt-6"><div className="space-y-1.5 relative"><Label htmlFor="new-password">New Password</Label><Input id="new-password" type={showPassword ? "text" : "password"} value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}/><Button variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7" style={{top: 'calc(50% + 10px)'}} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</Button></div><div className="space-y-1.5"><Label htmlFor="confirm-password">Confirm New Password</Label><Input id="confirm-password" type={showPassword ? "text" : "password"} value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}/></div><Button className="w-full sm:w-auto" onClick={handlePasswordChange}><Key className="mr-2 h-4 w-4"/> Update Password</Button></div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}