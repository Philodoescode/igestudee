// lib/database.ts
// NOTE: This file contains mock data for the application.
// In a real application, this data would be fetched from a database.
// Type definitions are now managed in the `/types` directory.

import { BookOpen, Calendar, CheckCircle, Plus, Users, BarChart3, User as UserIcon } from "lucide-react"

import type { Course, CourseDetail, CourseSession, TaGroup, VideoDetail, CourseProgress, CourseDetailsInfo } from "@/types/course"
import type { TAttendanceGroup, TAttendanceRecord, TAttendanceSession, AttendanceDetail } from "@/types/attendance"
import type { GradingEntry, StudentGrade, AssignmentDetail, QuizDetail } from "@/types/grading"
import type { Student, Instructor } from "@/types/user"


// --- HOMEPAGE DATA ---

export const homePageFeatures = [
    {
      icon: BookOpen,
      title: "Pre-recorded Lectures",
      description: "Access comprehensive video lectures and practical tutorials anytime",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Live Q&A Sessions",
      description: "Join interactive sessions with instructors and fellow students",
      color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress analytics",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Calendar,
      title: "Flexible Learning",
      description: "Study at your own pace with 24/7 access to course materials",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: CheckCircle,
      title: "Expert Support",
      description: "Get guidance from experienced instructors and teaching assistants",
      color: "from-green-500 to-[var(--color-gossamer-500)]",
    },
];

export const homePageStats = [
    { number: 500, suffix: "+", label: "Students Taught" },
    { number: 95, suffix: "%", label: "Success Rate" },
    { number: 10, suffix: "+", label: "Years Experience" },
    { number: 24, suffix: "/7", label: "Platform Access" },
];

export const homePageCourseOfferings = [
  {
    title: "ICT Course",
    description: "Master Information and Communication Technology fundamentals",
    features: [
      "Programming fundamentals and practical applications",
      "Database design and management",
      "Web development and digital literacy",
      "Hands-on practical tutorials",
    ],
    gradient: "from-blue-500 to-cyan-500",
    href: "/courses#ict",
  },
  {
    title: "Mathematics Course",
    description: "Build strong mathematical foundations for academic success",
    features: [
      "Algebra and advanced mathematical concepts",
      "Geometry and trigonometry",
      "Statistics and probability",
      "Problem-solving techniques",
    ],
    gradient: "from-purple-500 to-pink-500",
    href: "/courses#mathematics",
  },
];
// --- CRUD HELPER FUNCTIONS for Group Management ---
// Note: These mutate the in-memory array for simulation purposes.
// In a real app, these would be API calls.

// --- COURSE CRUD ---
export const addCourse = (newCourseData: Omit<Course, 'id'>): Course => {
    const newCourse: Course = { ...newCourseData, id: `course-${Date.now()}` };
    allCourses.unshift(newCourse);
    return newCourse;
};
export const updateCourse = (updatedCourse: Course): Course | undefined => {
    const index = allCourses.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
        allCourses[index] = updatedCourse;
        return allCourses[index];
    }
    return undefined;
};
export const deleteCourse = (courseId: string): boolean => {
    const initialLength = allCourses.length;
    // Cascade delete: find all sessions for this course
    const sessionsToDelete = allCourseSessions.filter(s => s.courseId === courseId).map(s => s.id);
    sessionsToDelete.forEach(sessionId => {
        // Cascade delete groups for each session
        taGroupsData = taGroupsData.filter(g => g.sessionId !== sessionId);
    });
    // Delete sessions
    allCourseSessions = allCourseSessions.filter(s => s.courseId !== courseId);
    // Delete course
    allCourses = allCourses.filter(c => c.id !== courseId);
    return allCourses.length < initialLength;
};

// --- SESSION CRUD ---
export const addSession = (newSessionData: Omit<CourseSession, 'id'>): CourseSession => {
    const newSession: CourseSession = { ...newSessionData, id: `session-${Date.now()}` };
    allCourseSessions.unshift(newSession);
    return newSession;
};
export const updateSession = (updatedSession: CourseSession): CourseSession | undefined => {
    const index = allCourseSessions.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
        allCourseSessions[index] = updatedSession;
        return allCourseSessions[index];
    }
    return undefined;
};
export const deleteSession = (sessionId: string): boolean => {
    const initialLength = allCourseSessions.length;
    // Cascade delete groups
    taGroupsData = taGroupsData.filter(g => g.sessionId !== sessionId);
    // Delete session
    allCourseSessions = allCourseSessions.filter(s => s.id !== sessionId);
    return allCourseSessions.length < initialLength;
};

// --- GROUP CRUD ---
export const addGroup = (newGroupData: Omit<TaGroup, 'id' | 'groupName'>): TaGroup => {
    // Auto-generate group name
    const groupsInSession = taGroupsData.filter(g => g.sessionId === newGroupData.sessionId);
    const newGroupName = `Group ${groupsInSession.length + 1}`;
    
    const newGroup: TaGroup = { ...newGroupData, id: `group-${Date.now()}`, groupName: newGroupName };
    taGroupsData.unshift(newGroup);
    return newGroup;
};
export const updateGroup = (updatedGroup: TaGroup): TaGroup | undefined => {
  const index = taGroupsData.findIndex(g => g.id === updatedGroup.id);
  if (index !== -1) {
    taGroupsData[index] = updatedGroup;
    return taGroupsData[index];
  }
  return undefined;
};
export const deleteGroup = (groupId: string): boolean => {
  const initialLength = taGroupsData.length;
  taGroupsData = taGroupsData.filter(g => g.id !== groupId);
  return taGroupsData.length < initialLength;
};