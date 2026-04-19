import { authApi } from '../../api/authApi'
import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TechnicianAssignmentPanel } from '../../components/technician/TechnicianAssignmentPanel'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function AssignTechnicianPage() {
  const { currentUser } = useAuth()
  const ticketsQuery = useMockQuery(() => ticketApi.getAllTickets(), [])
  const usersQuery = useMockQuery(() => authApi.getUsers(), [])

  if (ticketsQuery.loading || usersQuery.loading) {
    return <LoadingState label="Loading assignment panel..." />
  }

  if (ticketsQuery.error || usersQuery.error) {
    return <ErrorState message={ticketsQuery.error || usersQuery.error} />
  }

  const technicians = usersQuery.data.filter((user) => user.role === ROLES.TECHNICIAN)
  const assignableTickets = ticketsQuery.data.filter(
    (ticket) => ['OPEN', 'IN_PROGRESS'].includes(ticket.status),
  )

  async function handleAssign(ticketId, technicianId) {
    await ticketApi.assignTechnician(ticketId, technicianId, currentUser)
    await ticketsQuery.refetch()
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Assignments"
        title="Assign Technician"
        description="Match open tickets to technicians for follow-up work."
      />

      {assignableTickets.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {assignableTickets.map((ticket) => (
            <section key={ticket.id} className="space-y-4">
              <article className="panel space-y-3">
                <h2 className="text-lg font-semibold text-slate-950">{ticket.title}</h2>
                <p className="text-sm text-slate-500">
                  {ticket.resourceName} · {ticket.location}
                </p>
                <p className="text-sm text-slate-600">{ticket.description}</p>
              </article>
              <TechnicianAssignmentPanel
                onAssign={(technicianId) => handleAssign(ticket.id, technicianId)}
                technicians={technicians}
              />
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tickets need assignment"
          message="All current tickets already have technician ownership."
        />
      )}
    </PageContainer>
  )
  
}
