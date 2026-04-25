import { motion } from 'framer-motion'

export function AnimatedGrid({ 
  children, 
  className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
  staggerDelay = 0.1 
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {Array.isArray(children) ? children.map((child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      )) : (
        <motion.div variants={item}>
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}
