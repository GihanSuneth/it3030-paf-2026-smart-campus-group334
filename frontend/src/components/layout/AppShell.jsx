import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0 px-4 py-4 md:px-5 lg:px-6">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
