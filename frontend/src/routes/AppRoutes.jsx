import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ROLES, ROLE_HOME_PATHS } from '../constants/roles'
import { useAuth } from '../hooks/useAuth'
import { LoginPage } from '../pages/auth/LoginPage'
import { NotFoundPage } from '../pages/auth/NotFoundPage'
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AllBookingsPage } from '../pages/admin/AllBookingsPage'
import { AssignTechnicianPage } from '../pages/admin/AssignTechnicianPage'
import { ManageResourcesPage } from '../pages/admin/ManageResourcesPage'
import { ManageTicketsPage } from '../pages/admin/ManageTicketsPage'
import { PendingBookingsPage } from '../pages/admin/PendingBookingsPage'
import { UserManagementPage } from '../pages/admin/UserManagementPage'
import { DashboardPage } from '../pages/shared/DashboardPage'
import { NotificationsPage } from '../pages/shared/NotificationsPage'
import { ProfilePage } from '../pages/shared/ProfilePage'
import { CreateBookingPage } from '../pages/user/CreateBookingPage'
import { CreateTicketPage } from '../pages/user/CreateTicketPage'
import { MyBookingsPage } from '../pages/user/MyBookingsPage'
import { MyTicketsPage } from '../pages/user/MyTicketsPage'
import { ResourceDetailsPage } from '../pages/user/ResourceDetailsPage'
import { ResourcesPage } from '../pages/user/ResourcesPage'
import { TicketDetailsPage } from '../pages/user/TicketDetailsPage'
import { AssignedTicketsPage } from '../pages/technician/AssignedTicketsPage'
import { ResolutionNotesPage } from '../pages/technician/ResolutionNotesPage'
import { TechnicianDashboardPage } from '../pages/technician/TechnicianDashboardPage'
import { UpdateTicketStatusPage } from '../pages/technician/UpdateTicketStatusPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'


function HomeRoute() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate replace to="/login" />
  }

  return <Navigate replace to={ROLE_HOME_PATHS[currentUser.role] || '/dashboard'} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route element={<RoleRoute allowedRoles={[ROLES.USER, ROLES.ADMIN]} />}>
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
            <Route path="/bookings/new" element={<CreateBookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
          </Route>

          <Route
            element={<RoleRoute allowedRoles={[ROLES.USER, ROLES.ADMIN, ROLES.TECHNICIAN]} />}
          >
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/resources" element={<ManageResourcesPage />} />
            <Route path="/admin/bookings/pending" element={<PendingBookingsPage />} />
            <Route path="/admin/bookings" element={<AllBookingsPage />} />
            <Route path="/admin/tickets" element={<ManageTicketsPage />} />
            <Route path="/admin/tickets/assign" element={<AssignTechnicianPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]} />}>
            <Route path="/technician" element={<TechnicianDashboardPage />} />
            <Route path="/technician/tickets" element={<AssignedTicketsPage />} />
            <Route path="/technician/tickets/:id" element={<ResolutionNotesPage />} />
            <Route
              path="/technician/tickets/:id/update"
              element={<UpdateTicketStatusPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
