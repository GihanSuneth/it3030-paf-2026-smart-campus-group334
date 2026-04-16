import { useState } from 'react'
import { resourceApi } from '../../api/resourceApi'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResourceCard } from '../../components/resources/ResourceCard'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'

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
  const [formState, setFormState] = useState(initialForm)
  const [message, setMessage] = useState('')

  if (query.loading) {
    return <LoadingState label="Loading resources..." />
  }

  if (query.error) {
    return <ErrorState message={query.error} />
  }

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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_24rem]">
        <div className="space-y-4">
          {query.data.map((resource) => (
            <div key={resource.id} className="space-y-3">
              <ResourceCard resource={resource} />
              <button className="btn-ghost" type="button" onClick={() => toggleStatus(resource)}>
                Toggle Status
              </button>
            </div>
          ))}
        </div>

        <form className="panel space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-slate-950">Add Resource</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
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
                <option>Lecture Hall</option>
                <option>Computer Lab</option>
                <option>Meeting Room</option>
                <option>Innovation Space</option>
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

          <button className="btn-primary w-full justify-center" type="submit">
            Save Resource
          </button>
        </form>
      </section>
    </PageContainer>
  )
}
