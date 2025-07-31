// app/ta/courses/page.tsx
"use client"

import { useState } from "react"
import { useRequireAuth } from "@/hooks/use-auth"
import { Toaster, toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import CourseListView from "./components/course-list-view"
import GroupDetailView from "./components/group-detail-view"
import CourseFormModal from "./components/course-form-modal"
import SessionFormModal from "./components/session-form-modal"
import GroupFormModal from "./components/group-form-modal"

import {
  allCourses as initialCourses,
  allCourseSessions as initialSessions,
  taGroupsData as initialGroups,
  allInstructors,
  allStudents,
  addCourse,
  updateCourse,
  deleteCourse as dbDeleteCourse,
  addSession,
  updateSession,
  deleteSession as dbDeleteSession,
  addGroup,
  updateGroup,
  deleteGroup as dbDeleteGroup,
  type Course,
  type CourseSession,
  type TaGroup,
} from "@/lib/database"
import Loading from "./loading"

export default function CoursesPage() {
  const { user, isLoading } = useRequireAuth(["ta"])
  
  // App State
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [sessions, setSessions] = useState<CourseSession[]>(initialSessions);
  const [groups, setGroups] = useState<TaGroup[]>(initialGroups);

  // View State
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedGroup, setSelectedGroup] = useState<TaGroup | null>(null);

  // Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CourseSession | null>(null);
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null);
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TaGroup | null>(null);
  const [targetSessionId, setTargetSessionId] = useState<string | null>(null);

  if (isLoading || !user) {
    return <Loading />
  }

  // --- Modal Open/Close Handlers ---
  const handleOpenCourseModal = (course: Course | null) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  }
  const handleOpenSessionModal = (session: CourseSession | null, courseId: string) => {
    setEditingSession(session);
    setTargetCourseId(courseId);
    setIsSessionModalOpen(true);
  }
  const handleOpenGroupModal = (group: TaGroup | null, sessionId: string) => {
    setEditingGroup(group);
    setTargetSessionId(sessionId);
    setIsGroupModalOpen(true);
  }

  // --- View Navigation Handlers ---
  const handleSelectGroup = (group: TaGroup) => {
    setSelectedGroup(group);
    setView("detail");
  }
  const handleBackToList = () => {
    setSelectedGroup(null);
    setView("list");
  }
  
  // --- CRUD Handlers ---
  const handleSaveCourse = (data: Omit<Course, 'id'> | Course) => {
    if ('id' in data) { // Editing
      const updated = updateCourse(data);
      if (updated) {
        setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast.success(`Course '${updated.title}' updated successfully.`);
      }
    } else { // Creating
      const added = addCourse(data);
      setCourses(prev => [added, ...prev]);
      toast.success(`Course '${added.title}' created successfully.`);
    }
    setIsCourseModalOpen(false);
  };
  const handleDeleteCourse = (courseId: string) => {
    const courseTitle = courses.find(c => c.id === courseId)?.title || 'Course';
    dbDeleteCourse(courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setSessions(prev => prev.filter(s => s.courseId !== courseId));
    toast.error(`Course '${courseTitle}' and all its sessions/groups have been deleted.`);
    setIsCourseModalOpen(false);
  }

  const handleSaveSession = (data: Omit<CourseSession, 'id'> | CourseSession) => {
    if ('id' in data) { // Editing
        const updated = updateSession(data);
        if (updated) {
            setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
            toast.success(`Session for ${updated.month} ${updated.year} updated.`);
        }
    } else { // Creating
        const added = addSession(data);
        setSessions(prev => [added, ...prev]);
        toast.success(`Session for ${added.month} ${added.year} created.`);
    }
    setIsSessionModalOpen(false);
  }
  const handleDeleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    dbDeleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setGroups(prev => prev.filter(g => g.sessionId !== sessionId));
    toast.error(`Session for ${session?.month} ${session?.year} and its groups deleted.`);
    setIsSessionModalOpen(false);
  }

  const handleSaveGroup = (data: Omit<TaGroup, 'id' | 'groupName'> | TaGroup) => {
    if ('id' in data) { // Editing
      const updated = updateGroup(data as TaGroup);
      if (updated) {
        setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
        toast.success(`Group '${updated.groupName}' updated successfully.`);
      }
    } else { // Creating
      const added = addGroup(data);
      setGroups(prev => [added, ...prev]);
      toast.success(`Group '${added.groupName}' created successfully.`);
    }
    setIsGroupModalOpen(false);
  };
  const handleDeleteGroup = (groupId: string) => {
    const groupName = groups.find(g => g.id === groupId)?.groupName || 'Group';
    dbDeleteGroup(groupId);
    setGroups(prev => prev.filter(g => g.id !== groupId));
    toast.error(`Group '${groupName}' has been deleted.`);
    setIsGroupModalOpen(false);
  }

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
                courses={courses}
                sessions={sessions}
                groups={groups}
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
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
        courseToEdit={editingCourse}
        allInstructors={allInstructors}
      />
      
      <SessionFormModal
        isOpen={isSessionModalOpen}
        setIsOpen={setIsSessionModalOpen}
        onSave={handleSaveSession}
        onDelete={handleDeleteSession}
        sessionToEdit={editingSession}
        courseId={targetCourseId}
        allSessions={sessions}
      />

      <GroupFormModal
        isOpen={isGroupModalOpen}
        setIsOpen={setIsGroupModalOpen}
        onSave={handleSaveGroup}
        onDelete={handleDeleteGroup}
        groupToEdit={editingGroup}
        sessionId={targetSessionId}
        allStudents={allStudents}
        allCourses={courses}
        allSessions={sessions}
        allGroups={groups}
      />
    </div>
  )
}