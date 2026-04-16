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

  const resourceMap = new Map(resourcesQuery.data.map((resource) => [resource.id, resource.name]))

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

      {bookingsQuery.data.length > 0 ? (
        <div className="space-y-4">
          {bookingsQuery.data.map((booking) => (
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
