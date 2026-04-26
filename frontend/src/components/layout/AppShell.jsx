import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -70, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-rose-500/5 rounded-full blur-[110px]" 
        />
      </div>

      <Sidebar />
      <div className="flex flex-col relative z-10 h-screen overflow-hidden">
        <div className="px-4 md:px-6 lg:px-8">
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-10 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
