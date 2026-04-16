import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { BookingCard } from '../../components/bookings/BookingCard'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useState } from 'react'

export function AllBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const bookingsQuery = useMockQuery(() => bookingApi.getAllBookings(), [])
  const resourcesQuery = useMockQuery(() => resourceApi.getResources(), [])

  if (bookingsQuery.loading || resourcesQuery.loading) {
    return <LoadingState label="Loading bookings..." />
  }

  if (bookingsQuery.error || resourcesQuery.error) {
    return <ErrorState message={bookingsQuery.error || resourcesQuery.error} />
  }

  const resourceMap = new Map(resourcesQuery.data.map((resource) => [resource.id, resource.name]))
  const visibleBookings = bookingsQuery.data.filter(
    (booking) => statusFilter === 'ALL' || booking.status === statusFilter,
  )

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Bookings Overview"
        title="All Bookings"
        description="Filter booking records by current status."
        actions={
          <select
            className="input min-w-44"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        }
      />

      <div className="space-y-4">
        {visibleBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            resourceName={resourceMap.get(booking.resourceId) ?? 'Resource'}
          />
        ))}
      </div>
    </PageContainer>
  )
}
