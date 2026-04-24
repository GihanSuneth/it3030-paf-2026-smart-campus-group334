import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { BookingForm } from '../../components/bookings/BookingForm'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { RESOURCE_CATEGORIES } from '../../constants/resources'

export function CreateBookingPage() {
  const { currentUser } = useAuth()
  const [searchParams] = useSearchParams()
  const { data, loading, error } = useMockQuery(() => resourceApi.getResources(), [])
  const resources = data ?? []
  const activeResources = resources.filter(
    (resource) =>
      resource.status === 'AVAILABLE' ||
      resource.status === 'WORKING' ||
      resource.status === 'ACTIVE',
  )
  const initialResourceId = searchParams.get('resourceId') || ''
  const initialBookingType = useMemo(() => {
    const requestedType = searchParams.get('bookingType')
    if (requestedType === RESOURCE_CATEGORIES.EQUIPMENT || requestedType === RESOURCE_CATEGORIES.SPACES) {
      return requestedType
    }

    const preselectedResource = activeResources.find((resource) => resource.id === initialResourceId)
    return preselectedResource?.category || RESOURCE_CATEGORIES.SPACES
  }, [activeResources, initialResourceId, searchParams])
  const selectedResource = activeResources.find((resource) => resource.id === initialResourceId) || null

  if (loading) {
    return <LoadingState label="Preparing booking form..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Bookings"
        title="Create Booking Request"
        description="Choose a resource, add the booking purpose, and submit it for admin approval."
      />

      <section className="page-grid">
        <BookingForm
          resources={activeResources}
          initialResourceId={initialResourceId}
          initialBookingType={initialBookingType}
          onCheckAvailability={(payload) => bookingApi.checkAvailability(payload, currentUser)}
          onSubmit={(payload) => bookingApi.createBooking(payload, currentUser)}
        />
        <aside className="space-y-4">
          <article className="info-band">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Available Resources</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{activeResources.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Only active resources are shown for a smoother booking experience.</p>
          </article>
          <article className="section-panel">
            <h2 className="section-title">Before you submit</h2>
            <p className="mt-2 section-copy">
              Double-check timing conflicts, expected attendance, and the academic purpose so approvals can happen faster.
            </p>
          </article>
          {selectedResource ? (
            <article className="section-panel">
              <h2 className="section-title">Selected Resource</h2>
              <p className="mt-2 text-sm font-semibold text-slate-900">{selectedResource.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {selectedResource.code} • {selectedResource.location}
              </p>
              <p className="mt-2 section-copy">
                The booking form is prefilled for this resource. Choose the date and time, check availability, and submit for admin review.
              </p>
            </article>
          ) : null}
        </aside>
      </section>
    </PageContainer>
  )
}
