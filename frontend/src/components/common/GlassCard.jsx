import { motion } from 'framer-motion'

export function GlassCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`glass-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
