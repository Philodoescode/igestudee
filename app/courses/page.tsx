"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Users, Video, Code, Calculator, ArrowRight, Zap, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { FloatingElements } from "@/components/floating-elements"
import { redirect } from "next/navigation"

export default function CoursesPage() {
  redirect('/under-construction');
  const [activeTab, setActiveTab] = useState("ict")

  const ictModules = [
    { title: "Introduction to Programming Concepts", icon: "💻", duration: "2 weeks" },
    { title: "Database Design and Management", icon: "🗄️", duration: "2 weeks" },
    { title: "Web Development Fundamentals", icon: "🌐", duration: "2 weeks" },
    { title: "Network Systems and Security", icon: "🔒", duration: "1.5 weeks" },
    { title: "Software Development Lifecycle", icon: "⚙️", duration: "1.5 weeks" },
    { title: "Digital Communication and Collaboration", icon: "📱", duration: "1 week" },
    { title: "Data Analysis and Visualization", icon: "📊", duration: "1.5 weeks" },
    { title: "Emerging Technologies Overview", icon: "🚀", duration: "1.5 weeks" },
  ]

  const mathModules = [
    { title: "Algebra and Equations", icon: "📐", duration: "2 weeks" },
    { title: "Geometry and Trigonometry", icon: "📏", duration: "2.5 weeks" },
    { title: "Statistics and Probability", icon: "📈", duration: "2 weeks" },
    { title: "Calculus Fundamentals", icon: "∫", duration: "2.5 weeks" },
    { title: "Mathematical Modeling", icon: "🧮", duration: "2 weeks" },
    { title: "Problem-Solving Techniques", icon: "🎯", duration: "1.5 weeks" },
    { title: "Financial Mathematics", icon: "💰", duration: "1.5 weeks" },
    { title: "Advanced Mathematical Concepts", icon: "🔬", duration: "2 weeks" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const courseData = {
    ict: {
      title: "ICT Course",
      icon: Code,
      description: "Master Information and Communication Technology with hands-on practical experience",
      duration: "12 weeks",
      lectures: "60+ hours",
      maxStudents: "20 students",
      modules: ictModules,
      gradient: "from-blue-500 to-cyan-500",
      skills: [
        "Proficiency in programming languages (Python, JavaScript)",
        "Database design and SQL query writing",
        "Web development using HTML, CSS, and frameworks",
        "Understanding of network systems and cybersecurity",
      ],
      applications: [
        "Build complete web applications from scratch",
        "Create and manage databases for real projects",
        "Develop problem-solving skills for technical challenges",
        "Prepare for advanced ICT certifications",
      ],
      prerequisites: [
        { type: "Basic", text: "Computer literacy and internet navigation" },
        { type: "Math", text: "Basic mathematical concepts" },
        { type: "English", text: "Good English comprehension" },
      ],
      requirements: [
        { type: "Hardware", text: "Computer with 4GB+ RAM" },
        { type: "Internet", text: "Stable broadband connection" },
        { type: "Software", text: "Modern web browser" },
      ],
    },
    mathematics: {
      title: "Mathematics Course",
      icon: Calculator,
      description: "Build strong mathematical foundations for academic and professional success",
      duration: "14 weeks",
      lectures: "70+ hours",
      maxStudents: "15 students",
      modules: mathModules,
      gradient: "from-purple-500 to-pink-500",
      skills: [
        "Master algebraic manipulation and equation solving",
        "Understand geometric principles and trigonometric functions",
        "Apply statistical methods and probability concepts",
        "Grasp fundamental calculus concepts",
      ],
      applications: [
        "Develop logical reasoning and analytical thinking",
        "Apply mathematical modeling to real-world problems",
        "Build confidence in tackling complex mathematical challenges",
        "Prepare for advanced mathematics and related fields",
      ],
      prerequisites: [
        { type: "Math", text: "Basic arithmetic and pre-algebra" },
        { type: "Logic", text: "Basic logical reasoning skills" },
        { type: "English", text: "Good reading comprehension" },
      ],
      requirements: [
        { type: "Tools", text: "Scientific calculator" },
        { type: "Software", text: "Graphing software access" },
        { type: "Materials", text: "Digital workbooks provided" },
      ],
    },
  }

  const currentCourse = courseData[activeTab as keyof typeof courseData]

  return (
    <div className="min-h-screen py-12 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-poppins font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Course{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Information
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Comprehensive curriculum designed to build strong foundations in ICT and Mathematics through interactive
            learning and practical applications.
          </motion.p>
        </motion.div>

        {/* Course Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-gray-100 rounded-2xl p-2">
              <TabsTrigger
                value="ict"
                className="text-lg py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Code className="w-5 h-5 mr-2" />
                ICT Course
              </TabsTrigger>
              <TabsTrigger
                value="mathematics"
                className="text-lg py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Mathematics Course
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value={activeTab} className="space-y-8">
                  {/* Course Overview */}
                  <Card className="border-2 border-emerald-200 relative overflow-hidden">
                    <FloatingElements />
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentCourse.gradient} opacity-5`} />

                    <CardHeader className="relative z-10">
                      <CardTitle className="text-3xl text-emerald-600 flex items-center gap-3 font-poppins">
                        <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                          <currentCourse.icon className="h-8 w-8" />
                        </motion.div>
                        {currentCourse.title} Overview
                      </CardTitle>
                      <CardDescription className="text-lg">{currentCourse.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10">
                      <motion.p
                        className="text-lg text-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {activeTab === "ict"
                          ? "Our ICT course is designed to provide students with comprehensive knowledge of modern information and communication technologies. From programming fundamentals to database management and web development, students will gain practical skills that are essential in today's digital world."
                          : "Our Mathematics course provides a comprehensive foundation in mathematical concepts essential for IG students. From algebra and geometry to statistics and calculus, students will develop strong analytical and problem-solving skills that serve as building blocks for advanced mathematical studies."}
                      </motion.p>

                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          { icon: Clock, label: "Duration", value: currentCourse.duration },
                          { icon: Video, label: "Video Lectures", value: currentCourse.lectures },
                          { icon: Users, label: "Class Size", value: `Max ${currentCourse.maxStudents}` },
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <motion.div
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className={`p-2 rounded-lg bg-gradient-to-br ${currentCourse.gradient}`}
                            >
                              <item.icon className="h-6 w-6 text-white" />
                            </motion.div>
                            <div>
                              <div className="font-semibold text-gray-900">{item.label}</div>
                              <div className="text-gray-600">{item.value}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Course Modules */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                          <Target className="h-6 w-6 text-emerald-600" />
                          Course Modules
                        </CardTitle>
                        <CardDescription>
                          Structured learning path covering all essential {activeTab === "ict" ? "ICT" : "Mathematics"}{" "}
                          concepts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {currentCourse.modules.map((module, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="group"
                            >
                              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                                <motion.div className="text-2xl" whileHover={{ scale: 1.2, rotate: 10 }}>
                                  {module.icon}
                                </motion.div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                                    {module.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">{module.duration}</p>
                                </div>
                                <CheckCircle className="h-5 w-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Learning Outcomes */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                          <Zap className="h-6 w-6 text-emerald-600" />
                          Learning Outcomes
                        </CardTitle>
                        <CardDescription>
                          {activeTab === "ict"
                            ? "What you'll achieve by the end of this course"
                            : "Mathematical competencies you'll develop throughout the course"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-lg mb-4 text-emerald-600">
                              {activeTab === "ict" ? "Technical Skills" : "Core Mathematical Skills"}
                            </h4>
                            <ul className="space-y-3">
                              {currentCourse.skills.map((skill, index) => (
                                <motion.li
                                  key={index}
                                  className="flex items-start space-x-3"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: index * 0.1 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-700">{skill}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg mb-4 text-emerald-600">
                              {activeTab === "ict" ? "Practical Applications" : "Problem-Solving Abilities"}
                            </h4>
                            <ul className="space-y-3">
                              {currentCourse.applications.map((application, index) => (
                                <motion.li
                                  key={index}
                                  className="flex items-start space-x-3"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-700">{application}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Prerequisites and Requirements */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-xl text-gray-900">Prerequisites</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {currentCourse.prerequisites.map((prereq, index) => (
                              <motion.li
                                key={index}
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <Badge variant="secondary" className="font-medium">
                                  {prereq.type}
                                </Badge>
                                <span className="text-gray-700">{prereq.text}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-xl text-gray-900">
                            {activeTab === "ict" ? "Technical Requirements" : "Learning Materials"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {currentCourse.requirements.map((requirement, index) => (
                              <motion.li
                                key={index}
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <Badge variant="outline" className="font-medium">
                                  {requirement.type}
                                </Badge>
                                <span className="text-gray-700">{requirement.text}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Enrollment CTA */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 relative overflow-hidden">
            <FloatingElements />
            <CardContent className="text-center py-12 relative z-10">
              <motion.h2
                className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Ready to Begin Your Learning Journey?
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join our comprehensive program and gain the skills you need to excel in ICT and Mathematics with
                personalized support and expert guidance.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl"
                    >
                      <motion.span className="flex items-center" whileHover={{ x: 5 }}>
                        Enroll Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.span>
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="border-emerald-300 hover:bg-emerald-50">
                      Have Questions? Contact Us
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
