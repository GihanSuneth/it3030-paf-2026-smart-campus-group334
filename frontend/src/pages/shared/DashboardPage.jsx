import { Link } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { PageContainer } from '../../components/layout/PageContainer'
import { NotificationList } from '../../components/notifications/NotificationList'
import { ROLE_HOME_PATHS, ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useNotifications } from '../../hooks/useNotifications'

export function DashboardPage() {
  const { currentUser } = useAuth()
  const { recentNotifications, markAsRead } = useNotifications()
  const resourceQuery = useMockQuery(() => resourceApi.getResources(), [])
  const bookingsQuery = useMockQuery(
    () =>
      currentUser.role === ROLES.USER
        ? bookingApi.getMyBookings(currentUser.id)
        : bookingApi.getAllBookings(),
    [currentUser.id, currentUser.role],
  )
  const ticketsQuery = useMockQuery(
    () =>
      currentUser.role === ROLES.TECHNICIAN
        ? ticketApi.getAssignedTickets(currentUser.id)
        : currentUser.role === ROLES.USER
          ? ticketApi.getMyTickets(currentUser.id)
          : ticketApi.getAllTickets(),
    [currentUser.id, currentUser.role],
  )

  if (resourceQuery.loading || bookingsQuery.loading || ticketsQuery.loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  if (resourceQuery.error || bookingsQuery.error || ticketsQuery.error) {
    return (
      <ErrorState
        message={
          resourceQuery.error || bookingsQuery.error || ticketsQuery.error
        }
      />
    )
  }

  const quickActions =
    currentUser.role === ROLES.USER
      ? [
          { label: 'Browse Resources', path: '/resources' },
          { label: 'Create Booking', path: '/bookings/new' },
          { label: 'Create Ticket', path: '/tickets/new' },
        ]
      : currentUser.role === ROLES.ADMIN
        ? [
            { label: 'Admin Dashboard', path: '/admin' },
            { label: 'Pending Bookings', path: '/admin/bookings/pending' },
            { label: 'Manage Tickets', path: '/admin/tickets' },
          ]
        : [
            { label: 'Technician Dashboard', path: '/technician' },
            { label: 'Assigned Tickets', path: '/technician/tickets' },
            { label: 'Notifications', path: '/notifications' },
          ]

  const stats = [
    {
      label: 'Resources',
      value: resourceQuery.data.length,
      hint: 'Facilities available in the catalogue',
    },
    {
      label: currentUser.role === ROLES.USER ? 'My Bookings' : 'Bookings',
      value: bookingsQuery.data.length,
      hint: 'Booking requests being tracked',
    },
    {
      label: currentUser.role === ROLES.TECHNICIAN ? 'Assigned Tickets' : 'Tickets',
      value: ticketsQuery.data.length,
      hint: 'Ticket records currently visible to you',
    },
    {
      label: 'Workspace',
      value:
        currentUser.role === ROLES.USER
          ? 'User'
          : currentUser.role === ROLES.ADMIN
            ? 'Admin'
            : 'Tech',
      hint: 'Current role context',
    },
  ]

  
  return (
    <PageContainer>
      <section className="hero-panel space-y-5">
        <PageHeader
          eyebrow="Shared Dashboard"
          title="Campus Summary"
          description="A common entry point with role-specific quick actions, live counts, and a clearer overview of what needs attention."
          actions={quickActions.map((action) => (
            <Link key={action.path} className="btn-ghost" to={action.path}>
              {action.label}
            </Link>
          ))}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_24rem]">
          <div className="section-panel">
            <p className="text-lg font-semibold text-slate-950">Workspace Focus</p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              This dashboard keeps the most relevant campus information visible first, then lets each role move quickly into detailed tasks.
            </p>
          </div>
          <div className="section-panel">
            <p className="text-lg font-semibold text-slate-950">Current Role</p>
            <p className="mt-2 text-[2rem] font-semibold text-slate-950">
              {currentUser.role === ROLES.USER ? 'User' : currentUser.role === ROLES.ADMIN ? 'Admin' : 'Technician'}
            </p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Navigation and permissions adapt automatically for this workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} hint={stat.hint} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_25rem]">
        <article className="section-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Role Workflow</h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            Open your dedicated workspace for detailed operations and day-to-day management.
          </p>
          <Link className="btn-primary mt-5" to={ROLE_HOME_PATHS[currentUser.role]}>
            Open {currentUser.role === ROLES.USER ? 'User' : currentUser.role === ROLES.ADMIN ? 'Admin' : 'Technician'} Dashboard
          </Link>
        </article>

        <article className="section-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Recent Notifications</h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            Latest updates across bookings, tickets, and assignments.
          </p>
          <div className="mt-4">
            {recentNotifications.length > 0 ? (
              <NotificationList notifications={recentNotifications} onRead={markAsRead} compact />
            ) : (
              <EmptyState
                title="No notifications yet"
                message="Notifications will appear here when actions happen in the system."
              />
            )}
          </div>
        </article>
      </section>
    </PageContainer>
  )
}
