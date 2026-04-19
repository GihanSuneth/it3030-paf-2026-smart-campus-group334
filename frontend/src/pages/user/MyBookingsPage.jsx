import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { BookingCard } from '../../components/bookings/BookingCard'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { BOOKING_STATUSES } from '../../constants/statuses'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function MyBookingsPage() {
  const { currentUser } = useAuth()
  const bookingsQuery = useMockQuery(() => bookingApi.getMyBookings(currentUser.id), [currentUser.id])
  const resourcesQuery = useMockQuery(() => resourceApi.getResources(), [])

  if (bookingsQuery.loading || resourcesQuery.loading) {
    return <LoadingState label="Loading your bookings..." />
  }

  if (bookingsQuery.error || resourcesQuery.error) {
    return <ErrorState message={bookingsQuery.error || resourcesQuery.error} />
  }

  const bookings = bookingsQuery.data
  const resourceMap = new Map(resourcesQuery.data.map((resource) => [resource.id, resource.name]))
  const pendingCount = bookings.filter((booking) => booking.status === BOOKING_STATUSES.PENDING).length
  const approvedCount = bookings.filter((booking) => booking.status === BOOKING_STATUSES.APPROVED).length

  async function cancelBooking(bookingId) {
    await bookingApi.updateBookingStatus(
      bookingId,
      { status: BOOKING_STATUSES.CANCELLED },
      currentUser,
    )
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Bookings"
        title="My Bookings"
        description="Track the status of each request and cancel when needed."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total Requests</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{bookings.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Every booking you have submitted is visible here.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Awaiting Review</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{pendingCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Pending requests can still be canceled before approval.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Approved</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{approvedCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Approved sessions are ready for planning and attendance.</p>
        </article>
      </section>

      {bookings.length > 0 ? (
        <div className="list-stack">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              actions={
                [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.APPROVED].includes(booking.status) ? (
                  <button className="btn-ghost" type="button" onClick={() => cancelBooking(booking.id)}>
                    Cancel Booking
                  </button>
                ) : null
              }
              booking={booking}
              resourceName={resourceMap.get(booking.resourceId) ?? 'Resource'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookings yet"
          message="Your booking requests will appear here once you submit them."
        />
      )}
    </PageContainer>
  )
}
