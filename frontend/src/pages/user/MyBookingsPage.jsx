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
import { downloadBookingPdf } from '../../utils/bookingPdf'

import { StatCard } from '../../components/common/StatCard'

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
    await bookingsQuery.refetch()
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Reservations"
        title="My Bookings"
        description="Track the status of each request and cancel when needed."
      />

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard 
          label="Total Requests" 
          value={bookings.length} 
          hint="Every session you have scheduled."
        />
        <StatCard 
          label="Awaiting Review" 
          value={pendingCount} 
          hint="Pending admin approval."
        />
        <StatCard 
          label="Approved Slots" 
          value={approvedCount} 
          hint="Confirmed bookings ready for use."
        />
      </section>

      {bookings.length > 0 ? (
        <div className="flex flex-col gap-5">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-0.5">
              <BookingCard
                actions={
                  <>
                    <button
                      className="btn-ghost"
                      type="button"
                      onClick={() => downloadBookingPdf(booking, resourceMap.get(booking.resourceId) ?? 'Resource')}
                    >
                      Download PDF
                    </button>
                    {[BOOKING_STATUSES.PENDING, BOOKING_STATUSES.APPROVED].includes(booking.status) ? (
                      <button className="btn-secondary !text-rose-600 !border-rose-100 hover:!bg-rose-50" type="button" onClick={() => cancelBooking(booking.id)}>
                        Cancel Slot
                      </button>
                    ) : null}
                  </>
                }
                booking={booking}
                resourceName={resourceMap.get(booking.resourceId) ?? 'Resource'}
              />
            </div>
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
