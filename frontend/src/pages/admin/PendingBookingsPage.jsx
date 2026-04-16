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

export function PendingBookingsPage() {
  const { currentUser } = useAuth()
  const bookingsQuery = useMockQuery(() => bookingApi.getPendingBookings(), [])
  const resourcesQuery = useMockQuery(() => resourceApi.getResources(), [])

  if (bookingsQuery.loading || resourcesQuery.loading) {
    return <LoadingState label="Loading pending bookings..." />
  }

  if (bookingsQuery.error || resourcesQuery.error) {
    return <ErrorState message={bookingsQuery.error || resourcesQuery.error} />
  }

  const resourceMap = new Map(resourcesQuery.data.map((resource) => [resource.id, resource.name]))

  async function handleReview(bookingId, status) {
    const rejectionReason =
      status === BOOKING_STATUSES.REJECTED
        ? 'Requested slot conflicts with current operational priorities.'
        : ''

    await bookingApi.updateBookingStatus(
      bookingId,
      { status, rejectionReason },
      currentUser,
    )
    await bookingsQuery.refetch()
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Booking Review"
        title="Pending Bookings"
        description="Approve or reject incoming booking requests."
      />

      {bookingsQuery.data.length > 0 ? (
        <div className="space-y-4">
          {bookingsQuery.data.map((booking) => (
            <BookingCard
              key={booking.id}
              actions={
                <>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => handleReview(booking.id, BOOKING_STATUSES.APPROVED)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => handleReview(booking.id, BOOKING_STATUSES.REJECTED)}
                  >
                    Reject
                  </button>
                </>
              }
              booking={booking}
              resourceName={resourceMap.get(booking.resourceId) ?? 'Resource'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pending bookings"
          message="All booking requests are already reviewed."
        />
      )}
    </PageContainer>
  )
}
