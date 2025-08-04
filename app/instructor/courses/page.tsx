"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Toaster, toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import CourseListView from "./components/course-list-view"
import GroupDetailView from "./components/group-detail-view"
import CourseFormModal from "./components/course-form-modal"
import SessionFormModal from "./components/session-form-modal"
import GroupFormModal from "./components/group-form-modal"
import Loading from "./loading"

import type { Course, CourseSession, Group } from "@/types/course"
import type { Student, Instructor } from "@/types/user"

// --- Type Definitions for Data from Supabase RPC ---
type StudentFromRPC = { id: string; name: string; registeredCourses?: string[] };
type GroupFromRPC = { id: number; sessionId: number; groupName: string; students: StudentFromRPC[] | null };
type SessionFromRPC = { id: number; courseId: number; month: string; year: number; status: 'active' | 'inactive'; groups: GroupFromRPC[] | null };
type CourseFromRPC = { id: number; title: string; instructorId: string; instructorName: string; sessions: SessionFromRPC[] | null };
type FullGroupDetail = Group & { courseName: string; courseId: string };

export default function CoursesPage() {
  const { user, isLoading: authLoading } = useRequireAuth(["instructor"])
  const supabase = createClient()
  
  // App State
  const [courses, setCourses] = useState<CourseFromRPC[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  // View State
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedGroup, setSelectedGroup] = useState<FullGroupDetail | null>(null)

  // Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<CourseSession | null>(null)
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null)
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [targetSessionId, setTargetSessionId] = useState<string | null>(null)

  // --- Data Fetching ---
  const fetchData = async () => {
    setIsDataLoading(true)
    
    const [portalData, studentsData, instructorsData] = await Promise.all([
        supabase.rpc('get_instructor_portal_data'),
        supabase.from('profiles').select('id, first_name, last_name').eq('role', 'student'),
        supabase.from('profiles').select('id, first_name, last_name').eq('role', 'instructor')
    ]);

    if (portalData.error) {
        toast.error("Failed to load portal data.")
        console.error("Portal Data Error:", portalData.error)
    } else {
        setCourses(portalData.data || [])
    }
    
    if (studentsData.error) {
        toast.error("Failed to load students list.")
        console.error("Students Error:", studentsData.error)
    } else {
        setAllStudents(studentsData.data.map(s => ({id: s.id, name: `${s.first_name} ${s.last_name}`, registeredCourses: [] })));
    }

    if (instructorsData.error) {
        toast.error("Failed to load instructors list.")
        console.error("Instructors Error:", instructorsData.error)
    } else {
        setAllInstructors(instructorsData.data.map(i => ({id: i.id, name: `${i.first_name} ${i.last_name}`})));
    }

    setIsDataLoading(false)
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  // --- START OF FIX: Implement actual save logic ---
  const handleSave = async (operation: string, data: any) => {
    let error;
    toast.info(`Saving ${operation}...`);

    switch (operation) {
        case 'course':
            // FIX: Call the updated function with only the title
            ({ error } = await supabase.rpc('create_new_course', {
                p_title: data.title,
            }));
            break;
        case 'session':
             ({ error } = await supabase.rpc('create_new_session', {
                p_course_id: data.courseId,
                p_month: data.month,
                p_year: data.year,
                p_status: data.status,
            }));
            break;
        case 'group':
            ({ error } = await supabase.rpc('create_new_group', {
                p_session_id: data.sessionId,
                p_students: data.students,
            }));
            break;
        default:
            toast.error("Unknown save operation.");
            return;
    }

    if (error) {
        console.error(`Error saving ${operation}:`, error);
        toast.error(`Failed to save ${operation}: ${error.message}`);
    } else {
        toast.success(`${operation.charAt(0).toUpperCase() + operation.slice(1)} saved successfully. Refreshing data...`);
        await fetchData(); // Refresh data on success
    }

    // Close all modals
    setIsCourseModalOpen(false);
    setIsSessionModalOpen(false);
    setIsGroupModalOpen(false);
  };
  
  // NOTE: A full implementation would also have specific `handleDelete` logic
  // For now, we'll just use the placeholder.
  const handleDelete = async (operation: string) => {
    toast.warning(`Deleting ${operation}... (Not yet implemented)`);
    // Placeholder for actual delete logic
    await fetchData();
    setIsCourseModalOpen(false);
    setIsSessionModalOpen(false);
    setIsGroupModalOpen(false);
    toast.error(`${operation.charAt(0).toUpperCase() + operation.slice(1)} deleted. Data refreshed.`);
  }
  // --- END OF FIX ---


  if (authLoading || isDataLoading) {
    return <Loading />
  }

  // --- View & Modal Handlers ---
  const handleSelectGroup = (group: Group) => {
    const parentCourse = courses.find(c => 
        c.sessions?.some(s => s.groups?.some(g => g.id === Number(group.id)))
    );

    const courseName = parentCourse?.title ?? "Unknown Course";
    const courseId = parentCourse?.id.toString() ?? "-1";
    
    setSelectedGroup({ ...group, courseName, courseId })
    setView("detail")
  }

  const handleBackToList = () => {
    setSelectedGroup(null)
    setView("list")
  }

  const handleOpenCourseModal = (course: Course | null) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  }
  const handleOpenSessionModal = (session: CourseSession | null, courseId: string) => {
    setEditingSession(session);
    setTargetCourseId(courseId);
    setIsSessionModalOpen(true);
  }
  const handleOpenGroupModal = (group: Group | null, sessionId: string) => {
    setEditingGroup(group);
    setTargetSessionId(sessionId);
    setIsGroupModalOpen(true);
  }
  
  // --- Data Transformation for Child Components ---
  const mappedCourses: Course[] = courses.map(c => ({ id: String(c.id), title: c.title, instructorId: c.instructorId }));
  const allSessions: CourseSession[] = courses.flatMap(c => c.sessions || []).map(s => ({
      id: String(s.id),
      courseId: String(s.courseId),
      month: s.month,
      year: s.year,
      status: s.status,
  }));
  const allGroups: Group[] = courses.flatMap(c => c.sessions || []).flatMap(s => s.groups || []).map(g => ({
      id: String(g.id),
      sessionId: String(g.sessionId),
      groupName: g.groupName,
      students: g.students || [], // Ensure students is an array
  }));

  return (
    <div>
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CourseListView 
                courses={mappedCourses}
                sessions={allSessions}
                groups={allGroups}
                onSelectGroup={handleSelectGroup}
                onOpenCourseModal={handleOpenCourseModal}
                onOpenSessionModal={handleOpenSessionModal}
                onOpenGroupModal={handleOpenGroupModal}
            />
          </motion.div>
        )}
        
        {view === 'detail' && selectedGroup && (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GroupDetailView group={selectedGroup} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>

      <CourseFormModal
        isOpen={isCourseModalOpen}
        setIsOpen={setIsCourseModalOpen}
        onSave={(data) => handleSave("course", data)}
        onDelete={() => handleDelete("course")}
        courseToEdit={editingCourse}
        allInstructors={allInstructors}
      />
      
      <SessionFormModal
        isOpen={isSessionModalOpen}
        setIsOpen={setIsSessionModalOpen}
        onSave={(data) => handleSave("session", data)}
        onDelete={() => handleDelete("session")}
        sessionToEdit={editingSession}
        courseId={targetCourseId}
        allSessions={allSessions}
      />

      <GroupFormModal
        isOpen={isGroupModalOpen}
        setIsOpen={setIsGroupModalOpen}
        onSave={(data) => handleSave("group", data)}
        onDelete={() => handleDelete("group")}
        groupToEdit={editingGroup}
        sessionId={targetSessionId}
        allStudents={allStudents}
        allCourses={mappedCourses}
        allSessions={allSessions}
        allGroups={allGroups}
      />
    </div>
  )
}