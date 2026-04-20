import { Link } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function TechnicianDashboardPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(
    () => ticketApi.getAssignedTickets(currentUser.id),
    [currentUser.id],
  )

  if (loading) {
    return <LoadingState label="Loading technician dashboard..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const highPriority = data.filter((ticket) => ticket.priority === 'HIGH').length
  const inProgress = data.filter((ticket) => ticket.status === 'IN_PROGRESS').length
  const resolved = data.filter((ticket) => ticket.status === 'RESOLVED').length

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Technician Workspace"
        title="Technician Dashboard"
        description="Track assignments, repair progress, and current workload."
        actions={
          <Link className="btn-primary" to="/technician/tickets">
            Open Assigned Tickets
          </Link>
        }
      />
      

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned Tickets" value={data.length} />
        <StatCard label="High Priority" value={highPriority} />
        <StatCard label="In Progress" value={inProgress} />
        <StatCard label="Resolved" value={resolved} />
      </section>
    </PageContainer>
  )
}
