import { Link } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResourceCard } from '../../components/resources/ResourceCard'
import { ResourceFilterBar } from '../../components/resources/ResourceFilterBar'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useState } from 'react'

import {
  RESOURCE_CATEGORIES,
  EQUIPMENT_TYPES,
  SPACE_TYPES,
  EQUIPMENT_RESOURCE_STATUSES,
  SPACE_RESOURCE_STATUSES,
  getResourceCategory,
} from '../../constants/resources'

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState(RESOURCE_CATEGORIES.EQUIPMENT)
  const [filters, setFilters] = useState({
    query: '',
    type: 'ALL',
    location: 'ALL',
    status: 'ALL',
  })

  const { data, loading, error } = useMockQuery(() => resourceApi.getResources(), [])

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
  const categoryResources = resources.filter(
    (resource) => getResourceCategory(resource.type, resource.category) === activeTab,
  )

  const filteredResources = categoryResources.filter((resource) => {
    const matchesQuery =
      !filters.query ||
      resource.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      resource.location.toLowerCase().includes(filters.query.toLowerCase()) ||
      (resource.code || '').toLowerCase().includes(filters.query.toLowerCase()) ||
      (resource.assetId || '').toLowerCase().includes(filters.query.toLowerCase())

    const matchesType = filters.type === 'ALL' || resource.type === filters.type
    const matchesLocation = filters.location === 'ALL' || resource.location === filters.location
    const matchesStatus = filters.status === 'ALL' || resource.status === filters.status

    return matchesQuery && matchesType && matchesLocation && matchesStatus
  })

  const locations = [...new Set(categoryResources.map((resource) => resource.location))].sort()

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

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => { setActiveTab(RESOURCE_CATEGORIES.EQUIPMENT); updateFilter('type', 'ALL') }}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Equipment
        </button>
        <button 
          onClick={() => { setActiveTab(RESOURCE_CATEGORIES.SPACES); updateFilter('type', 'ALL') }}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.SPACES ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Space Resources
        </button>
      </div>

      <ResourceFilterBar
        filters={filters}
        locations={locations}
        onChange={updateFilter}
        statuses={activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? EQUIPMENT_RESOURCE_STATUSES : SPACE_RESOURCE_STATUSES}
        types={activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? EQUIPMENT_TYPES : SPACE_TYPES}
      />

      {filteredResources.length > 0 ? (
        <section className="flex flex-col gap-4">
          {filteredResources.map((resource) => (
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
