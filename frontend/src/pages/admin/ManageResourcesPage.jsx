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
  LOGISTIC_ROOM_LOCATION,
  EQUIPMENT_STOCK_TYPES,
  SPACE_RESOURCE_STATUSES,
  EQUIPMENT_RESOURCE_STATUSES,
  BUILDINGS,
  getResourceCategory,
} from '../../constants/resources'

const initialForm = {
  category: RESOURCE_CATEGORIES.EQUIPMENT,
  name: '',
  type: EQUIPMENT_TYPES[0],
  capacity: 0,
  building: 'Main Building',
  hallCode: '',
  location: '',
  status: 'WORKING',
  stockType: 'STANDARD',
  assignedTo: '',
  serviceOrder: 1,
  description: '',
  totalPcs: 0,
  workingPcs: 0,
  smartBoardCount: 0,
  workingSmartBoards: 0,
  projectorCount: 0,
  workingProjectors: 0,
  screenCount: 0,
  workingScreens: 0,
  soundSystemCount: 0,
  workingSoundSystems: 0,
}

function createFormState(category) {
  return {
    ...initialForm,
    category,
    type: category === RESOURCE_CATEGORIES.EQUIPMENT ? EQUIPMENT_TYPES[0] : SPACE_TYPES[0],
    status: category === RESOURCE_CATEGORIES.EQUIPMENT ? 'WORKING' : 'AVAILABLE',
  }
}

export function ManageResourcesPage() {
  const query = useMockQuery(() => resourceApi.getResources(), [])
  const [activeTab, setActiveTab] = useState(RESOURCE_CATEGORIES.EQUIPMENT)
  const [formState, setFormState] = useState(createFormState(RESOURCE_CATEGORIES.EQUIPMENT))
  const [message, setMessage] = useState('')

  if (query.loading) {
    return <LoadingState label="Loading resources..." />
  }

  if (query.error) {
    return <ErrorState message={query.error} />
  }

  const activeCount = query.data.filter(
    (resource) => resource.status === 'AVAILABLE' || resource.status === 'WORKING',
  ).length
  const outOfServiceCount = query.data.filter(
    (resource) => resource.status === 'OUT_OF_ORDER',
  ).length
  const categoryResources = query.data.filter(
    (resource) => getResourceCategory(resource.type, resource.category) === activeTab,
  )

  function buildLocation(state) {
    if (state.category === RESOURCE_CATEGORIES.EQUIPMENT && state.stockType === 'SPARE') {
      return LOGISTIC_ROOM_LOCATION
    }

    if (state.hallCode?.trim()) {
      return `${state.building} - ${state.hallCode.trim().toUpperCase()}`
    }

    return state.building
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      name: formState.name,
      type: formState.type,
      category: formState.category,
      location: buildLocation(formState),
      capacity: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.capacity) : 0,
      status: formState.status,
      stockType: formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? formState.stockType : null,
      assignedTo:
        formState.category === RESOURCE_CATEGORIES.EQUIPMENT
          ? formState.stockType === 'SPARE'
            ? 'Storage'
            : buildLocation(formState)
          : null,
      serviceOrder:
        formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? Number(formState.serviceOrder) : null,
      description: formState.description,
      totalPcs: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.totalPcs) : null,
      workingPcs: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.workingPcs) : null,
      smartBoardCount: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.smartBoardCount) : null,
      workingSmartBoards: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.workingSmartBoards) : null,
      projectorCount: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.projectorCount) : null,
      workingProjectors: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.workingProjectors) : null,
      screenCount: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.screenCount) : null,
      workingScreens: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.workingScreens) : null,
      soundSystemCount: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.soundSystemCount) : null,
      workingSoundSystems: formState.category === RESOURCE_CATEGORIES.SPACES ? Number(formState.workingSoundSystems) : null,
    }

    await resourceApi.createResource(payload)
    setFormState(createFormState(activeTab))
    setMessage('Resource created successfully.')
    await query.refetch()
  }

  async function setResourceStatus(resource, status) {
    await resourceApi.updateResource(resource.id, {
      status,
      available: status === 'AVAILABLE' || status === 'WORKING',
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ready To Use</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{activeCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Working equipment and available spaces are immediately ready for campus operations.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Out Of Service</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{outOfServiceCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Out-of-order resources are blocked clearly so users do not request unavailable assets or spaces.</p>
        </article>
      </section>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => {
            setActiveTab(RESOURCE_CATEGORIES.EQUIPMENT)
            setFormState(createFormState(RESOURCE_CATEGORIES.EQUIPMENT))
          }}
          className={`px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all ${activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Equipment
        </button>
        <button 
          onClick={() => {
            setActiveTab(RESOURCE_CATEGORIES.SPACES)
            setFormState(createFormState(RESOURCE_CATEGORIES.SPACES))
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
                  <div className="absolute top-6 right-6 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {activeTab === RESOURCE_CATEGORIES.EQUIPMENT ? (
                      <>
                        <button className="btn-secondary !py-2 !px-4 !rounded-xl text-xs" type="button" onClick={() => setResourceStatus(resource, 'WORKING')}>
                          Set Working
                        </button>
                        <button className="btn-secondary !py-2 !px-4 !rounded-xl text-xs" type="button" onClick={() => setResourceStatus(resource, 'OUT_OF_ORDER')}>
                          Set Out Of Order
                        </button>
                      </>
                    ) : (
                      <button className="btn-secondary !py-2 !px-4 !rounded-xl text-xs" type="button" onClick={() => setResourceStatus(resource, resource.status === 'AVAILABLE' ? 'OUT_OF_ORDER' : 'AVAILABLE')}>
                        {resource.status === 'AVAILABLE' ? 'Set Out Of Order' : 'Set Available'}
                      </button>
                    )}
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
                Keep room readiness, equipment counts, and status accurate so booking and support flows stay dependable.
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
                  {(formState.category === RESOURCE_CATEGORIES.EQUIPMENT ? EQUIPMENT_RESOURCE_STATUSES : SPACE_RESOURCE_STATUSES).map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Building</span>
                <select
                  className="input"
                  value={
                    formState.category === RESOURCE_CATEGORIES.EQUIPMENT &&
                    formState.stockType === 'SPARE'
                      ? LOGISTIC_ROOM_LOCATION
                      : formState.building
                  }
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, building: event.target.value }))
                  }
                  disabled={
                    formState.category === RESOURCE_CATEGORIES.EQUIPMENT &&
                    formState.stockType === 'SPARE'
                  }
                >
                  {(formState.category === RESOURCE_CATEGORIES.EQUIPMENT &&
                  formState.stockType === 'SPARE'
                    ? [LOGISTIC_ROOM_LOCATION]
                    : BUILDINGS
                  ).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Hall / Room</span>
                <input
                  className="input"
                  placeholder="A605"
                  value={
                    formState.category === RESOURCE_CATEGORIES.EQUIPMENT &&
                    formState.stockType === 'SPARE'
                      ? 'Storage'
                      : formState.hallCode
                  }
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, hallCode: event.target.value }))
                  }
                  disabled={
                    formState.category === RESOURCE_CATEGORIES.EQUIPMENT &&
                    formState.stockType === 'SPARE'
                  }
                />
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
              {formState.category === RESOURCE_CATEGORIES.SPACES && formState.type === 'PC Lab' ? (
                <>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Total PCs</span>
                    <input
                      className="input"
                      min="0"
                      type="number"
                      value={formState.totalPcs}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, totalPcs: event.target.value }))
                      }
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Working PCs</span>
                    <input
                      className="input"
                      min="0"
                      type="number"
                      value={formState.workingPcs}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, workingPcs: event.target.value }))
                      }
                    />
                  </label>
                </>
              ) : null}
              {formState.category === RESOURCE_CATEGORIES.SPACES ? (
                <>
                  {formState.type === 'PC Lab' ? (
                    <>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Smart Boards</span>
                        <input
                          className="input"
                          min="0"
                          type="number"
                          value={formState.smartBoardCount}
                          onChange={(event) =>
                            setFormState((current) => ({ ...current, smartBoardCount: event.target.value }))
                          }
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Working Smart Boards</span>
                        <input
                          className="input"
                          min="0"
                          type="number"
                          value={formState.workingSmartBoards}
                          onChange={(event) =>
                            setFormState((current) => ({ ...current, workingSmartBoards: event.target.value }))
                          }
                        />
                      </label>
                    </>
                  ) : null}
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Projectors</span>
                    <input
                      className="input"
                      min="0"
                      type="number"
                      value={formState.projectorCount}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, projectorCount: event.target.value }))
                      }
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Working Projectors</span>
                    <input
                      className="input"
                      min="0"
                      type="number"
                      value={formState.workingProjectors}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, workingProjectors: event.target.value }))
                      }
                    />
                  </label>
                  {formState.type === 'Lecture Hall' ? (
                    <>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Screens</span>
                        <input
                          className="input"
                          min="0"
                          type="number"
                          value={formState.screenCount}
                          onChange={(event) =>
                            setFormState((current) => ({ ...current, screenCount: event.target.value }))
                          }
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Working Screens</span>
                        <input
                          className="input"
                          min="0"
                          type="number"
                          value={formState.workingScreens}
                          onChange={(event) =>
                            setFormState((current) => ({ ...current, workingScreens: event.target.value }))
                          }
                        />
                      </label>
                    </>
                  ) : null}
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Sound Systems</span>
                    <input
                      className="input"
                      min="0"
                      type="number"
                      value={formState.soundSystemCount}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, soundSystemCount: event.target.value }))
                      }
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Working Sound Systems</span>
                    <input
                      className="input"
                      min="0"
                      type="number"
                      value={formState.workingSoundSystems}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, workingSoundSystems: event.target.value }))
                      }
                    />
                  </label>
                </>
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
                        building: 'Main Building',
                        hallCode: '',
                        location: '',
                        assignedTo:
                          event.target.value === 'SPARE' ? 'Storage' : 'Main Building',
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
                  <input
                    className="input"
                    value={formState.stockType === 'SPARE' ? 'Storage' : buildLocation(formState)}
                    disabled
                  />
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
                Asset IDs are generated automatically by the portal when the resource is saved. Spare equipment is only tracked under Equipment and is always stored in {LOGISTIC_ROOM_LOCATION}.
              </p>
            ) : null}
            {formState.category === RESOURCE_CATEGORIES.SPACES || formState.stockType !== 'SPARE' ? (
              <p className="text-xs text-slate-500">
                Final location: <span className="font-semibold">{buildLocation(formState)}</span>
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
