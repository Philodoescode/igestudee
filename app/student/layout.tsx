// FILE: app/student/layout.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { studentNavigation } from "@/lib/navigation"
import { createClient } from "@/lib/supabase/client"
import { CompleteProfileModal } from "./components/complete-profile-modal"

// Define a state machine for tracking the profile check status
type ProfileStatus = 'idle' | 'checking' | 'incomplete' | 'complete';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('idle');
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // This effect runs once to check the student's profile completeness.
    // It is efficient because it does not re-run on every navigation.
    const checkProfile = async () => {
      setProfileStatus('checking');
      
      // The `get_my_student_profile` RPC function already provides the necessary fields.
      const { data, error } = await supabase.rpc('get_my_student_profile');

      if (error) {
        console.error("Error checking student profile completion:", error.message);
        // Fail safely: if we can't check the profile, don't block the user.
        setProfileStatus('complete'); 
        return;
      }

      if (data) {
        // The condition to show the modal: grade or school_id is null.
        const isProfileIncomplete = !data.grade || !data.school_id;
        setProfileStatus(isProfileIncomplete ? 'incomplete' : 'complete');
      } else {
        // Also fail safely if no data is returned.
        setProfileStatus('complete');
      }
    };

    // The check is only initiated if it hasn't run yet.
    if (profileStatus === 'idle') {
      checkProfile();
    }
    
  }, [profileStatus, supabase]); 

  // This is "derived state". It's re-evaluated on every render (e.g., when pathname changes)
  // without triggering an expensive data fetch, ensuring the modal correctly hides on the profile page.
  const isOnProfilePage = pathname === '/student/profile';
  const shouldShowModal = profileStatus === 'incomplete' && !isOnProfilePage;

  return (
    <PortalLayout navigation={studentNavigation} allowedRoles={["student"]}>
      {children}
      {/* The modal is always rendered but its visibility is controlled by the `isOpen` prop */}
      <CompleteProfileModal isOpen={shouldShowModal} />
    </PortalLayout>
  )
}