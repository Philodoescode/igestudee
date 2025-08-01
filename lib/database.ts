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


// --- INSTRUCTOR PORTAL DATA ---

export const instructorDashboardStats = {
  totalStudents: 156,
  totalCourses: 8,
  engagementRate: 87,
  newStudentsThisMonth: 23,
};

export const instructorRecentActivity = [
  { id: 1, type: "enrollment", user: "Emma Johnson", action: "enrolled in ICT Fundamentals", time: "2 hours ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, type: "completion", user: "Michael Chen", action: "completed Module 3 - Web Development", time: "4 hours ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 5, type: "assignment", user: "Alex Smith (TA)", action: "graded 15 assignments", time: "1 day ago", avatar: "/placeholder.svg?height=32&width=32" },
];

export const instructorUpcomingSessions = [
  { id: 1, title: "ICT Q&A Session", time: "Today, 3:00 PM", participants: 12, type: "Q&A" },
  { id: 2, title: "Mathematics Workshop", time: "Tomorrow, 10:00 AM", participants: 8, type: "Workshop" },
  { id: 3, title: "Web Development Lab", time: "Friday, 2:00 PM", participants: 15, type: "Lab" },
];

export const instructorQuickActions = [
  { title: "Add Student", description: "Enroll new students in courses", icon: UserIcon, href: "/instructor/users/create", color: "from-green-600 to-emerald-600" },
  { title: "Create Course", description: "Set up new course content", icon: Plus, href: "/instructor/courses/create", color: "from-purple-600 to-pink-600" },
];

export const instructorEngagementStats = {
  totalStudents: 156, activeStudents: 142, avgSessionTime: "45m", completionRate: 78, videoViews: 1847,
};

export const instructorCourseEngagement = [
  { id: "course-001", title: "ICT Fundamentals", students: 45, completionRate: 78, avgTimeSpent: "3.2h", lastAccessed: "2024-03-12", trend: "up" },
  { id: "course-002", title: "Advanced Mathematics", students: 32, completionRate: 65, avgTimeSpent: "4.1h", lastAccessed: "2024-03-12", trend: "down" },
  { id: "course-003", title: "Web Development Basics", students: 28, completionRate: 82, avgTimeSpent: "2.8h", lastAccessed: "2024-03-11", trend: "up" },
  { id: "course-004", title: "Statistics and Probability", students: 25, completionRate: 71, avgTimeSpent: "3.5h", lastAccessed: "2024-03-10", trend: "stable" },
];

export const instructorStudentActivity = [
  { id: "student-001", name: "Emma Johnson", course: "ICT Fundamentals", lastActive: "2 hours ago", completionRate: 85, timeSpent: "12.5h", status: "active" },
  { id: "student-002", name: "Michael Chen", course: "Advanced Mathematics", lastActive: "1 day ago", completionRate: 92, timeSpent: "18.2h", status: "active" },
  { id: "student-003", name: "Sarah Williams", course: "Web Development", lastActive: "3 hours ago", completionRate: 67, timeSpent: "8.7h", status: "active" },
  { id: "student-004", name: "David Brown", course: "Statistics", lastActive: "1 week ago", completionRate: 34, timeSpent: "4.2h", status: "inactive" },
];

export const instructorUsers = [
  { id: "user-001", name: "Emma Johnson", email: "emma.johnson@example.com", role: "student", status: "active", enrolledCourses: 3, joinDate: "2024-01-15", lastLogin: "2024-03-12", phone: "+1 (555) 123-4567", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-002", name: "Sarah Johnson", email: "parent.test@example.com", role: "parent", status: "active", enrolledCourses: 0, joinDate: "2024-01-15", lastLogin: "2024-03-11", phone: "+1 (555) 123-4567", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-003", name: "Michael Chen", email: "michael.chen@example.com", role: "student", status: "active", enrolledCourses: 2, joinDate: "2024-02-01", lastLogin: "2024-03-12", phone: "+1 (555) 234-5678", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-004", name: "Alex Smith", email: "ta.test@example.com", role: "ta", status: "active", enrolledCourses: 0, joinDate: "2024-01-10", lastLogin: "2024-03-12", phone: "+1 (555) 345-6789", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-005", name: "David Brown", email: "david.brown@example.com", role: "student", status: "inactive", enrolledCourses: 1, joinDate: "2023-12-15", lastLogin: "2024-02-28", phone: "+1 (555) 456-7890", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-006", name: "Lisa Wilson", email: "lisa.wilson@example.com", role: "parent", status: "active", enrolledCourses: 0, joinDate: "2024-02-10", lastLogin: "2024-03-10", phone: "+1 (555) 567-8901", avatar: "/placeholder.svg?height=40&width=40" },
];


// --- PARENT PORTAL DATA ---

export const parentAttendanceData = {
    "Emma Johnson": { summary: { present: 125, excused: 3, unexcused: 1, tardy: 2, totalDays: 131, }, events: [ { date: "2024-03-12", status: "unexcused", period: "Period 2", course: "Mathematics" }, { date: "2024-03-05", status: "tardy", period: "Period 1", course: "ICT Course" }, { date: "2024-02-28", status: "excused", period: "Full Day", course: "N/A" }, ], },
};

export const parentDashboardChildren = ["Emma Johnson", "Liam Johnson"];

export const parentDashboardData = {
    "Emma Johnson": { keyMetrics: { overallGrade: 88, attendanceRate: 98, upcomingDeadlines: 3, }, courses: [ { name: "ICT Course", grade: 92, trend: "up" }, { name: "Mathematics Course", grade: 85, trend: "stable" }, ], upcoming: [ { type: "Assignment", title: "Web Portfolio Project", due: "3 days" }, { type: "Exam", title: "Calculus Mid-term", due: "5 days" }, ], attendanceAlerts: [{ type: "Unexcused Absence", date: "Yesterday" }], },
    "Liam Johnson": { keyMetrics: { overallGrade: 91, attendanceRate: 100, upcomingDeadlines: 2, }, courses: [ { name: "Intro to Programming", grade: 94, trend: "up" }, { name: "Algebra II", grade: 88, trend: "up" }, ], upcoming: [ { type: "Project", title: "Python Game Final Project", due: "1 week" }, { type: "Test", title: "Algebra Chapter 5 Test", due: "2 weeks" }, ], attendanceAlerts: [], },
};

export const parentDefaultProfileData = { firstName: "Sarah", lastName: "Johnson", email: "parent.test@example.com", phone: "+1 (555) 123-4567", address: "123 Main Street", city: "Springfield", state: "IL", zipCode: "62701", emergencyContact: "John Johnson", emergencyPhone: "+1 (555) 987-6543", relationship: "Spouse", bio: "Dedicated parent committed to supporting my child's educational journey...", };

export const parentChildInfo = { name: "Emma Johnson", studentId: "STU-2024-001", grade: "10th Grade", enrollmentDate: "2024-01-08", courses: ["ICT Course", "Mathematics Course"], emergencyContact: "Sarah Johnson", medicalInfo: "No known allergies", };

export const parentProgressData = {
    courses: [ { id: "ict", name: "ICT Course", overallGrade: 92, gradeTrend: "up", gradeBreakdown: [ { category: "Homework", weight: 20, score: 95 }, { category: "Quizzes", weight: 30, score: 88 }, { category: "Mid-term Exam", weight: 20, score: 90 }, { category: "Final Project", weight: 30, score: 94 }, ], assignments: [ { id: 1, title: "HTML Basics", status: "graded", grade: "95/100" }, { id: 2, title: "CSS Styling", status: "graded", grade: "92/100" }, ], assessments: [ { id: 1, title: "Networking Quiz", score: 85, total: 100, classAvg: 78 }, ], },
      { id: "math", name: "Mathematics Course", overallGrade: 85, gradeTrend: "stable", gradeBreakdown: [ { category: "Homework", weight: 30, score: 88 }, { category: "Quizzes", weight: 40, score: 82 }, { category: "Final Exam", weight: 30, score: 87 }, ], assignments: [ { id: 1, title: "Algebra Problem Set", status: "graded", grade: "88/100" }, ], assessments: [ { id: 1, title: "Trigonometry Quiz", score: 80, total: 100, classAvg: 75 }, ], }, ],
};


// --- STUDENT PORTAL DATA ---

export const studentDetailedCourses = [
  {
    id: "ict-101",
    name: "ICT Fundamentals",
    instructor: "Dr. Sarah Johnson",
    group: "Group 1",
  },
  {
    id: "math-201",
    name: "Advanced Mathematics",
    instructor: "Prof. Michael Chen",
    group: "Group 2",
  },
  {
    id: "web-dev-101",
    name: "Web Development Basics",
    instructor: "Dr. Sarah Johnson",
    group: "Group 3",
  },
  {
    id: "stats-101",
    name: "Statistics and Probability",
    instructor: "Prof. Michael Chen",
    group: "Group 4",
  },
  {
    id: "python-101",
    name: "Introduction to Python",
    instructor: "Dr. Sarah Johnson",
    group: "Group 5",
  },
];

export const courseDetailsData: { [key: string]: CourseDetail } = {
  "ict-101": {
    id: "ict-101",
    title: "ICT Fundamentals",
    group: "Group A",
    endMonth: "June",
    progress: {
      assignmentsCompleted: 75,
      quizzesPassed: [8, 10], // 8 passed out of 10 total
      attendanceRate: 98,
    },
    videos: [
      { id: "vid-ict-1", title: "Introduction to ICT", description: "Overview of Information and Communication Technology. Dive into the core concepts and historical context.", locked: false },
      { id: "vid-ict-2", title: "Basic Networking Concepts", description: "Understanding IP addresses, routers, switches, and network topologies.", locked: false },
      { id: "vid-ict-3", title: "Cybersecurity Fundamentals", description: "Introduction to common cyber threats, attack vectors, and basic protective measures.", locked: true },
      { id: "vid-ict-4", title: "Database Design Principles", description: "Learn about relational databases, normalization, and an introduction to SQL queries.", locked: true },
      { id: "vid-ict-5", title: "Web Development: HTML & CSS", description: "Building static web pages with semantic HTML and styling with CSS.", locked: true },
    ],
    assignments: [
      { id: "assign-ict-1", title: "HTML Basics Project", dueDate: "2024-05-20", status: "Graded", grade: "92/100", gradedBy: "Alex Smith" },
      { id: "assign-ict-2", title: "Networking Fundamentals Essay", dueDate: "2024-05-25", status: "Submitted", grade: null, gradedBy: "Alex Smith" },
      { id: "assign-ict-3", title: "Cybersecurity Case Study", dueDate: "2024-06-01", status: "Missing", grade: null, gradedBy: "Alex Smith" },
      { id: "assign-ict-4", title: "Database Schema Design", dueDate: "2024-06-08", status: "Late", grade: null, gradedBy: "Alex Smith" },
      { id: "assign-ict-5", title: "Final Web Portfolio", dueDate: "2024-06-15", status: "Needs Grading", grade: null, gradedBy: "Dr. Sarah Johnson" },
    ],
    quizzes: [
      { id: "quiz-ict-1", title: "Module 1 Quiz: Intro", dueDate: "2024-05-10", status: "Passed", score: 85, maxScore: 100, gradedBy: "System" },
      { id: "quiz-ict-2", title: "Module 2 Quiz: Networking", dueDate: "2024-05-17", status: "Passed", score: 90, maxScore: 100, gradedBy: "System" },
      { id: "quiz-ict-3", title: "Module 3 Quiz: Security", dueDate: "2024-05-24", status: "Failed", score: 60, maxScore: 100, gradedBy: "System" },
      { id: "quiz-ict-4", title: "Module 4 Quiz: Databases", dueDate: "2024-05-31", status: "Pending", score: null, maxScore: 100, gradedBy: "System" },
    ],
    attendance: [
      { id: "att-ict-1", date: "2024-05-22", status: "Present" },
      { id: "att-ict-2", date: "2024-05-15", status: "Present" },
      { id: "att-ict-3", date: "2024-05-08", status: "Absent" },
      { id: "att-ict-4", date: "2024-05-01", status: "Tardy" },
    ],
    details: {
      instructor: "Dr. Sarah Johnson",
      ta: "Alex Smith",
      contact: "alex.smith.ta@example.com",
    },
  },
  "math-201": {
    id: "math-201",
    title: "Advanced Mathematics",
    group: "Group B",
    endMonth: "July",
    progress: {
      assignmentsCompleted: 60,
      quizzesPassed: [6, 9],
      attendanceRate: 90,
    },
    videos: [
      { id: "vid-math-1", title: "Complex Numbers Deep Dive", description: "Exploration of complex numbers and their applications in engineering and physics.", locked: false },
      { id: "vid-math-2", title: "Vectors and Matrices", description: "Understanding linear algebra fundamentals, vector spaces, and matrix operations.", locked: false },
      { id: "vid-math-3", title: "Introduction to Calculus", description: "Limits, derivatives, and their rules with real-world examples.", locked: true },
      { id: "vid-math-4", title: "Integral Calculus Techniques", description: "Methods of integration, definite and indefinite integrals.", locked: true },
    ],
    assignments: [
      { id: "assign-math-1", title: "Trigonometry Problem Set", dueDate: "2024-05-18", status: "Graded", grade: "85/100", gradedBy: "Alex Smith" },
      { id: "assign-math-2", title: "Calculus Homework 1", dueDate: "2024-05-28", status: "Submitted", grade: null, gradedBy: "Alex Smith" },
      { id: "assign-math-3", title: "Linear Algebra Project", dueDate: "2024-06-10", status: "Needs Grading", grade: null, gradedBy: "Prof. Michael Chen" },
    ],
    quizzes: [
      { id: "quiz-math-1", title: "Algebra Review Quiz", dueDate: "2024-05-12", status: "Passed", score: 78, maxScore: 100, gradedBy: "System" },
      { id: "quiz-math-2", title: "Geometry Quiz", dueDate: "2024-05-19", status: "Failed", score: 65, maxScore: 100, gradedBy: "System" },
      { id: "quiz-math-3", title: "Pre-Calc Assessment", dueDate: "2024-05-26", status: "Passed", score: 82, maxScore: 100, gradedBy: "System" },
    ],
    attendance: [
      { id: "att-math-1", date: "2024-05-23", status: "Present" },
      { id: "att-math-2", date: "2024-05-16", status: "Tardy" },
      { id: "att-math-3", date: "2024-05-09", status: "Present" },
      { id: "att-math-4", date: "2024-05-02", status: "Absent" },
    ],
    details: {
      instructor: "Prof. Michael Chen",
      ta: "Alex Smith",
      contact: "alex.smith.ta@example.com",
    },
  },
  "web-dev-101": {
    id: "web-dev-101",
    title: "Web Development Basics",
    group: "Group C",
    endMonth: "July",
    progress: {
      assignmentsCompleted: 90,
      quizzesPassed: [7, 7],
      attendanceRate: 100,
    },
    videos: [
      { id: "vid-web-1", title: "Intro to HTML5", description: "Fundamental concepts of HTML for web page structure.", locked: false },
      { id: "vid-web-2", title: "Styling with CSS3", description: "Advanced CSS techniques for responsive and beautiful designs.", locked: false },
      { id: "vid-web-3", title: "JavaScript Fundamentals", description: "Adding interactivity to web pages with JavaScript.", locked: false },
    ],
    assignments: [
      { id: "assign-web-1", title: "Personal Portfolio Page", dueDate: "2024-05-10", status: "Graded", grade: "98/100", gradedBy: "Alex Smith" },
      { id: "assign-web-2", title: "Interactive Calculator", dueDate: "2024-05-25", status: "Graded", grade: "95/100", gradedBy: "Alex Smith" },
    ],
    quizzes: [
      { id: "quiz-web-1", title: "HTML Structures Quiz", dueDate: "2024-05-05", status: "Passed", score: 92, maxScore: 100, gradedBy: "System" },
      { id: "quiz-web-2", title: "CSS Selectors Quiz", dueDate: "2024-05-12", status: "Passed", score: 88, maxScore: 100, gradedBy: "System" },
    ],
    attendance: [
      { id: "att-web-1", date: "2024-05-21", status: "Present" },
      { id: "att-web-2", date: "2024-05-14", status: "Present" },
    ],
    details: {
      instructor: "Dr. Sarah Johnson",
      ta: "Alex Smith",
      contact: "alex.smith.ta@example.com",
    },
  },
  "stats-101": {
    id: "stats-101",
    title: "Statistics and Probability",
    group: "Group D",
    endMonth: "June",
    progress: {
      assignmentsCompleted: 50,
      quizzesPassed: [4, 8],
      attendanceRate: 85,
    },
    videos: [
      { id: "vid-stats-1", title: "Introduction to Probability", description: "Basic concepts of probability and discrete distributions.", locked: false },
      { id: "vid-stats-2", title: "Descriptive Statistics", description: "Measures of central tendency and dispersion.", locked: false },
      { id: "vid-stats-3", title: "Inferential Statistics: Hypothesis Testing", description: "Understanding null and alternative hypotheses.", locked: true },
    ],
    assignments: [
      { id: "assign-stats-1", title: "Probability Problem Set", dueDate: "2024-05-15", status: "Graded", grade: "80/100", gradedBy: "Alex Smith" },
      { id: "assign-stats-2", title: "Data Analysis Project", dueDate: "2024-06-01", status: "Missing", grade: null, gradedBy: "Prof. Michael Chen" },
    ],
    quizzes: [
      { id: "quiz-stats-1", title: "Intro to Stats Quiz", dueDate: "2024-05-08", status: "Passed", score: 75, maxScore: 100, gradedBy: "System" },
      { id: "quiz-stats-2", title: "Probability Distributions Quiz", dueDate: "2024-05-15", status: "Failed", score: 55, maxScore: 100, gradedBy: "System" },
    ],
    attendance: [
      { id: "att-stats-1", date: "2024-05-20", status: "Present" },
      { id: "att-stats-2", date: "2024-05-13", status: "Absent" },
    ],
    details: {
      instructor: "Prof. Michael Chen",
      ta: "Alex Smith",
      contact: "alex.smith.ta@example.com",
    },
  },
  "python-101": {
    id: "python-101",
    title: "Introduction to Python",
    group: "Group E",
    endMonth: "July",
    progress: {
      assignmentsCompleted: 80,
      quizzesPassed: [7, 8],
      attendanceRate: 95,
    },
    videos: [
      { id: "vid-python-1", title: "Python Basics: Variables & Data Types", description: "First steps in Python programming.", locked: false },
      { id: "vid-python-2", title: "Control Flow: Loops & Conditionals", description: "Making your programs dynamic with logic.", locked: false },
      { id: "vid-python-3", title: "Functions and Modules", description: "Organizing your code with functions.", locked: false },
    ],
    assignments: [
      { id: "assign-python-1", title: "First Python Program", dueDate: "2024-05-10", status: "Graded", grade: "95/100", gradedBy: "Alex Smith" },
      { id: "assign-python-2", title: "Simple Calculator App", dueDate: "2024-05-20", status: "Submitted", grade: null, gradedBy: "Alex Smith" },
    ],
    quizzes: [
      { id: "quiz-python-1", title: "Module 1 Assessment", dueDate: "2024-05-07", status: "Passed", score: 90, maxScore: 100, gradedBy: "System" },
      { id: "quiz-python-2", title: "Loops and If-Statements Quiz", dueDate: "2024-05-14", status: "Passed", score: 88, maxScore: 100, gradedBy: "System" },
    ],
    attendance: [
      { id: "att-python-1", date: "2024-05-24", status: "Present" },
      { id: "att-python-2", date: "2024-05-17", status: "Present" },
    ],
    details: {
      instructor: "Dr. Sarah Johnson",
      ta: "Alex Smith",
      contact: "alex.smith.ta@example.com",
    },
  },
};

export const studentEnrolledCourses = [ { id: "ict-101", title: "ICT Fundamentals", instructor: "Dr. Sarah Johnson", progress: 75, totalModules: 12, completedModules: 9, nextModule: "Database Design Principles", color: "from-blue-500 to-cyan-500", }, { id: "math-201", title: "Advanced Mathematics", instructor: "Prof. Michael Chen", progress: 60, totalModules: 15, completedModules: 9, nextModule: "Calculus Applications", color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]", }, ];

export const studentUpcomingSessions = [ { id: "1", title: "ICT Q&A Session", instructor: "Dr. Sarah Johnson", date: "Today", time: "3:00 PM", type: "Q&A", course: "ICT Fundamentals", }, { id: "2", title: "Math Lab Help Session", instructor: "Alex Smith (TA)", date: "Tomorrow", time: "2:00 PM", type: "Lab Help", course: "Advanced Mathematics", }, ];

export const studentProfileData = { id: "student-001", name: "Emma Johnson", email: "emma.johnson@example.com", phone: "+1 (555) 987-6543", address: "456 Oak Street, Springfield, IL 62701", dateOfBirth: "2005-03-15", enrollmentDate: "2024-01-01", studentId: "ST2024001", bio: "Passionate about technology and mathematics...", stats: { totalCourses: 3, completedModules: 22, totalModules: 37, averageProgress: 68, studyHours: 45, }, };

export const studentScheduleSessions = [ { id: "1", title: "ICT Q&A Session", instructor: "Dr. Sarah Johnson", course: "ICT Fundamentals", date: "2024-01-15", time: "15:00", duration: "60 min", type: "Q&A", location: "Virtual Room A", attendees: 24, maxAttendees: 30, }, { id: "2", title: "Math Lab Help Session", instructor: "Alex Smith (TA)", course: "Advanced Mathematics", date: "2024-01-16", time: "14:00", duration: "90 min", type: "Lab Help", location: "Virtual Room B", attendees: 18, maxAttendees: 25, }, ];


// --- TA PORTAL DATA ---
export const taDashboardData = {
    studentGroups: [ { id: "group-1", name: "ICT Fundamentals - Group A", studentCount: 12, course: "ICT Fundamentals", nextSession: "2024-01-15T14:00:00Z", pendingQuestions: 3, }, { id: "group-2", name: "Mathematics - Group B", studentCount: 8, course: "Mathematics", nextSession: "2024-01-16T10:00:00Z", pendingQuestions: 1, }, ],
    upcomingSessions: [ { id: "session-1", title: "ICT Q&A Session", course: "ICT Fundamentals", time: "2024-01-15T14:00:00Z", duration: "1 hour", type: "Q&A", students: 12, }, { id: "session-2", title: "Math Problem Solving", course: "Mathematics", time: "2024-01-16T10:00:00Z", duration: "45 minutes", type: "Tutorial", students: 8, }, ],
};

export const taDefaultProfileData = { firstName: "Alex", lastName: "Smith", email: "ta.test@example.com", phone: "+1 (555) 987-6543", address: "456 University Ave, College Town, ST 12345", bio: "Passionate teaching assistant with expertise in computer science and mathematics.", specializations: ["Python Programming", "Data Structures", "Web Development", "Mathematics"], experience: "2 years", education: "Bachelor's in Computer Science, Master's in Education", };

export const taProfileStats = [ { label: "Students Helped", value: "150+", color: "text-blue-600" }, { label: "Sessions Conducted", value: "85", color: "text-green-600" }, { label: "Average Rating", value: "4.9/5", color: "text-purple-600" }, { label: "Response Time", value: "< 2hrs", color: "text-orange-600" }, ];

export const taStudentManagementData = {
    groups: [ { id: "group-1", name: "ICT Fundamentals - Group A", course: "ICT Fundamentals", studentCount: 12, averageProgress: 78, strugglingStudents: 2, students: [ { id: "student-1", name: "Emma Johnson", email: "emma.johnson@example.com", progress: 85, lastActive: "1 hour ago", status: "active", }, { id: "student-3", name: "Sarah Wilson", email: "sarah.wilson@example.com", progress: 45, lastActive: "2 days ago", status: "struggling", }, ], }, ],
    progressInsights: { totalStudents: 35, averageProgress: 77, strugglingStudents: 8, activeStudents: 27, commonStrugglingAreas: [ { topic: "Python Loops", studentCount: 5 }, { topic: "Database Design", studentCount: 4 }, ], },
};

// --- TA ATTENDANCE DATA ---

export const taStudentList = [
    { id: "stu-01", name: "Emma Johnson" }, { id: "stu-02", name: "Michael Chen" },
    { id: "stu-03", name: "Sarah Wilson" }, { id: "stu-04", name: "David Brown" },
    { id: "stu-05", name: "Lisa Wilson" }, { id: "stu-06", name: "James Taylor" },
    { id: "stu-07", name: "Olivia Martinez" }, { id: "stu-08", name: "William Garcia" },
    { id: "stu-09", name: "Sophia Rodriguez" }, { id: "stu-10", name: "Daniel Miller" },
    { id: "stu-11", name: "Isabella Davis" }, { id: "stu-12", name: "Joseph Anderson" },
];

export const taAttendancePageData: { groups: TAttendanceGroup[] } = {
  groups: [
    {
      id: "group-ict-a",
      name: "ICT Fundamentals - Group A",
      course: "ICT-101",
      studentCount: 8,
      students: taStudentList.slice(0, 8),
      sessions: [
        { id: "session-ict-01", date: "2024-05-20", records: [ { studentId: "stu-01", name: "Emma Johnson", status: "Present" }, { studentId: "stu-02", name: "Michael Chen", status: "Present" }, { studentId: "stu-03", name: "Sarah Wilson", status: "Absent" }, { studentId: "stu-04", name: "David Brown", status: "Tardy" }, { studentId: "stu-05", name: "Lisa Wilson", status: "Present" }, { studentId: "stu-06", name: "James Taylor", status: "Present" }, { studentId: "stu-07", name: "Olivia Martinez", status: "Present" }, { studentId: "stu-08", name: "William Garcia", status: "Present" }, ] },
        { id: "session-ict-02", date: "2024-05-13", records: taStudentList.slice(0, 8).map(s => ({ studentId: s.id, name: s.name, status: "Present" as const })), },
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    },
    {
      id: "group-math-b",
      name: "Mathematics - Group B",
      course: "MATH-101",
      studentCount: 8,
      students: taStudentList.slice(4, 12),
      sessions: [ { id: "session-math-01", date: "2024-05-21", records: taStudentList.slice(4, 12).map(s => ({ studentId: s.id, name: s.name, status: "Present" as const })), }, ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    },
     { id: "group-ict-c", name: "ICT Practical - Group C", course: "ICT-102", studentCount: 4, students: taStudentList.slice(8, 12), sessions: [], },
  ]
};

// --- TA GRADING DATA ---
export const taGradingHistory: GradingEntry[] = [
    {
        id: 'grading-1716300000000',
        taName: 'Alex Smith',
        date: '2024-05-20',
        title: 'Midterm 1 Exam',
        maxScore: 100,
        studentGrades: taStudentList.slice(0,8).map(s => ({...s, studentId: s.id, name: s.name, grade: Math.floor(Math.random() * (98 - 75 + 1)) + 75}))
    },
    {
        id: 'grading-1715600000000',
        taName: 'Alex Smith',
        date: '2024-05-13',
        title: 'Homework 4',
        maxScore: 20,
        studentGrades: taStudentList.slice(0,8).map(s => ({...s, studentId: s.id, name: s.name, grade: Math.floor(Math.random() * (20 - 15 + 1)) + 15}))
    },
];

export const taGradingData = {
  courses: [
    { id: "ict-fundamentals", name: "ICT Fundamentals", assignments: [ { id: "assign-1", title: "Assignment 3: Web Basics", dueDate: "2024-05-15", submissions: [ { studentId: "student-1", studentName: "Emma Johnson", status: "Graded", grade: "95/100" }, { studentId: "student-2", studentName: "Michael Chen", status: "Needs Grading", grade: null }, { studentId: "student-3", studentName: "Sarah Wilson", status: "Late", grade: null }, ], }, { id: "assign-3", title: "Assignment 4: Databases", dueDate: "2024-05-22", submissions: [ { studentId: "student-1", studentName: "Emma Johnson", status: "Needs Grading", grade: null }, { studentId: "student-2", studentName: "Michael Chen", status: "Needs Grading", grade: null }, ], }, ], },
    { id: "mathematics", name: "Mathematics", assignments: [ { id: "assign-2", title: "Problem Set 5: Calculus", dueDate: "2024-05-18", submissions: [ { studentId: "student-4", studentName: "David Brown", status: "Needs Grading", grade: null }, { studentId: "student-5", studentName: "Lisa Wilson", status: "Graded", grade: "88/100" }, ], }, ], },
  ],
};

// --- TA RESOURCES AND ANNOUNCEMENTS ---


// --- TA SCHEDULE & AVAILABILITY ---

// --- NEW/MODIFIED DUMMY DATA for Group & Course Management ---

export const allStudents: Student[] = [
  { id: "stu-01", name: "Emma Johnson", registeredCourses: ['ICT', 'Mathematics'] },
  { id: "stu-02", name: "Michael Chen", registeredCourses: ['ICT'] },
  { id: "stu-03", name: "Sarah Wilson", registeredCourses: ['Mathematics'] },
  { id: "stu-04", name: "David Brown", registeredCourses: ['ICT', 'Mathematics'] },
  { id: "stu-05", name: "Lisa Williams", registeredCourses: ['ICT'] },
  { id: "stu-06", name: "James Taylor", registeredCourses: ['Mathematics'] },
  { id: "stu-07", name: "Olivia Martinez", registeredCourses: ['ICT'] },
  { id: "stu-08", name: "William Garcia", registeredCourses: ['Mathematics'] },
  { id: "stu-09", name: "Sophia Rodriguez", registeredCourses: ['ICT', 'Mathematics'] },
  { id: "stu-10", name: "Daniel Miller", registeredCourses: ['ICT'] },
  { id: "stu-11", name: "Isabella Davis", registeredCourses: ['Mathematics'] },
  { id: "stu-12", name: "Joseph Anderson", registeredCourses: ['ICT'] },
  { id: "stu-13", name: "Charlotte White", registeredCourses: ['Mathematics'] },
  { id: "stu-14", name: "Liam Harris", registeredCourses: ['ICT', 'Mathematics'] },
  { id: "stu-15", name: "Ava Clark", registeredCourses: ['ICT'] },
];

export const allInstructors: Instructor[] = [
  { id: "inst-01", name: "Dr. Sarah Johnson" },
  { id: "inst-02", name: "Prof. Michael Chen" },
  { id: "inst-03", name: "Dr. Evelyn Reed" },
];

export const allTAs: Instructor[] = [
    { id: 'ta-001', name: 'Alex Smith' },
    { id: 'ta-002', name: 'Brenda Lee' },
    { id: 'ta-003', name: 'Chris Garcia' },
];

export let allCourses: Course[] = [
  { id: 'ict', title: 'ICT', instructorId: 'inst-01' },
  { id: 'mathematics', title: 'Mathematics', instructorId: 'inst-02' },
];

export let allCourseSessions: CourseSession[] = [
  { id: 'ict-sep-24', courseId: 'ict', month: 'Sep', year: 2024, status: 'active' },
  { id: 'ict-jan-25', courseId: 'ict', month: 'Jan', year: 2025, status: 'inactive' },
  { id: 'math-sep-24', courseId: 'mathematics', month: 'Sep', year: 2024, status: 'active' },
  { id: 'math-jan-25', courseId: 'mathematics', month: 'Jan', year: 2025, status: 'active' },
];

export let taGroupsData: TaGroup[] = [
  {
    id: "group-ict-a",
    sessionId: "ict-sep-24", // Link to session
    groupName: "Group 1",
    students: allStudents.slice(0, 8),
  },
  {
    id: "group-ict-c",
    sessionId: "ict-sep-24", // Link to session
    groupName: "Group 2",
    students: allStudents.slice(8, 12),
  },
  {
    id: "group-math-b",
    sessionId: "math-sep-24", // Link to session
    groupName: "Group 1",
    students: allStudents.slice(4, 12),
  },
  {
    id: "group-web-d",
    sessionId: "ict-jan-25", // Link to session
    groupName: "Group 1",
    students: allStudents.slice(2, 7),
  },
  {
    id: "group-python-e",
    sessionId: "math-jan-25", // Link to session
    groupName: "Group 1",
    students: allStudents.slice(10, 15),
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