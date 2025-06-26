"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Video, MessageSquare, BarChart3, Clock, ArrowRight, Sparkles } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingElements } from "@/components/floating-elements"
import { useRef } from "react"
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect('/under-construction');
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const features = [
    {
      icon: Video,
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
      icon: Clock,
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
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-br from-[var(--color-gossamer-50)] via-[var(--color-gossamer-100)] to-cyan-50 py-20 overflow-hidden"
      >
        <FloatingElements />

        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ y, opacity }}>
          <motion.div className="text-center" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 bg-[var(--color-gossamer-100)] rounded-full text-[var(--color-gossamer-800)] text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Transform Your Learning Journey
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Excel in{" "}
              <span className="bg-gradient-to-r from-[var(--color-gossamer-600)] via-[var(--color-gossamer-700)] to-cyan-600 bg-clip-text text-transparent">
                ICT & Mathematics
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                with Expert Guidance
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Join our comprehensive online tutoring program designed for IG students. Access pre-recorded lectures,
              live Q&A sessions, and a supportive learning community all in one integrated digital campus.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center" variants={itemVariants}>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="group">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[var(--color-gossamer-600)] to-[var(--color-gossamer-700)] hover:from-[var(--color-gossamer-700)] hover:to-[var(--color-gossamer-800)] text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <motion.span className="flex items-center" whileHover={{ x: 5 }}>
                      Enroll Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/about">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 border-[var(--color-gossamer-300)] hover:bg-[var(--color-gossamer-50)] hover:border-[var(--color-gossamer-400)]"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                { number: 500, suffix: "+", label: "Students Taught" },
                { number: 95, suffix: "%", label: "Success Rate" },
                { number: 10, suffix: "+", label: "Years Experience" },
                { number: 24, suffix: "/7", label: "Platform Access" },
              ].map((stat, index) => (
                <motion.div key={index} className="text-center" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  <div className="text-3xl md:text-4xl font-bold text-[var(--color-gossamer-600)] mb-2">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Simplified background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[var(--color-gossamer-200)]/30 to-[var(--color-gossamer-300)]/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      </section>

      {/* Course Offerings */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-gray-900 mb-4">Course Offerings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive curriculum designed to help you master ICT and Mathematics concepts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
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
            ].map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="border-2 hover:border-[var(--color-gossamer-200)] transition-all duration-300 h-full relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <CardHeader className="relative z-10">
                    <CardTitle className="text-2xl text-[var(--color-gossamer-600)] font-poppins">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-lg">{course.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <ul className="space-y-3 mb-6">
                      {course.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}
                        >
                          <CheckCircle className="h-5 w-5 text-[var(--color-gossamer-500)] flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <Link href={course.href}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-[var(--color-gossamer-50)] group-hover:border-[var(--color-gossamer-300)] transition-colors"
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[var(--color-gossamer-50)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-gray-900 mb-4">Why Choose Our Program?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience a comprehensive digital learning environment designed for your success
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group">
                <Card className="text-center hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <CardHeader className="relative z-10">
                    <motion.div
                      className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl font-poppins">{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-gossamer-600)] via-[var(--color-gossamer-700)] to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <FloatingElements />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Start Your Learning Journey?
          </motion.h2>

          <motion.p
            className="text-xl text-[var(--color-gossamer-100)] mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join hundreds of students who have already transformed their understanding of ICT and Mathematics
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-4 bg-white text-[var(--color-gossamer-600)] hover:bg-gray-100 shadow-xl"
                >
                  <motion.span className="flex items-center" whileHover={{ x: 5 }}>
                    Enroll Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>

            <Link href="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-[var(--color-gossamer-600)] transition-colors"
                >
                  Contact Us
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
