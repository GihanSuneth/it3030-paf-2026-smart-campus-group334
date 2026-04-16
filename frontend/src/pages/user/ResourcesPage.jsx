import { Link } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResourceCard } from '../../components/resources/ResourceCard'
import { ResourceFilterBar } from '../../components/resources/ResourceFilterBar'
import { RESOURCE_STATUSES } from '../../constants/statuses'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useState } from 'react'

export function ResourcesPage() {
  const [filters, setFilters] = useState({
    query: '',
    type: 'ALL',
    location: 'ALL',
    status: 'ALL',
  })

  const { data, loading, error } = useMockQuery(() => resourceApi.getResources(filters), [
    filters.query,
    filters.type,
    filters.location,
    filters.status,
  ])

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  if (loading) {
    return <LoadingState label="Loading resources..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const resources = data ?? []
  const types = [...new Set(resources.map((resource) => resource.type))]
  const locations = [...new Set(resources.map((resource) => resource.location))]

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Facilities Catalogue"
        title="Resources"
        description="Search rooms, labs, and facilities before making a booking request."
        actions={
          <Link className="btn-primary" to="/bookings/new">
            Create Booking
          </Link>
        }
      />

      <ResourceFilterBar
        filters={filters}
        locations={locations}
        onChange={updateFilter}
        statuses={Object.values(RESOURCE_STATUSES)}
        types={types}
      />

      {resources.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No resources found"
          message="Try updating the search and filter settings."
        />
      )}
    </PageContainer>
  )
}
