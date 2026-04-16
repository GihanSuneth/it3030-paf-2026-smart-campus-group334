import { Link } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { ticketApi } from '../../api/ticketApi'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { PageContainer } from '../../components/layout/PageContainer'
import { useMockQuery } from '../../hooks/useMockQuery'

export function AdminDashboardPage() {
  const resourcesQuery = useMockQuery(() => resourceApi.getResources(), [])
  const bookingsQuery = useMockQuery(() => bookingApi.getAllBookings(), [])
  const ticketsQuery = useMockQuery(() => ticketApi.getAllTickets(), [])

  if (resourcesQuery.loading || bookingsQuery.loading || ticketsQuery.loading) {
    return <LoadingState label="Loading admin dashboard..." />
  }

  if (resourcesQuery.error || bookingsQuery.error || ticketsQuery.error) {
    return <ErrorState message={resourcesQuery.error || bookingsQuery.error || ticketsQuery.error} />
  }

  const pendingBookings = bookingsQuery.data.filter((item) => item.status === 'PENDING').length
  const openTickets = ticketsQuery.data.filter((item) => item.status === 'OPEN').length
  const inProgressTickets = ticketsQuery.data.filter((item) => item.status === 'IN_PROGRESS').length
  const outOfServiceResources = resourcesQuery.data.filter(
    (item) => item.status === 'OUT_OF_SERVICE',
  ).length
  const assignedTickets = ticketsQuery.data.filter((item) => item.assignedTechnicianId).length

  return (
    <PageContainer>
      <section className="hero-panel space-y-5">
        <PageHeader
          eyebrow="Admin Workspace"
          title="Admin Dashboard"
          description="Monitor the campus system, guide approvals, and keep operations moving with a polished management view."
          actions={
            <>
              <Link className="btn-primary" to="/admin/resources">
                Manage Resources
              </Link>
              <Link className="btn-ghost" to="/admin/bookings/pending">
                Review Bookings
              </Link>
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="section-panel">
            <p className="text-lg font-semibold text-slate-950">Operations Health</p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Track booking flow, technician coverage, and resource availability from one admin control surface.
            </p>
          </div>
          <div className="section-panel">
            <p className="text-lg font-semibold text-slate-950">Active Assignments</p>
            <p className="mt-2 text-[2rem] font-semibold text-slate-950">{assignedTickets}</p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Tickets currently assigned to technicians.
            </p>
          </div>
          <div className="section-panel">
            <p className="text-lg font-semibold text-slate-950">Booking Queue</p>
            <p className="mt-2 text-[2rem] font-semibold text-slate-950">{pendingBookings}</p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Requests waiting for admin approval.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Resources" value={resourcesQuery.data.length} />
        <StatCard label="Pending Bookings" value={pendingBookings} />
        <StatCard label="Open Tickets" value={openTickets} />
        <StatCard label="In Progress" value={inProgressTickets} />
        <StatCard label="Out Of Service" value={outOfServiceResources} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <article className="section-panel space-y-4">
          <h2 className="text-2xl font-semibold text-slate-950">Operational Priorities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="soft-grid-card">
              <p className="text-base font-semibold text-slate-700">Assignment Overview</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{assignedTickets}</p>
              <p className="mt-2 text-base leading-7 text-slate-600">Tickets with technician ownership</p>
            </div>
            <div className="soft-grid-card">
              <p className="text-base font-semibold text-slate-700">Booking Queue</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{pendingBookings}</p>
              <p className="mt-2 text-base leading-7 text-slate-600">Requests waiting for admin review</p>
            </div>
          </div>
        </article>

        <article className="section-panel space-y-3">
          <h2 className="text-2xl font-semibold text-slate-950">Quick Links</h2>
          <Link className="btn-ghost w-full justify-center" to="/admin/tickets">
            Open Ticket Operations
          </Link>
          <Link className="btn-ghost w-full justify-center" to="/admin/tickets/assign">
            Assign Technicians
          </Link>
          <Link className="btn-ghost w-full justify-center" to="/admin/users">
            View Users
          </Link>
        </article>
      </section>
    </PageContainer>
  )
}
