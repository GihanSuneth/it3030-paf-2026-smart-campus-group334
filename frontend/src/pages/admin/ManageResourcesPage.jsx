import { useState } from 'react'
import { resourceApi } from '../../api/resourceApi'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResourceCard } from '../../components/resources/ResourceCard'
import { useMockQuery } from '../../hooks/useMockQuery'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'

import {
  RESOURCE_CATEGORIES,
  EQUIPMENT_TYPES,
  SPACE_TYPES,
  SPACE_LOCATIONS,
  LOGISTIC_ROOM_LOCATION,
  RESOURCE_STATUSES,
  EQUIPMENT_STOCK_TYPES,
  getResourceCategory,
} from '../../constants/resources'

const initialForm = {
  category: RESOURCE_CATEGORIES.EQUIPMENT,
  name: '',
  type: EQUIPMENT_TYPES[0],
  capacity: 25,
  location: SPACE_LOCATIONS[0],
  status: 'ACTIVE',
  stockType: 'STANDARD',
  assignedTo: SPACE_LOCATIONS[0],
  serviceOrder: 1,
  description: '',
}

export function ManageResourcesPage() {
  const query = useMockQuery(() => resourceApi.getResources(), [])
  const [activeTab, setActiveTab] = useState(RESOURCE_CATEGORIES.EQUIPMENT)
  const [formState, setFormState] = useState(initialForm)
  const [message, setMessage] = useState('')

  if (query.loading) {
    return <LoadingState label="Loading resources..." />
  }

  if (query.error) {
    return <ErrorState message={query.error} />
  }

  const activeCount = query.data.filter((resource) => resource.status === 'ACTIVE').length
  const outOfServiceCount = query.data.filter((resource) => resource.status === 'OUT_OF_SERVICE').length
  const categoryResources = query.data.filter(
    (resource) => getResourceCategory(resource.type, resource.category) === activeTab,
  )

  const locationOptions =
    formState.category === RESOURCE_CATEGORIES.EQUIPMENT && formState.stockType === 'SPARE'
      ? [LOGISTIC_ROOM_LOCATION]
      : SPACE_LOCATIONS

  async function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      name: formState.name,
      type: formState.type,
      category: formState.category,
      location:
        formState.category === RESOURCE_CATEGORIES.EQUIPMENT && formState.stockType === 'SPARE'
          ? LOGISTIC_ROOM_LOCATION
          : formState.location,
      capacity: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.capacity) : 0,
      status: formState.status,
      stockType: formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? formState.stockType : null,
      assignedTo:
        formState.category === RESOURCE_CATEGORIES.EQUIPMENT
          ? formState.stockType === 'SPARE'
            ? 'Storage'
            : formState.assignedTo
          : null,
      serviceOrder:
        formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? Number(formState.serviceOrder) : null,
      description: formState.description,
    }

    await resourceApi.createResource(payload)
    setFormState(initialForm)
    setMessage('Resource created successfully.')
    await query.refetch()
  }

  async function toggleStatus(resource) {
    await resourceApi.updateResource(resource.id, {
      status: resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE',
      available: resource.status !== 'ACTIVE',
    })
    await query.refetch()
  }

  async function removeResource(resourceId) {
    await resourceApi.deleteResource(resourceId)
    await query.refetch()
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Facilities & Assets"
        title="Manage Resources"
        description="Create and maintain the facilities and assets catalogue."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Catalogue Size</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{query.data.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Every teachable and reservable space should stay up to date.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{activeCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Active resources are immediately available for booking or support.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Out Of Service</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{outOfServiceCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Unavailable spaces should be clearly marked to avoid failed requests.</p>
        </article>
      </section>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => {
            setActiveTab(RESOURCE_CATEGORIES.EQUIPMENT)
            setFormState((current) => ({
              ...current,
              category: RESOURCE_CATEGORIES.EQUIPMENT,
              type: EQUIPMENT_TYPES[0],
              location: SPACE_LOCATIONS[0],
              assignedTo: SPACE_LOCATIONS[0],
            }))
          }}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Equipment
        </button>
        <button 
          onClick={() => {
            setActiveTab(RESOURCE_CATEGORIES.SPACES)
            setFormState((current) => ({
              ...current,
              category: RESOURCE_CATEGORIES.SPACES,
              type: SPACE_TYPES[0],
              location: SPACE_LOCATIONS[0],
              stockType: 'STANDARD',
              assignedTo: null,
            }))
          }}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.SPACES ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Space Resources
        </button>
      </div>

      <section className="page-grid">
        <div className="list-stack">
          <div className="flex flex-col gap-4">
            {categoryResources.map((resource) => (
                <div key={resource.id} className="group relative">
                  <ResourceCard resource={resource} />
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="btn-secondary !py-2 !px-4 !rounded-xl text-xs" type="button" onClick={() => toggleStatus(resource)}>
                      {resource.status === 'ACTIVE' ? 'Set Offline' : 'Set Online'}
                    </button>
                    <button className="btn-secondary !py-2 !px-4 !rounded-xl text-xs !text-rose-600 !border-rose-200" type="button" onClick={() => removeResource(resource.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <form className="form-shell" onSubmit={handleSubmit}>
          <div className="form-content">
            <div>
              <span className="subtle-pill">Create Resource</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Add a new space or asset</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep names, timings, and capacity accurate so booking and support flows stay dependable.
              </p>
            </div>

            <div className="field-group grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input
                  className="input"
                  required
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Type</span>
                <select
                  className="input"
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, type: event.target.value }))
                  }
                >
                  {(formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? EQUIPMENT_TYPES : SPACE_TYPES).map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <select
                  className="input"
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  {RESOURCE_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Location</span>
                <select
                  className="input"
                  value={formState.location}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, location: event.target.value }))
                  }
                  disabled={
                    formState.category === RESOURCE_CATEGORIES.EQUIPMENT &&
                    formState.stockType === 'SPARE'
                  }
                >
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </label>
              {formState.category === RESOURCE_CATEGORIES.SPACES ? (
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Capacity</span>
                  <input
                    className="input"
                    min="1"
                    required
                    type="number"
                    value={formState.capacity}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, capacity: event.target.value }))
                    }
                  />
                </label>
              ) : null}
              {formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? (
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Inventory Type</span>
                  <select
                    className="input"
                    value={formState.stockType}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        stockType: event.target.value,
                        location:
                          event.target.value === 'SPARE' ? LOGISTIC_ROOM_LOCATION : SPACE_LOCATIONS[0],
                        assignedTo:
                          event.target.value === 'SPARE' ? 'Storage' : SPACE_LOCATIONS[0],
                      }))
                    }
                  >
                    {EQUIPMENT_STOCK_TYPES.map((stockType) => (
                      <option key={stockType}>{stockType}</option>
                    ))}
                  </select>
                </label>
              ) : null}
              {formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? (
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Assigned To</span>
                  <select
                    className="input"
                    value={formState.stockType === 'SPARE' ? 'Storage' : formState.assignedTo}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, assignedTo: event.target.value }))
                    }
                    disabled={formState.stockType === 'SPARE'}
                  >
                    {formState.stockType === 'SPARE' ? (
                      <option>Storage</option>
                    ) : (
                      SPACE_LOCATIONS.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))
                    )}
                  </select>
                </label>
              ) : null}
              {formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? (
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Service Order</span>
                  <input
                    className="input"
                    min="1"
                    required
                    type="number"
                    value={formState.serviceOrder}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, serviceOrder: event.target.value }))
                    }
                  />
                </label>
              ) : null}
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  className="textarea"
                  rows="4"
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            {formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? (
              <p className="text-xs text-slate-500">
                Asset IDs are generated automatically by the portal when the resource is saved.
                Spare equipment is always stored in {LOGISTIC_ROOM_LOCATION}.
              </p>
            ) : null}

            <div className="flex justify-end">
              <button className="btn-primary min-w-44 justify-center" type="submit">
                Save Resource
              </button>
            </div>
          </div>
        </form>
      </section>
    </PageContainer>
  )
}
