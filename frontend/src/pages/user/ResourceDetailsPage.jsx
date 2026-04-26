import { Link, useParams } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useMockQuery } from '../../hooks/useMockQuery'
import { getResourceCategory, RESOURCE_CATEGORIES } from '../../constants/resources'

export function ResourceDetailsPage() {
  const { id } = useParams()
  const today = new Date().toISOString().split('T')[0]
  const { data, loading, error } = useMockQuery(() => resourceApi.getResourceById(id), [id])
  const occupiedSlotsQuery = useMockQuery(() => bookingApi.getResourceOccupiedSlots(id, today), [id, today])

  if (loading) {
    return <LoadingState label="Loading resource details..." />
  }

  if (error || occupiedSlotsQuery.error) {
    return <ErrorState message={error || occupiedSlotsQuery.error} />
  }

  const resource = data
  const isEquipment = getResourceCategory(resource.type, resource.category) === RESOURCE_CATEGORIES.EQUIPMENT

  const detailRows = isEquipment
    ? [
        ['Asset ID', resource.assetId || 'Generated on save'],
        ['Inventory Type', resource.stockType || 'STANDARD'],
        ['Assigned To', resource.assignedTo || resource.location],
        ['Service Order', resource.serviceOrder || 'Not set'],
      ]
    : resource.type === 'PC Lab'
      ? [
          ['Capacity', resource.capacity],
          ['Total PCs', resource.totalPcs ?? 0],
          ['Working PCs', resource.workingPcs ?? 0],
          ['Smart Boards', `${resource.workingSmartBoards ?? 0}/${resource.smartBoardCount ?? 0} working`],
          ['Projectors', `${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0} working`],
          ['Sound Systems', `${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0} working`],
        ]
      : resource.type === 'Lecture Hall'
        ? [
            ['Seats', resource.capacity],
            ['Projectors', `${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0} working`],
            ['Screens', `${resource.workingScreens ?? 0}/${resource.screenCount ?? 0} working`],
            ['Sound Systems', `${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0} working`],
          ]
        : [
            ['Capacity', resource.capacity],
            ['Projectors', `${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0} working`],
            ['Sound Systems', `${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0} working`],
          ]

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Resource Details"
        title={resource.name}
        description="Use the details below to confirm the resource matches your booking needs."
        actions={
          <Link
            className="btn-primary"
            to={`/bookings/new?resourceId=${resource.id}&bookingType=${resource.category}`}
          >
            Book Resource
          </Link>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_22rem]">
        <article className="panel space-y-4">
          <p className="text-base text-slate-600">{resource.description}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Type</p>
              <p className="mt-1 text-sm text-slate-500">{resource.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Location</p>
              <p className="mt-1 text-sm text-slate-500">{resource.location}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Status</p>
              <p className="mt-1 text-sm text-slate-500">{resource.status}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Code</p>
              <p className="mt-1 text-sm text-slate-500">{resource.code}</p>
            </div>
            {detailRows.map(([label, value]) => (
              <div key={label}>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Availability</h2>
          <p className="text-sm text-slate-500">
            {resource.available ? 'This resource is currently available for booking or use.' : 'This resource is currently unavailable.'}
          </p>
          <p className="text-sm text-slate-500">
            Resource code: {resource.code}
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Occupied time windows today</p>
            {occupiedSlotsQuery.loading ? (
              <p className="mt-2 text-sm text-slate-500">Loading occupied slots...</p>
            ) : occupiedSlotsQuery.data?.length ? (
              <div className="mt-3 space-y-2">
                {occupiedSlotsQuery.data.map((slot) => (
                  <div key={slot.bookingId} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {slot.bookingCode || slot.bookingId} • {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-xs text-slate-500">{slot.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No occupied windows for today.</p>
            )}
          </div>
          <Link className="btn-ghost w-full justify-center" to="/resources">
            Back to Resources
          </Link>
        </article>
      </section>
    </PageContainer>
  )
}
