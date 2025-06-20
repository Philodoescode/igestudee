"use client"

import { motion } from "framer-motion"

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simplified floating shapes - reduced from 6 to 3 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-[var(--color-gossamer-200)]/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Simplified larger elements - reduced from 3 to 2 */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`large-${i}`}
          className="absolute w-8 h-8 bg-gradient-to-br from-[var(--color-gossamer-300)]/10 to-[var(--color-gossamer-400)]/10 rounded-lg"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
