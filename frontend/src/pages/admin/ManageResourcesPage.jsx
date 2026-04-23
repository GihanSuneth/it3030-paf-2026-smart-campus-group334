import { useState } from 'react'
import { resourceApi } from '../../api/resourceApi'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResourceCard } from '../../components/resources/ResourceCard'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'

import { RESOURCE_CATEGORIES, EQUIPMENT_TYPES, SPACE_TYPES } from '../../constants/resources'

const initialForm = {
  name: '',
  type: 'Lecture Hall',
  capacity: 25,
  location: '',
  availabilityStart: '08:00',
  availabilityEnd: '18:00',
  status: 'ACTIVE',
  description: '',
}

export function ManageResourcesPage() {
  const { currentUser } = useAuth()
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

  async function handleSubmit(event) {
    event.preventDefault()
    await resourceApi.createResource(
      { ...formState, capacity: Number(formState.capacity) },
      currentUser,
    )
    setFormState(initialForm)
    setMessage('Resource created successfully.')
    await query.refetch()
  }

  async function toggleStatus(resource) {
    await resourceApi.updateResource(
      resource.id,
      {
        status: resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE',
      },
      currentUser,
    )
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
          onClick={() => setActiveTab(RESOURCE_CATEGORIES.EQUIPMENT)}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Equipment
        </button>
        <button 
          onClick={() => setActiveTab(RESOURCE_CATEGORIES.SPACES)}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.SPACES ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Space Resources
        </button>
      </div>

      <section className="page-grid">
        <div className="list-stack">
          <div className="flex flex-col gap-4">
            {query.data
              .filter(r => (activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? EQUIPMENT_TYPES.includes(r.type) : SPACE_TYPES.includes(r.type)))
              .map((resource) => (
                <div key={resource.id} className="group relative">
                  <ResourceCard resource={resource} />
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="btn-secondary !py-2 !px-4 !rounded-xl text-xs" type="button" onClick={() => toggleStatus(resource)}>
                      {resource.status === 'ACTIVE' ? 'Set Offline' : 'Set Online'}
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
                  <optgroup label="Equipment">
                    {EQUIPMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </optgroup>
                  <optgroup label="Spaces">
                    {SPACE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </optgroup>
                </select>
              </label>
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
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Location</span>
                <input
                  className="input"
                  required
                  value={formState.location}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, location: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Start</span>
                <input
                  className="input"
                  type="time"
                  value={formState.availabilityStart}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      availabilityStart: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">End</span>
                <input
                  className="input"
                  type="time"
                  value={formState.availabilityEnd}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      availabilityEnd: event.target.value,
                    }))
                  }
                />
              </label>
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
