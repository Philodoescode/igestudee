// START OF courses/page.tsx
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
import SelectStudentsModal from "./components/select-students-modal"
import Loading from "./loading"

import type { Course, CourseSession, Group } from "@/types/course"
import type { Student } from "@/types/user"

// Type Definitions
type UserFromRPC = { id: string; name: string; role: 'student' | 'instructor' };
type CourseFromRPC = { id: number; title: string; instructorId: string; instructorName: string; sessions: { id: number; courseId: number; month: string; year: number; status: 'active' | 'inactive'; groups: { id: number; sessionId: number; groupName: string; students: { id: string, name: string }[] | null }[] | null }[] | null };
type FullGroupDetail = Group & { courseName: string; courseId: string };

export default function CoursesPage() {
  const { user, isLoading: authLoading } = useRequireAuth(["instructor"])
  const supabase = createClient()
  
  // State
  const [courses, setCourses] = useState<CourseFromRPC[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedGroup, setSelectedGroup] = useState<FullGroupDetail | null>(null)

  // Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<CourseSession | null>(null)
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null)
  
  const [isGroupStudentsModalOpen, setIsGroupStudentsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [targetSessionId, setTargetSessionId] = useState<string | null>(null)

  // Data Fetching
  const fetchData = async () => {
    setIsDataLoading(true)

    // FIX: Changed the direct table query to the 'get_all_students_and_instructors' RPC call.
    // This function is designed to securely bypass RLS for authorized roles.
    const [portalData, usersData] = await Promise.all([
        supabase.rpc('get_instructor_portal_data'),
        supabase.rpc('get_all_students_and_instructors')
    ]);
    
    if (portalData.error) { toast.error("Failed to load portal data."); console.error("Portal Data Error:", portalData.error) }
    else { setCourses(portalData.data || []) }
    
    if (usersData.error) {
        toast.error("Failed to load user list.");
        console.error("Users Error:", usersData.error)
    } else {
        // The data from the RPC call is already filtered for students and instructors.
        // We just need to pick out the students for the student list.
        const students = (usersData.data || [])
            .filter((u: UserFromRPC) => u.role === 'student')
            .map((u: UserFromRPC) => ({ id: u.id, name: u.name, registeredCourses: [] })); // `name` is already formatted by the RPC
        setAllStudents(students);
    }

    setIsDataLoading(false)
  }

  useEffect(() => { if (user) fetchData() }, [user])

  // CRUD Handlers (Correct)
  const handleSave = async (operation: string, data: any) => {
    let error;
    toast.info(`Saving ${operation}...`);

    const rpcCalls: { [key: string]: () => Promise<any> } = {
      course: () => supabase.rpc('create_new_course', { p_title: data.title }),
      session: () => supabase.rpc('create_new_session', { p_course_id: targetCourseId, p_month: data.month, p_year: data.year, p_status: data.status }),
      group: () => supabase.rpc('create_new_group', { p_session_id: targetSessionId, p_students: data.students.map((s: Student) => ({ student_id: s.id })) }),
      updateCourse: () => supabase.rpc('update_course_details', { p_course_id: editingCourse!.id, p_title: data.title }),
      updateSession: () => supabase.rpc('update_session_details', { p_session_id: editingSession!.id, p_status: data.status }),
      updateGroup: () => supabase.rpc('update_group_members', { p_group_id: editingGroup!.id, p_student_ids: data.students.map((s: Student) => s.id) }),
    };

    const call = editingCourse && operation === 'course' ? rpcCalls.updateCourse
               : editingSession && operation === 'session' ? rpcCalls.updateSession
               : editingGroup && operation === 'group' ? rpcCalls.updateGroup
               : rpcCalls[operation];

    if (!call) { toast.error("Unknown save operation."); return; }

    ({ error } = await call());

    if (error) {
      console.error(`Error saving ${operation}:`, error);
      toast.error(`Failed to save ${operation}: ${error.message}`);
    } else {
      toast.success(`${operation.charAt(0).toUpperCase() + operation.slice(1)} saved successfully. Refreshing data...`);
      await fetchData();
    }
    
    setIsCourseModalOpen(false);
    setIsSessionModalOpen(false);
    setIsGroupStudentsModalOpen(false);
  };
  
  const handleDelete = async (operation: string, id: string) => {
    let error;
    toast.warning(`Deleting ${operation}...`);
    const rpcCalls = {
        course: () => supabase.rpc('delete_course', { p_course_id: id }),
        session: () => supabase.rpc('delete_session', { p_session_id: id }),
        group: () => supabase.rpc('delete_group', { p_group_id: id }),
    };
    const call = rpcCalls[operation as keyof typeof rpcCalls];
    if (!call) { toast.error("Unknown delete operation."); return; }
    ({ error } = await call());
    if (error) {
        console.error(`Error deleting ${operation}:`, error);
        toast.error(`Failed to delete ${operation}: ${error.message}`);
    } else {
        toast.error(`${operation.charAt(0).toUpperCase() + operation.slice(1)} deleted. Refreshing data.`);
        await fetchData();
    }
    setIsCourseModalOpen(false);
    setIsSessionModalOpen(false);
    setIsGroupStudentsModalOpen(false);
  }

  if (authLoading || isDataLoading) { return <Loading /> }

  const handleSelectGroup = (group: Group) => {
    const parentCourse = courses.find(c => c.sessions?.some(s => s.groups?.some(g => g.id === Number(group.id))));
    const courseName = parentCourse?.title ?? "Unknown Course";
    const courseId = parentCourse?.id.toString() ?? "-1";
    setSelectedGroup({ ...group, courseName, courseId });
    setView("detail");
  }

  const handleBackToList = () => {
    setSelectedGroup(null);
    setView("list");
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
    setIsGroupStudentsModalOpen(true);
  }
  
  // Data Transformation (Correct)
  const mappedCourses: Course[] = courses.map(c => ({ id: String(c.id), title: c.title, instructorId: c.instructorId, instructorName: c.instructorName }));
  const allSessions: CourseSession[] = courses.flatMap(c => c.sessions || []).map(s => ({ id: String(s.id), courseId: String(s.courseId), month: s.month, year: s.year, status: s.status }));
  const allGroups: Group[] = courses.flatMap(c => c.sessions || []).flatMap(s => s.groups || []).map(g => ({ id: String(g.id), sessionId: String(g.sessionId), groupName: g.groupName, students: g.students || [] }));

  return (
    <div>
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div key="list-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <CourseListView courses={mappedCourses} sessions={allSessions} groups={allGroups} onSelectGroup={handleSelectGroup} onOpenCourseModal={handleOpenCourseModal} onOpenSessionModal={handleOpenSessionModal} onOpenGroupModal={handleOpenGroupModal} />
          </motion.div>
        )}
        {view === 'detail' && selectedGroup && (
          <motion.div key="detail-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
            <GroupDetailView group={selectedGroup} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>

      <CourseFormModal
        isOpen={isCourseModalOpen}
        setIsOpen={setIsCourseModalOpen}
        onSave={(data) => handleSave("course", data)}
        onDelete={() => handleDelete("course", editingCourse!.id)}
        courseToEdit={editingCourse}
        allInstructors={[]}
      />
      
      <SessionFormModal
        isOpen={isSessionModalOpen}
        setIsOpen={setIsSessionModalOpen}
        onSave={(data) => handleSave("session", data)}
        onDelete={() => handleDelete("session", editingSession!.id)}
        sessionToEdit={editingSession}
        allSessions={allSessions}
        courseId={targetCourseId}
      />

      <SelectStudentsModal
        isOpen={isGroupStudentsModalOpen}
        setIsOpen={setIsGroupStudentsModalOpen}
        onSelect={(selectedStudents) => handleSave("group", { students: selectedStudents })}
        allStudents={allStudents}
        initiallySelectedNames={editingGroup ? editingGroup.students.map(s => s.name) : []}
      />
    </div>
  )
}
//END OF courses/page.tsx