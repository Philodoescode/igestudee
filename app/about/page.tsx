"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award, Users, BookOpen, Star, Target, Heart, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingElements } from "@/components/floating-elements"

export default function AboutPage() {
  const philosophyPoints = [
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Tailored learning paths that adapt to individual student needs and learning styles",
    },
    {
      icon: Heart,
      title: "Interactive Engagement",
      description: "Dynamic content delivery methods that keep students engaged and motivated",
    },
    {
      icon: Lightbulb,
      title: "Continuous Growth",
      description: "Regular assessment and feedback mechanisms for continuous improvement",
    },
    {
      icon: Star,
      title: "Confidence Building",
      description: "Structured progression that builds confidence through achievable milestones",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Fostering supportive learning communities where students help each other succeed",
    },
  ]

  const achievements = [
    { icon: "🎓", text: "10+ years of teaching experience", color: "bg-blue-100 text-blue-800" },
    { icon: "👥", text: "500+ students successfully tutored", color: "bg-green-100 text-green-800" },
    { icon: "⭐", text: "95% student satisfaction rate", color: "bg-yellow-100 text-yellow-800" },
    { icon: "🏆", text: "Certified in advanced teaching methodologies", color: "bg-purple-100 text-purple-800" },
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
            About Our{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Program</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our comprehensive approach to ICT and Mathematics education, designed to empower students with
            knowledge and confidence through innovative teaching methods.
          </motion.p>
        </motion.div>

        {/* Program Overview */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl text-emerald-600 flex items-center gap-3 font-poppins">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <BookOpen className="h-8 w-8" />
                </motion.div>
                Program Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-gray-700 space-y-6 relative z-10">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Our ICT and Mathematics tutoring program represents a revolutionary approach to online education,
                combining the flexibility of digital learning with the personal touch of traditional tutoring. We've
                created an integrated digital campus that serves as the central hub for all learning activities.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The program is built around the concept of a comprehensive learning ecosystem where students, teaching
                assistants, parents, and instructors collaborate seamlessly. Our platform goes beyond simple content
                delivery to create an engaging, interactive environment that supports every aspect of the learning
                journey.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                With pre-recorded video lectures, live Q&A sessions, interactive discussion forums, and personalized
                progress tracking, students receive a well-rounded educational experience that adapts to their
                individual learning styles and pace.
              </motion.p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Teaching Philosophy */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">Our Teaching Philosophy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in creating an inclusive, supportive environment where every student can thrive through
              personalized education and collaborative learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {philosophyPoints.map((point, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="text-center relative z-10">
                    <motion.div
                      className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <point.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl font-poppins">{point.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="text-center relative z-10">
                    <p className="text-gray-600">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Instructor Bio */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 relative overflow-hidden">
            <FloatingElements />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />

            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl text-emerald-600 flex items-center gap-3 font-poppins">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <Award className="h-8 w-8" />
                </motion.div>
                Meet Your Instructor
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Instructor Image Placeholder */}
                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-full aspect-square bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl flex items-center justify-center"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <GraduationCap className="h-24 w-24 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <Star className="h-8 w-8 text-yellow-800" />
                    </motion.div>
                  </div>
                </motion.div>

                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h3 className="text-3xl font-poppins font-semibold text-gray-900 mb-2">Dr. Sarah Johnson</h3>
                    <p className="text-emerald-600 font-medium text-lg">Lead Instructor & Program Director</p>
                  </motion.div>

                  <motion.p
                    className="text-lg text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    With over a decade of experience in education and technology, Dr. Johnson brings a unique blend of
                    academic expertise and practical industry knowledge to the program. She holds advanced degrees in
                    Computer Science and Mathematics Education, and has dedicated her career to making complex concepts
                    accessible to students of all backgrounds.
                  </motion.p>

                  <motion.p
                    className="text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Dr. Johnson's passion for education extends beyond traditional classroom boundaries. She has
                    pioneered innovative online teaching methodologies and has been instrumental in developing digital
                    learning platforms that enhance student engagement and success.
                  </motion.p>
                </div>

                <div className="lg:col-span-1 space-y-4">
                  <motion.h4
                    className="text-xl font-poppins font-semibold text-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    Achievements
                  </motion.h4>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, x: 5 }}
                      >
                        <Badge
                          variant="secondary"
                          className={`${achievement.color} text-center py-3 px-4 text-sm font-medium w-full justify-center`}
                        >
                          <span className="mr-2">{achievement.icon}</span>
                          {achievement.text}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Program Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />

            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-3xl font-poppins text-emerald-600">Why Students Choose Our Program</CardTitle>
              <CardDescription className="text-lg">
                Join a community of learners who have transformed their academic journey
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { number: 500, suffix: "+", label: "Students Taught", color: "from-blue-500 to-cyan-500" },
                  { number: 95, suffix: "%", label: "Satisfaction Rate", color: "from-green-500 to-emerald-500" },
                  { number: 24, suffix: "/7", label: "Platform Access", color: "from-purple-500 to-pink-500" },
                  { number: 10, suffix: "+", label: "Years Experience", color: "from-orange-500 to-red-500" },
                  { number: 100, suffix: "+", label: "Video Lectures", color: "from-indigo-500 to-purple-500" },
                  { number: 1, suffix: "", label: "Live Q&A Sessions", color: "from-teal-500 to-cyan-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <motion.div
                      className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                    </motion.div>
                    <div className="text-gray-700 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
