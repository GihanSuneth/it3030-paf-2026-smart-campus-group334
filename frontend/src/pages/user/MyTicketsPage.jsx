import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketCard } from '../../components/tickets/TicketCard'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function MyTicketsPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(() => ticketApi.getMyTickets(currentUser.id), [
    currentUser.id,
  ])

  if (loading) {
    return <LoadingState label="Loading your tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const openCount = data.filter((ticket) => ticket.status === 'OPEN').length
  const inProgressCount = data.filter((ticket) => ticket.status === 'IN_PROGRESS').length

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Support"
        title="My Tickets"
        description="Follow the current status of every issue you reported."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reported Issues</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{data.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Your submissions stay visible until resolved or closed.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Open</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{openCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Open tickets are waiting for assignment or first review.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">In Progress</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{inProgressCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">These issues are already being worked on by support staff.</p>
        </article>
      </section>

      {data.length > 0 ? (
        <div className="list-stack">
          {data.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tickets yet"
          message="Reported issues will appear here after submission."
        />
      )}
    </PageContainer>
  )
}
