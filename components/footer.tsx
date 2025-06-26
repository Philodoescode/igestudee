"use client"

import Link from "next/link"
import { GraduationCap, Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 text-[var(--color-gossamer-400)]">
                <GraduationCap className="h-8 w-8" />
              </div>
              <span className="font-poppins font-bold text-xl">EduTech Academy</span>
            </div>
            <motion.p className="text-gray-300 mb-6 max-w-md leading-relaxed" variants={itemVariants}>
              Transform your understanding of ICT and Mathematics with our comprehensive online tutoring program. Join
              our digital campus and excel in your studies with personalized support and expert guidance.
            </motion.p>
            {/* <motion.div className="flex space-x-4" variants={itemVariants}>
              {["facebook", "twitter", "linkedin", "youtube"].map((social, index) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-[var(--color-gossamer-600)]/20 rounded-full flex items-center justify-center hover:bg-[var(--color-gossamer-600)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current rounded" />
                </motion.a>
              ))}
            </motion.div> */}
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-poppins font-semibold text-lg mb-4 text-[var(--color-gossamer-400)]">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About Program", href: "/about" },
                { name: "Course Information", href: "/courses" },
                { name: "Student Login", href: "/login" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[var(--color-gossamer-400)] transition-colors flex items-center group"
                  >
                    <motion.span className="w-0 h-0.5 bg-[var(--color-gossamer-400)] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-poppins font-semibold text-lg mb-4 text-[var(--color-gossamer-400)]">Contact Info</h3>
            <ul className="space-y-4">
              {[
                { icon: Phone, text: "(+20) 122 5223 840" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0">
                    <item.icon className="h-5 w-5 text-[var(--color-gossamer-400)]" />
                  </motion.div>
                  <span className="text-gray-300">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 EduTech Academy. All rights reserved.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-[var(--color-gossamer-400)] text-[var(--color-gossamer-400)] hover:bg-[var(--color-gossamer-400)] hover:text-gray-900"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
