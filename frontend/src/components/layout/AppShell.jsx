import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] lg:grid lg:grid-cols-[24rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0 px-4 py-4 md:px-6 lg:px-8">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
