import { Link, useParams } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useMockQuery } from '../../hooks/useMockQuery'

export function ResourceDetailsPage() {
  const { id } = useParams()
  const { data, loading, error } = useMockQuery(() => resourceApi.getResourceById(id), [id])

  if (loading) {
    return <LoadingState label="Loading resource details..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const resource = data

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Resource Details"
        title={resource.name}
        description="Use the details below to confirm the resource matches your booking needs."
        actions={
          <Link className="btn-primary" to="/bookings/new">
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
              <p className="text-sm font-semibold text-slate-700">Capacity</p>
              <p className="mt-1 text-sm text-slate-500">{resource.capacity}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Status</p>
              <p className="mt-1 text-sm text-slate-500">{resource.status}</p>
            </div>
          </div>
        </article>

        <article className="panel space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Availability</h2>
          <p className="text-sm text-slate-500">
            Daily access window: {resource.availabilityStart} - {resource.availabilityEnd}
          </p>
          <Link className="btn-ghost w-full justify-center" to="/resources">
            Back to Resources
          </Link>
        </article>
      </section>
    </PageContainer>
  )
}
