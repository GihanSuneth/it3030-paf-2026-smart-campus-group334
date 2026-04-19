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

      <section className="page-grid">
        <BookingForm
          resources={activeResources}
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
        </aside>
      </section>
    </PageContainer>
  )
}
