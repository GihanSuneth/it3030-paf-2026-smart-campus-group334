import { Link } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketCard } from '../../components/tickets/TicketCard'
import { useMockQuery } from '../../hooks/useMockQuery'

export function ManageTicketsPage() {
  const { data, loading, error } = useMockQuery(() => ticketApi.getAllTickets(), [])

  if (loading) {
    return <LoadingState label="Loading tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const openCount = data.filter((ticket) => ticket.status === 'OPEN').length
  const inProgressCount = data.filter((ticket) => ticket.status === 'IN_PROGRESS').length
  const unresolvedCount = data.filter((ticket) => ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED').length

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Ticket Operations"
        title="Manage Tickets"
        description="View all ticket records and open the detail screen for actions."
        actions={
          <Link className="btn-primary" to="/admin/tickets/assign">
            Assign Technicians
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total Tickets</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{data.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">A complete operations view for campus issue handling.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Needs Attention</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{unresolvedCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">These tickets still need triage, assignment, or resolution.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Open / In Progress</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{openCount} / {inProgressCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use this split to balance technician workload and response time.</p>
        </article>
      </section>

      <div className="list-stack">
        {data.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </PageContainer>
  )
}
