// lib/database.ts

// NOTE: In a real application, these types would likely be defined in separate, shared type definition files.
// For this mock database, they are included here for simplicity and context.

import { BookOpen, Calendar, CheckCircle, GraduationCap, Heart, MessageSquare, Plus, Megaphone, Shield, TrendingUp, UserCheck, Users, DollarSign, BarChart3, Settings, LayoutDashboard, User } from "lucide-react";

// --- HOMEPAGE DATA ---

export const homePageFeatures = [
    {
      icon: BookOpen,
      title: "Pre-recorded Lectures",
      description: "Access comprehensive video lectures and practical tutorials anytime",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Collaborate with peers and get support from teaching assistants",
      color: "from-purple-500 to-pink-500",
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
  monthlyRevenue: 12450,
  engagementRate: 87,
  newStudentsThisMonth: 23,
  activeDiscussions: 34,
};

export const instructorRecentActivity = [
  { id: 1, type: "enrollment", user: "Emma Johnson", action: "enrolled in ICT Fundamentals", time: "2 hours ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, type: "completion", user: "Michael Chen", action: "completed Module 3 - Web Development", time: "4 hours ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, type: "question", user: "Sarah Williams", action: "posted a question in Mathematics Forum", time: "6 hours ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 4, type: "payment", user: "David Brown", action: "completed payment for Q1 tuition", time: "1 day ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 5, type: "assignment", user: "Alex Smith (TA)", action: "graded 15 assignments", time: "1 day ago", avatar: "/placeholder.svg?height=32&width=32" },
];

export const instructorUpcomingSessions = [
  { id: 1, title: "ICT Q&A Session", time: "Today, 3:00 PM", participants: 12, type: "Q&A" },
  { id: 2, title: "Mathematics Workshop", time: "Tomorrow, 10:00 AM", participants: 8, type: "Workshop" },
  { id: 3, title: "Web Development Lab", time: "Friday, 2:00 PM", participants: 15, type: "Lab" },
];

export const instructorQuickActions = [
  { title: "Create Announcement", description: "Send updates to students and parents", icon: Megaphone, href: "/instructor/announcements/create", color: "from-blue-600 to-indigo-600" },
  { title: "Add Student", description: "Enroll new students in courses", icon: User, href: "/instructor/users/create", color: "from-green-600 to-emerald-600" },
  { title: "Create Course", description: "Set up new course content", icon: Plus, href: "/instructor/courses/create", color: "from-purple-600 to-pink-600" },
];

export const instructorEngagementStats = {
  totalStudents: 156, activeStudents: 142, avgSessionTime: "45m", completionRate: 78, forumPosts: 234, videoViews: 1847,
};

export const instructorCourseEngagement = [
  { id: "course-001", title: "ICT Fundamentals", students: 45, completionRate: 78, avgTimeSpent: "3.2h", forumActivity: 89, lastAccessed: "2024-03-12", trend: "up" },
  { id: "course-002", title: "Advanced Mathematics", students: 32, completionRate: 65, avgTimeSpent: "4.1h", forumActivity: 67, lastAccessed: "2024-03-12", trend: "down" },
  { id: "course-003", title: "Web Development Basics", students: 28, completionRate: 82, avgTimeSpent: "2.8h", forumActivity: 45, lastAccessed: "2024-03-11", trend: "up" },
  { id: "course-004", title: "Statistics and Probability", students: 25, completionRate: 71, avgTimeSpent: "3.5h", forumActivity: 33, lastAccessed: "2024-03-10", trend: "stable" },
];

export const instructorStudentActivity = [
  { id: "student-001", name: "Emma Johnson", course: "ICT Fundamentals", lastActive: "2 hours ago", completionRate: 85, timeSpent: "12.5h", forumPosts: 15, status: "active" },
  { id: "student-002", name: "Michael Chen", course: "Advanced Mathematics", lastActive: "1 day ago", completionRate: 92, timeSpent: "18.2h", forumPosts: 8, status: "active" },
  { id: "student-003", name: "Sarah Williams", course: "Web Development", lastActive: "3 hours ago", completionRate: 67, timeSpent: "8.7h", forumPosts: 22, status: "active" },
  { id: "student-004", name: "David Brown", course: "Statistics", lastActive: "1 week ago", completionRate: 34, timeSpent: "4.2h", forumPosts: 2, status: "inactive" },
];

export const instructorFinancialStats = {
  totalRevenue: 45750, monthlyRevenue: 12450, pendingPayments: 3200, overduePayments: 850, totalStudents: 156, paidStudents: 142,
};

export const instructorTransactions = [
  { id: "txn-001", studentName: "Emma Johnson", amount: 450, status: "completed", date: "2024-03-12", method: "Credit Card", course: "ICT Fundamentals", invoiceId: "INV-2024-001" },
  { id: "txn-002", studentName: "Michael Chen", amount: 380, status: "completed", date: "2024-03-11", method: "Bank Transfer", course: "Advanced Mathematics", invoiceId: "INV-2024-002" },
  { id: "txn-003", studentName: "Sarah Williams", amount: 450, status: "pending", date: "2024-03-10", method: "Credit Card", course: "ICT Fundamentals", invoiceId: "INV-2024-003" },
  { id: "txn-004", studentName: "David Brown", amount: 380, status: "overdue", date: "2024-02-28", method: "Bank Transfer", course: "Statistics", invoiceId: "INV-2024-004" },
  { id: "txn-005", studentName: "Lisa Wilson", amount: 450, status: "completed", date: "2024-03-09", method: "Credit Card", course: "Web Development", invoiceId: "INV-2024-005" },
];

export const instructorUsers = [
  { id: "user-001", name: "Emma Johnson", email: "emma.johnson@example.com", role: "student", status: "active", enrolledCourses: 3, joinDate: "2024-01-15", lastLogin: "2024-03-12", phone: "+1 (555) 123-4567", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-002", name: "Sarah Johnson", email: "parent.test@example.com", role: "parent", status: "active", enrolledCourses: 0, joinDate: "2024-01-15", lastLogin: "2024-03-11", phone: "+1 (555) 123-4567", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-003", name: "Michael Chen", email: "michael.chen@example.com", role: "student", status: "active", enrolledCourses: 2, joinDate: "2024-02-01", lastLogin: "2024-03-12", phone: "+1 (555) 234-5678", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-004", name: "Alex Smith", email: "ta.test@example.com", role: "ta", status: "active", enrolledCourses: 0, joinDate: "2024-01-10", lastLogin: "2024-03-12", phone: "+1 (555) 345-6789", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-005", name: "David Brown", email: "david.brown@example.com", role: "student", status: "inactive", enrolledCourses: 1, joinDate: "2023-12-15", lastLogin: "2024-02-28", phone: "+1 (555) 456-7890", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user-006", name: "Lisa Wilson", email: "lisa.wilson@example.com", role: "parent", status: "active", enrolledCourses: 0, joinDate: "2024-02-10", lastLogin: "2024-03-10", phone: "+1 (555) 567-8901", avatar: "/placeholder.svg?height=40&width=40" },
];

export const defaultPlatformSettings = {
    siteName: "EduTech Academy", siteDescription: "ICT & Mathematics Tutoring Program", contactEmail: "admin@edutech.academy", supportEmail: "support@edutech.academy", timezone: "UTC-5", language: "en",
    emailNotifications: true, smsNotifications: false, pushNotifications: true, weeklyReports: true, paymentAlerts: true,
    twoFactorAuth: false, sessionTimeout: 24, passwordExpiry: 90, loginAttempts: 5,
    autoEnrollment: false, courseApproval: true, maxStudentsPerCourse: 50, allowGuestAccess: false,
    currency: "USD", paymentGateway: "stripe", autoInvoicing: true, lateFeePercentage: 5,
};


// --- PARENT PORTAL DATA ---

export const parentAnnouncements = [
    { id: 1, title: "Term 2 Assessment Schedule Released", content: "We are pleased to announce that the assessment schedule for Term 2 has been finalized...", date: "2024-01-15", time: "09:30 AM", priority: "high", category: "academic", author: "Dr. Sarah Johnson", read: false, },
    { id: 2, title: "Parent-Teacher Conference Invitations", content: "We invite all parents to schedule one-on-one sessions with instructors...", date: "2024-01-12", time: "02:15 PM", priority: "medium", category: "events", author: "Academic Coordinator", read: true, },
    { id: 3, title: "Platform Maintenance Notice", content: "Our learning platform will undergo scheduled maintenance this weekend...", date: "2024-01-10", time: "04:45 PM", priority: "low", category: "technical", author: "IT Support Team", read: true, },
    { id: 4, title: "New Study Resources Available", content: "We've added new interactive study materials and practice exercises...", date: "2024-01-08", time: "11:20 AM", priority: "medium", category: "academic", author: "Curriculum Team", read: true, },
];

export const parentAttendanceData = {
    "Emma Johnson": { summary: { present: 125, excused: 3, unexcused: 1, tardy: 2, totalDays: 131, }, events: [ { date: "2024-03-12", status: "unexcused", period: "Period 2", course: "Mathematics" }, { date: "2024-03-05", status: "tardy", period: "Period 1", course: "ICT Course" }, { date: "2024-02-28", status: "excused", period: "Full Day", course: "N/A" }, ], },
};

export const parentBillingData = {
    nextPaymentDue: { date: "2024-02-01", amount: 450, description: "February 2024 Tuition", },
    paymentHistory: [ { id: "INV-2024-001", date: "2024-01-01", amount: 450, description: "January 2024 Tuition", status: "paid", method: "Credit Card", downloadUrl: "#", }, { id: "INV-2023-012", date: "2023-12-01", amount: 450, description: "December 2023 Tuition", status: "paid", method: "Credit Card", downloadUrl: "#", }, ],
    upcomingPayments: [ { date: "2024-02-01", amount: 450, description: "February 2024 Tuition", status: "scheduled", }, { date: "2024-03-01", amount: 450, description: "March 2024 Tuition", status: "pending", }, ],
};

export const parentDashboardChildren = ["Emma Johnson", "Liam Johnson"];

export const parentDashboardData = {
    "Emma Johnson": { keyMetrics: { overallGrade: 88, attendanceRate: 98, upcomingDeadlines: 3, }, courses: [ { name: "ICT Course", grade: 92, trend: "up" }, { name: "Mathematics Course", grade: 85, trend: "stable" }, ], upcoming: [ { type: "Assignment", title: "Web Portfolio Project", due: "3 days" }, { type: "Exam", title: "Calculus Mid-term", due: "5 days" }, ], attendanceAlerts: [{ type: "Unexcused Absence", date: "Yesterday" }], recentAnnouncements: [ { id: 1, title: "Term 2 Assessment Schedule Released", priority: "high" }, { id: 2, title: "Parent-Teacher Conference Invitations", priority: "medium" }, ], },
    "Liam Johnson": { keyMetrics: { overallGrade: 91, attendanceRate: 100, upcomingDeadlines: 2, }, courses: [ { name: "Intro to Programming", grade: 94, trend: "up" }, { name: "Algebra II", grade: 88, trend: "up" }, ], upcoming: [ { type: "Project", title: "Python Game Final Project", due: "1 week" }, { type: "Test", title: "Algebra Chapter 5 Test", due: "2 weeks" }, ], attendanceAlerts: [], recentAnnouncements: [{ id: 1, title: "School Robotics Club Sign-ups", priority: "low" }], },
};

export const parentDefaultProfileData = { firstName: "Sarah", lastName: "Johnson", email: "parent.test@example.com", phone: "+1 (555) 123-4567", address: "123 Main Street", city: "Springfield", state: "IL", zipCode: "62701", emergencyContact: "John Johnson", emergencyPhone: "+1 (555) 987-6543", relationship: "Spouse", bio: "Dedicated parent committed to supporting my child's educational journey...", };

export const parentChildInfo = { name: "Emma Johnson", studentId: "STU-2024-001", grade: "10th Grade", enrollmentDate: "2024-01-08", courses: ["ICT Course", "Mathematics Course"], emergencyContact: "Sarah Johnson", medicalInfo: "No known allergies", };

export const parentProgressData = {
    courses: [ { id: "ict", name: "ICT Course", overallGrade: 92, gradeTrend: "up", gradeBreakdown: [ { category: "Homework", weight: 20, score: 95 }, { category: "Quizzes", weight: 30, score: 88 }, { category: "Mid-term Exam", weight: 20, score: 90 }, { category: "Final Project", weight: 30, score: 94 }, ], assignments: [ { id: 1, title: "HTML Basics", status: "graded", grade: "95/100" }, { id: 2, title: "CSS Styling", status: "graded", grade: "92/100" }, ], assessments: [ { id: 1, title: "Networking Quiz", score: 85, total: 100, classAvg: 78 }, ], },
      { id: "math", name: "Mathematics Course", overallGrade: 85, gradeTrend: "stable", gradeBreakdown: [ { category: "Homework", weight: 30, score: 88 }, { category: "Quizzes", weight: 40, score: 82 }, { category: "Final Exam", weight: 30, score: 87 }, ], assignments: [ { id: 1, title: "Algebra Problem Set", status: "graded", grade: "88/100" }, ], assessments: [ { id: 1, title: "Trigonometry Quiz", score: 80, total: 100, classAvg: 75 }, ], }, ],
};


// --- STUDENT PORTAL DATA ---

export const studentAnnouncements = [
    { id: "1", title: "New ICT Module Released: Database Design Principles", content: "We're excited to announce the release of Module 10...", date: "2024-01-15T10:30:00Z", course: "ICT Fundamentals", priority: "high", type: "course_update", author: "Dr. Sarah Johnson", read: false, },
    { id: "2", title: "Math Assignment Due Reminder", content: "This is a friendly reminder that your calculus problem set is due this Friday...", date: "2024-01-14T14:15:00Z", course: "Advanced Mathematics", priority: "medium", type: "assignment", author: "Prof. Michael Chen", read: true, },
];

export const studentBillingInfo = { currentPlan: "Premium Student Plan", monthlyFee: 149.99, nextBilling: "2024-02-15", status: "active", paymentMethod: { type: "card", last4: "4242", brand: "Visa", expiryMonth: 12, expiryYear: 2025, }, };

export const studentPaymentHistory = [ { id: "inv_001", date: "2024-01-15", amount: 149.99, status: "paid", description: "Premium Student Plan - January 2024", downloadUrl: "#", }, { id: "inv_002", date: "2023-12-15", amount: 149.99, status: "paid", description: "Premium Student Plan - December 2023", downloadUrl: "#", }, ];

export const studentBillingPlans = [ { name: "Basic Plan", price: 99.99, features: ["Access to 2 courses", "Basic video lectures"], current: false, }, { name: "Premium Student Plan", price: 149.99, features: [ "Access to all courses", "HD video lectures", "Live Q&A sessions", "Priority support", ], current: true, popular: true, }, { name: "Advanced Plan", price: 199.99, features: [ "Everything in Premium", "1-on-1 tutoring sessions", "Custom study plans", ], current: false, }, ];

export const studentCourseForums = [ { id: "ict-101", name: "ICT Fundamentals Forum", description: "Discuss ICT concepts, ask questions, and share insights", totalTopics: 45, totalPosts: 234, lastActivity: "2 hours ago", color: "from-blue-500 to-cyan-500", participants: 28, }, { id: "math-201", name: "Advanced Mathematics Forum", description: "Mathematical discussions, problem solving, and study groups", totalTopics: 67, totalPosts: 412, lastActivity: "1 hour ago", color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]", participants: 35, }, ];

export const studentRecentForumTopics = [ { id: "1", title: "Database Normalization Best Practices", author: "Emma Johnson", course: "ICT Fundamentals", replies: 12, lastReply: "30 minutes ago", isPinned: true, isHot: true, }, { id: "2", title: "Calculus Integration Techniques Help", author: "Michael Chen", course: "Advanced Mathematics", replies: 8, lastReply: "1 hour ago", isPinned: false, isHot: true, }, ];

export const studentEnrolledCourses = [ { id: "ict-101", name: "ICT Fundamentals", instructor: "Dr. Sarah Johnson", progress: 75, totalModules: 12, completedModules: 9, nextModule: "Database Design Principles", color: "from-blue-500 to-cyan-500", }, { id: "math-201", name: "Advanced Mathematics", instructor: "Prof. Michael Chen", progress: 60, totalModules: 15, completedModules: 9, nextModule: "Calculus Applications", color: "from-[var(--color-gossamer-500)] to-[var(--color-gossamer-600)]", }, ];

export const studentUpcomingSessions = [ { id: "1", title: "ICT Q&A Session", instructor: "Dr. Sarah Johnson", date: "Today", time: "3:00 PM", type: "Q&A", course: "ICT Fundamentals", }, { id: "2", title: "Math Lab Help", instructor: "Alex Smith (TA)", date: "Tomorrow", time: "2:00 PM", type: "Lab Help", course: "Advanced Mathematics", }, ];

export const studentRecentAnnouncements = [ { id: "1", title: "New ICT Module Released", content: "Module 10: Database Design Principles is now available...", date: "2 hours ago", course: "ICT Fundamentals", priority: "high", }, { id: "2", title: "Math Assignment Due Reminder", content: "Don't forget to submit your calculus problem set...", date: "1 day ago", course: "Advanced Mathematics", priority: "medium", }, ];

export const studentProfileData = { id: "student-001", name: "Emma Johnson", email: "emma.johnson@example.com", phone: "+1 (555) 987-6543", address: "456 Oak Street, Springfield, IL 62701", dateOfBirth: "2005-03-15", enrollmentDate: "2024-01-01", studentId: "ST2024001", bio: "Passionate about technology and mathematics...", achievements: [ { name: "Database Design Expert", date: "2024-01-10", course: "ICT Fundamentals" }, ], stats: { totalCourses: 3, completedModules: 22, totalModules: 37, averageProgress: 68, studyHours: 45, forumPosts: 28, }, };

export const studentScheduleSessions = [ { id: "1", title: "ICT Q&A Session", instructor: "Dr. Sarah Johnson", course: "ICT Fundamentals", date: "2024-01-15", time: "15:00", duration: "60 min", type: "Q&A", location: "Virtual Room A", attendees: 24, maxAttendees: 30, }, { id: "2", title: "Math Lab Help Session", instructor: "Alex Smith (TA)", course: "Advanced Mathematics", date: "2024-01-16", time: "14:00", duration: "90 min", type: "Lab Help", location: "Virtual Room B", attendees: 18, maxAttendees: 25, }, ];


// --- TA PORTAL DATA ---

export const taForumData = {
    courses: [ { id: "ict-fundamentals", name: "ICT Fundamentals", totalTopics: 45, unansweredQuestions: 8, recentActivity: "2 hours ago", }, { id: "mathematics", name: "Mathematics", totalTopics: 32, unansweredQuestions: 3, recentActivity: "4 hours ago", }, ],
    recentQuestions: [ { id: "q1", title: "Help with Python loops and iteration", course: "ICT Fundamentals", student: "Emma Johnson", timeAgo: "2 hours ago", priority: "high", replies: 0, status: "unanswered", isPinned: false, isLocked: false, }, { id: "q2", title: "Algebra equation solving methods", course: "Mathematics", student: "Michael Chen", timeAgo: "4 hours ago", priority: "medium", replies: 3, status: "answered", isPinned: true, isLocked: false, }, ],
};

export const taDashboardData = {
    studentGroups: [ { id: "group-1", name: "ICT Fundamentals - Group A", studentCount: 12, course: "ICT Fundamentals", nextSession: "2024-01-15T14:00:00Z", pendingQuestions: 3, }, { id: "group-2", name: "Mathematics - Group B", studentCount: 8, course: "Mathematics", nextSession: "2024-01-16T10:00:00Z", pendingQuestions: 1, }, ],
    forumActivity: [ { id: "q1", title: "Help with Python loops", course: "ICT Fundamentals", student: "Emma Johnson", timeAgo: "2 hours ago", priority: "high", replies: 0, }, { id: "q2", title: "Algebra equation solving", course: "Mathematics", student: "Michael Chen", timeAgo: "4 hours ago", priority: "medium", replies: 1, }, ],
    upcomingSessions: [ { id: "session-1", title: "ICT Q&A Session", course: "ICT Fundamentals", time: "2024-01-15T14:00:00Z", duration: "1 hour", type: "Q&A", students: 12, }, { id: "session-2", title: "Math Problem Solving", course: "Mathematics", time: "2024-01-16T10:00:00Z", duration: "45 minutes", type: "Tutorial", students: 8, }, ],
    announcements: [ { id: "ann-1", title: "New Assessment Guidelines", content: "Updated guidelines for student assessments have been released.", priority: "high", timeAgo: "1 day ago", from: "Dr. Sarah Johnson", }, ],
};

export const taDefaultProfileData = { firstName: "Alex", lastName: "Smith", email: "ta.test@example.com", phone: "+1 (555) 987-6543", address: "456 University Ave, College Town, ST 12345", bio: "Passionate teaching assistant with expertise in computer science and mathematics.", specializations: ["Python Programming", "Data Structures", "Web Development", "Mathematics"], experience: "2 years", education: "Bachelor's in Computer Science, Master's in Education", };

// export const taProfileAchievements = [ { title: "Outstanding TA Award", description: "Recognized for exceptional student support", date: "Fall 2023", icon: Award, }, { title: "Student Favorite", description: "Highest student satisfaction ratings", date: "Spring 2023", icon: Award, }, ];

export const taProfileStats = [ { label: "Students Helped", value: "150+", color: "text-blue-600" }, { label: "Sessions Conducted", value: "85", color: "text-green-600" }, { label: "Average Rating", value: "4.9/5", color: "text-purple-600" }, { label: "Response Time", value: "< 2hrs", color: "text-orange-600" }, ];

export const taScheduleData = {
    sessions: [ { id: "session-1", title: "ICT Q&A Session", course: "ICT Fundamentals", type: "Q&A", date: "2024-01-15", time: "14:00", duration: "1 hour", students: 12, location: "Virtual - Zoom Room 1", status: "upcoming", description: "Weekly Q&A session for ICT Fundamentals students", }, { id: "session-5", title: "ICT Review Session", course: "ICT Fundamentals", type: "Review", date: "2024-01-12", time: "15:00", duration: "1.5 hours", students: 10, location: "Virtual - Zoom Room 1", status: "completed", description: "Review session for Module 3 concepts", }, ],
    weeklyHours: 8, totalSessions: 12, averageAttendance: 85,
};

export const taStudentManagementData = {
    groups: [ { id: "group-1", name: "ICT Fundamentals - Group A", course: "ICT Fundamentals", studentCount: 12, averageProgress: 78, strugglingStudents: 2, students: [ { id: "student-1", name: "Emma Johnson", email: "emma.johnson@example.com", progress: 85, lastActive: "1 hour ago", status: "active", }, { id: "student-3", name: "Sarah Wilson", email: "sarah.wilson@example.com", progress: 45, lastActive: "2 days ago", status: "struggling", }, ], }, ],
    progressInsights: { totalStudents: 35, averageProgress: 77, strugglingStudents: 8, activeStudents: 27, commonStrugglingAreas: [ { topic: "Python Loops", studentCount: 5 }, { topic: "Database Design", studentCount: 4 }, ], },
};