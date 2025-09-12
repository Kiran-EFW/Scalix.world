'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedBackgroundProps {
  className?: string
  variant?: 'default' | 'minimal' | 'intense'
}

export default function AnimatedBackground({
  className,
  variant = 'default'
}: AnimatedBackgroundProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'minimal':
        return {
          circles: 2,
          intensity: 0.6,
          speed: 1.5
        }
      case 'intense':
        return {
          circles: 8,
          intensity: 1,
          speed: 0.8
        }
      default:
        return {
          circles: 4,
          intensity: 0.8,
          speed: 1
        }
    }
  }

  const config = getVariantConfig()

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Floating Circles */}
      {Array.from({ length: config.circles }).map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full border-2 border-white/20 backdrop-blur-sm"
          style={{
            width: Math.random() * 120 + 60,
            height: Math.random() * 120 + 60,
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 5}%`,
            background: `radial-gradient(circle, rgba(59, 130, 246, ${0.1 * config.intensity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: (8 + Math.random() * 4) * config.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Solid Circles with Glass Effect */}
      {Array.from({ length: Math.floor(config.circles / 2) }).map((_, i) => (
        <motion.div
          key={`solid-${i}`}
          className="absolute rounded-full backdrop-blur-md border border-white/30"
          style={{
            width: Math.random() * 80 + 40,
            height: Math.random() * 80 + 40,
            top: `${Math.random() * 70 + 20}%`,
            right: `${Math.random() * 70 + 10}%`,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${0.2 * config.intensity}) 0%, rgba(139, 92, 246, ${0.05 * config.intensity}) 50%, transparent 100%)`,
          }}
          animate={{
            y: [0, 25, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: (6 + Math.random() * 3) * config.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Semi-circle Arches */}
      {Array.from({ length: Math.floor(config.circles / 3) }).map((_, i) => (
        <motion.div
          key={`arch-${i}`}
          className="absolute border-2 border-indigo-400/30 rounded-t-full backdrop-blur-sm"
          style={{
            width: Math.random() * 100 + 80,
            height: (Math.random() * 40 + 30),
            bottom: `${Math.random() * 60 + 20}%`,
            left: `${Math.random() * 60 + 20}%`,
            background: `linear-gradient(to bottom, rgba(99, 102, 241, ${0.1 * config.intensity}) 0%, transparent 100%)`,
          }}
          animate={{
            y: [0, -20, 0],
            scaleX: [1, 1.05, 1],
          }}
          transition={{
            duration: (10 + Math.random() * 5) * config.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Wavy Lines */}
      {Array.from({ length: Math.floor(config.circles / 4) }).map((_, i) => (
        <motion.svg
          key={`wave-${i}`}
          className="absolute opacity-30"
          style={{
            top: `${Math.random() * 60 + 20}%`,
            left: `${Math.random() * 50 + 10}%`,
          }}
          width="120"
          height="30"
          viewBox="0 0 120 30"
        >
          <motion.path
            d="M0 15 Q 30 5, 60 15 T 120 15"
            fill="transparent"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
            animate={{ pathOffset: [0, 1] }}
            transition={{
              duration: (8 + Math.random() * 4) * config.speed,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        </motion.svg>
      ))}

      {/* Floating Dotted Lines */}
      {Array.from({ length: Math.floor(config.circles / 3) }).map((_, i) => (
        <motion.div
          key={`dots-${i}`}
          className="absolute flex space-x-1"
          style={{
            top: `${Math.random() * 50 + 30}%`,
            left: `${Math.random() * 40 + 5}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: (7 + Math.random() * 3) * config.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 6,
          }}
        >
          {Array.from({ length: 6 + Math.floor(Math.random() * 4) }).map((_, j) => (
            <div
              key={j}
              className="w-1.5 h-1.5 rounded-full bg-blue-400/40 backdrop-blur-sm"
            />
          ))}
        </motion.div>
      ))}

      {/* Diagonal Stripe Rectangles */}
      {Array.from({ length: Math.floor(config.circles / 5) }).map((_, i) => (
        <motion.div
          key={`stripe-${i}`}
          className="absolute overflow-hidden backdrop-blur-sm border border-white/20 rounded-lg"
          style={{
            width: Math.random() * 100 + 100,
            height: Math.random() * 30 + 20,
            top: `${Math.random() * 40 + 15}%`,
            right: `${Math.random() * 40 + 10}%`,
            transform: `rotate(${Math.random() * 40 - 20}deg)`,
            background: `linear-gradient(45deg, rgba(59, 130, 246, ${0.1 * config.intensity}) 0%, rgba(139, 92, 246, ${0.15 * config.intensity}) 50%, rgba(236, 72, 153, ${0.1 * config.intensity}) 100%)`,
          }}
          animate={{
            y: [0, 20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: (9 + Math.random() * 4) * config.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 7,
          }}
        />
      ))}

      {/* Gradient Orbs */}
      {Array.from({ length: Math.floor(config.circles / 6) }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            top: `${Math.random() * 60 + 20}%`,
            left: `${Math.random() * 60 + 20}%`,
            background: `radial-gradient(circle, rgba(59, 130, 246, ${0.05 * config.intensity}) 0%, rgba(139, 92, 246, ${0.03 * config.intensity}) 30%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: (12 + Math.random() * 6) * config.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 8,
          }}
        />
      ))}
    </div>
  )
}
