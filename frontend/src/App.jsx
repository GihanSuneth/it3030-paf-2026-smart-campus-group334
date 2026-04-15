import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AccountManagement from './pages/AccountManagement'
import FacilitiesResourceManagement from './pages/FacilitiesResourceManagement'
import IncidentHandling from './pages/IncidentHandling'
import ReserveResource from './pages/ReserveResource'
import './App.css'

const navigationItems = [
  {
    path: '/dashboard/facilities-resource-management',
    label: 'Facilities & Resource Management',
    shortLabel: 'Facilities',
    tag: 'FRM',
  },
  {
    path: '/dashboard/reserve-resource',
    label: 'Reserve Resource',
    shortLabel: 'Reserve',
    tag: 'RES',
  },
  {
    path: '/dashboard/incident-handling',
    label: 'Incident Handling',
    shortLabel: 'Incidents',
    tag: 'INC',
  },
  {
    path: '/dashboard/account-management',
    label: 'Account Management',
    shortLabel: 'Accounts',
    tag: 'ACC',
  },
]

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar items={navigationItems} />
      <div className="dashboard-panel">
        <Navbar items={navigationItems} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/facilities-resource-management" replace />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="facilities-resource-management" replace />} />
        <Route
          path="facilities-resource-management"
          element={<FacilitiesResourceManagement />}
        />
        <Route path="reserve-resource" element={<ReserveResource />} />
        <Route path="incident-handling" element={<IncidentHandling />} />
        <Route path="account-management" element={<AccountManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/facilities-resource-management" replace />} />
    </Routes>
  )
}

export default App
