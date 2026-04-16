import { Navigate, Outlet } from 'react-router-dom'
import { ROLE_HOME_PATHS } from '../constants/roles'
import { useAuth } from '../hooks/useAuth'

export function RoleRoute({ allowedRoles }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate replace to="/login" />
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate replace to="/unauthorized" />
  }

  return <Outlet />
}
