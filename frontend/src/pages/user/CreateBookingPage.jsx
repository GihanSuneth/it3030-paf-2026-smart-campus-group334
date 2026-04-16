import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { BookingForm } from '../../components/bookings/BookingForm'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function CreateBookingPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(() => resourceApi.getResources(), [])

  if (loading) {
    return <LoadingState label="Preparing booking form..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const activeResources = data.filter((resource) => resource.status === 'ACTIVE')

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Bookings"
        title="Create Booking Request"
        description="Choose a resource, add the booking purpose, and submit it for admin approval."
      />

      <BookingForm
        resources={activeResources}
        onSubmit={(payload) => bookingApi.createBooking(payload, currentUser)}
      />
    </PageContainer>
  )
}
