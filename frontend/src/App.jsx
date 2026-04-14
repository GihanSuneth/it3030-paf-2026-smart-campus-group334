import { useMemo, useState } from 'react'
import './App.css'

const resources = [
  {
    id: 'LH-101',
    name: 'Apex Lecture Hall',
    trackingGroup: 'Spaces and Halls',
    category: 'Lecture Hall',
    type: 'Lecture Hall',
    capacity: 220,
    location: 'Academic Block A',
    level: 'Level 1',
    status: 'ACTIVE',
    availability: 'Mon-Fri | 08:00 - 18:00',
    manager: 'Facilities Office',
    description:
      'Tiered lecture hall with dual displays, capture system, and wheelchair access.',
    features: ['Dual projector', 'Lecture capture', 'Accessible seating'],
  },
  {
    id: 'LAB-204',
    name: 'Nova Computing Lab',
    trackingGroup: 'Spaces and Halls',
    category: 'PC Lab',
    type: 'PC Lab',
    capacity: 48,
    location: 'Innovation Wing',
    level: 'Level 2',
    status: 'OCCUPIED',
    availability: 'Daily | 07:30 - 20:00',
    manager: 'School of Computing',
    description:
      'Computer lab provisioned for software engineering sessions and supervised practicals.',
    features: ['48 workstations', 'Smart podium', 'Air conditioned'],
  },
  {
    id: 'AUD-310',
    name: 'Orbit Auditorium',
    trackingGroup: 'Spaces and Halls',
    category: 'Auditorium',
    type: 'Auditorium',
    capacity: 180,
    location: 'Admin Tower',
    level: 'Level 3',
    status: 'ACTIVE',
    availability: 'Mon-Sat | 09:00 - 17:00',
    manager: 'Operations Team',
    description:
      'Large presentation venue for seminars, guest lectures, and faculty events.',
    features: ['Stage lighting', 'Main screen', 'Control booth'],
  },
  {
    id: 'EQ-PR-12',
    name: 'Portable Projector Set',
    trackingGroup: 'Physical Resources',
    category: 'Equipment',
    type: 'Projector',
    capacity: 1,
    location: 'Media Store',
    level: 'Ground Floor',
    status: 'OUT_OF_ORDER',
    availability: 'Weekdays | 08:30 - 16:30',
    manager: 'AV Support',
    description:
      'Loanable high-lumen projector kit with HDMI adapters and transport case.',
    features: ['4K ready', 'HDMI kit', 'Transport case'],
  },
  {
    id: 'EQ-CM-08',
    name: 'Field Camera Kit',
    trackingGroup: 'Physical Resources',
    category: 'Equipment',
    type: 'Audio Device',
    capacity: 1,
    location: 'Media Store',
    level: 'Ground Floor',
    status: 'ACTIVE',
    availability: 'Daily | 10:00 - 19:00',
    manager: 'Media Lab',
    description:
      'Portable audio device set for events, presentations, and temporary lecture setups.',
    features: ['Mixer included', 'Wireless mic', 'Carry bag'],
  },
  {
    id: 'EQ-SS-21',
    name: 'Smart Screen Cluster',
    trackingGroup: 'Physical Resources',
    category: 'Equipment',
    type: 'Smart Screen',
    capacity: 6,
    location: 'Engineering Complex',
    level: 'Level 1',
    status: 'OCCUPIED',
    availability: 'Mon-Fri | 09:00 - 17:00',
    manager: 'Engineering Faculty',
    description:
      'Shared smart screens currently assigned to active teaching spaces in the engineering block.',
    features: ['Touch enabled', 'Wall mounted', 'HDMI sharing'],
  },
]

const pages = [
  { id: 'overview', label: 'Overview' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'manage', label: 'Manage Resources' },
]

const emptyDraft = {
  name: '',
  category: 'Lecture Hall',
  type: 'Lecture Hall',
  capacity: '',
  location: '',
  level: '',
  status: 'ACTIVE',
  availability: '',
}

const emptyPhysicalDraft = {
  assetName: '',
  assetType: 'Projector',
  quantity: '',
  assignedLocation: '',
  assetStatus: 'ACTIVE',
  serialTag: '',
  supportWindow: '',
}

function App() {
  const [activePage, setActivePage] = useState('overview')
  const [selectedId, setSelectedId] = useState(resources[0].id)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [capacityFilter, setCapacityFilter] = useState('All')
  const [draft, setDraft] = useState(emptyDraft)
  const [managementTab, setManagementTab] = useState('spaces')
  const [physicalDraft, setPhysicalDraft] = useState(emptyPhysicalDraft)
  const [catalogueTab, setCatalogueTab] = useState('all')

  const selectedResource =
    resources.find((resource) => resource.id === selectedId) ?? resources[0]

  const locations = useMemo(
    () => ['All', ...new Set(resources.map((resource) => resource.location))],
    [],
  )

  const typeOptions = useMemo(
    () => ['All', ...new Set(resources.map((resource) => resource.type))],
    [],
  )

  const catalogueTabs = ['all', 'spaces', 'physical']

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesQuery =
        query.trim() === '' ||
        `${resource.name} ${resource.id} ${resource.location} ${resource.category}`
          .toLowerCase()
          .includes(query.toLowerCase())

      const matchesType = typeFilter === 'All' || resource.type === typeFilter
      const matchesLocation =
        locationFilter === 'All' || resource.location === locationFilter
      const matchesStatus =
        statusFilter === 'All' || resource.status === statusFilter
      const matchesTrackingGroup =
        catalogueTab === 'all' ||
        (catalogueTab === 'spaces' &&
          resource.trackingGroup === 'Spaces and Halls') ||
        (catalogueTab === 'physical' &&
          resource.trackingGroup === 'Physical Resources')
      const matchesCapacity =
        capacityFilter === 'All' ||
        (capacityFilter === '1-20' && resource.capacity <= 20) ||
        (capacityFilter === '21-50' &&
          resource.capacity >= 21 &&
          resource.capacity <= 50) ||
        (capacityFilter === '51-100' &&
          resource.capacity >= 51 &&
          resource.capacity <= 100) ||
        (capacityFilter === '100+' && resource.capacity > 100)

      return (
        matchesQuery &&
        matchesTrackingGroup &&
        matchesType &&
        matchesLocation &&
        matchesStatus &&
        matchesCapacity
      )
    })
  }, [
    capacityFilter,
    catalogueTab,
    locationFilter,
    query,
    statusFilter,
    typeFilter,
  ])

  const stats = useMemo(() => {
    const active = resources.filter((resource) => resource.status === 'ACTIVE')
    const occupied = resources.filter(
      (resource) => resource.status === 'OCCUPIED',
    )
    const outOfOrder = resources.filter(
      (resource) => resource.status === 'OUT_OF_ORDER',
    )

    return {
      total: resources.length,
      active: active.length,
      occupied: occupied.length,
      outOfOrder: outOfOrder.length,
      spaces: resources.filter(
        (resource) => resource.trackingGroup === 'Spaces and Halls',
      ).length,
      physical: resources.filter(
        (resource) => resource.trackingGroup === 'Physical Resources',
      ).length,
    }
  }, [])

  const handleDraftChange = (event) => {
    const { name, value } = event.target
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
  }

  const handlePhysicalDraftChange = (event) => {
    const { name, value } = event.target
    setPhysicalDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
  }

  const catalogueMarkup = (
    <div className="workspace-grid">
      <section className="panel panel--catalogue">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Facilities Catalogue</p>
            <h2>Find bookable spaces and assets</h2>
          </div>
          <span className="chip chip--outline">
            {filteredResources.length} visible
          </span>
        </div>

        <div className="filters">
          <div className="management-tabs management-tabs--catalogue">
            {catalogueTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`management-tab ${
                  catalogueTab === tab ? 'management-tab--active' : ''
                }`}
                onClick={() => setCatalogueTab(tab)}
              >
                {tab === 'all'
                  ? 'All resources'
                  : tab === 'spaces'
                    ? 'Spaces and halls'
                    : 'Physical resources'}
              </button>
            ))}
          </div>

          <label className="field field--search">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, code, or location"
            />
          </label>

          <label className="field">
            <span>Type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Capacity</span>
            <select
              value={capacityFilter}
              onChange={(event) => setCapacityFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="1-20">1-20</option>
              <option value="21-50">21-50</option>
              <option value="51-100">51-100</option>
              <option value="100+">100+</option>
            </select>
          </label>

          <label className="field">
            <span>Location</span>
            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              {locations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="OUT_OF_ORDER">OUT_OF_ORDER</option>
            </select>
          </label>
        </div>

        <div className="catalogue-list">
          {filteredResources.map((resource) => (
            <button
              key={resource.id}
              type="button"
              className={`resource-card ${
                selectedId === resource.id ? 'resource-card--selected' : ''
              }`}
              onClick={() => setSelectedId(resource.id)}
            >
              <div className="resource-card__top">
                <div>
                  <p className="resource-card__id">{resource.id}</p>
                  <h3>{resource.name}</h3>
                </div>
                <span
                  className={`chip chip--status chip--${resource.status.toLowerCase()}`}
                >
                  {resource.status.replaceAll('_', ' ')}
                </span>
              </div>
              <p className="resource-card__description">{resource.description}</p>
              <div className="resource-card__meta">
                <span>{resource.trackingGroup}</span>
                <span>{resource.category}</span>
                <span>{resource.capacity} pax</span>
                <span>{resource.location}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="panel panel--detail">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Resource Detail</p>
            <h2>{selectedResource.name}</h2>
          </div>
          <span className="chip">{selectedResource.type}</span>
        </div>

        <div className="detail-grid">
          <article className="detail-card detail-card--hero">
            <p>{selectedResource.description}</p>
            <div className="detail-tags">
              {selectedResource.features.map((feature) => (
                <span key={feature} className="chip chip--soft">
                  {feature}
                </span>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <span>Availability Window</span>
            <strong>{selectedResource.availability}</strong>
          </article>

          <article className="detail-card">
            <span>Capacity</span>
            <strong>{selectedResource.capacity} users</strong>
          </article>

          <article className="detail-card">
            <span>Location</span>
            <strong>
              {selectedResource.location}, {selectedResource.level}
            </strong>
          </article>

          <article className="detail-card">
            <span>Managed By</span>
            <strong>{selectedResource.manager}</strong>
          </article>
        </div>
      </aside>
    </div>
  )

  return (
    <main className="app-shell">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">NEXORA Smart Campus</p>
          <h1>Facilities catalogue and resource management</h1>

          <div className="hero-actions">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={`tab-button ${
                  activePage === page.id ? 'tab-button--active' : ''
                }`}
                onClick={() => setActivePage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-summary">
          <article className="summary-card">
            <span>Total Resources</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="summary-card">
            <span>Active Now</span>
            <strong>{stats.active}</strong>
          </article>
          <article className="summary-card">
            <span>Spaces</span>
            <strong>{stats.spaces}</strong>
          </article>
          <article className="summary-card">
            <span>Physical Resources</span>
            <strong>{stats.physical}</strong>
          </article>
          <article className="summary-card">
            <span>Out of Order</span>
            <strong>{stats.outOfOrder}</strong>
          </article>
        </div>
      </section>

      {activePage === 'overview' && (
        <section className="page-section">
          <div className="workspace-grid workspace-grid--overview">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Quick Preview</p>
                  <h2>Highlighted resources</h2>
                </div>
              </div>

              <div className="highlight-stack">
                {resources.slice(0, 3).map((resource) => (
                  <button
                    key={resource.id}
                    type="button"
                    className="highlight-card"
                    onClick={() => {
                      setSelectedId(resource.id)
                      setActivePage('catalogue')
                    }}
                  >
                    <div>
                      <p className="resource-card__id">{resource.id}</p>
                      <h3>{resource.name}</h3>
                    </div>
                    <span className="chip chip--soft">{resource.location}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Status Overview</p>
                  <h2>Resource availability at a glance</h2>
                </div>
              </div>

              <div className="overview-list">
                <article className="overview-card">
                  <h3>Active</h3>
                  <p>Resources ready for booking or assignment right now.</p>
                </article>

                <article className="overview-card">
                  <h3>Occupied</h3>
                  <p>Resources currently in use or reserved for ongoing activity.</p>
                </article>

                <article className="overview-card">
                  <h3>Out of Order</h3>
                  <p>Resources unavailable due to faults, maintenance, or servicing.</p>
                </article>
              </div>
            </section>
          </div>
        </section>
      )}

      {activePage === 'catalogue' && (
        <section className="page-section">{catalogueMarkup}</section>
      )}

      {activePage === 'manage' && (
        <section className="page-section">
          <div className="workspace-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Resource Management</p>
                  <h2>Create or register a new asset</h2>
                </div>
                <span className="chip chip--outline">Frontend mock form</span>
              </div>

              <div className="management-tabs">
                <button
                  type="button"
                  className={`management-tab ${
                    managementTab === 'spaces' ? 'management-tab--active' : ''
                  }`}
                  onClick={() => setManagementTab('spaces')}
                >
                  Spaces and halls
                </button>
                <button
                  type="button"
                  className={`management-tab ${
                    managementTab === 'physical' ? 'management-tab--active' : ''
                  }`}
                  onClick={() => setManagementTab('physical')}
                >
                  Physical resources
                </button>
              </div>

              {managementTab === 'spaces' && (
                <form className="resource-form">
                  <label className="field">
                    <span>Resource Name</span>
                    <input
                      name="name"
                      value={draft.name}
                      onChange={handleDraftChange}
                      placeholder="Ex: Innovation Board Room"
                    />
                  </label>

                  <label className="field">
                    <span>Category</span>
                    <select
                      name="category"
                      value={draft.category}
                      onChange={handleDraftChange}
                    >
                      <option>PC Lab</option>
                      <option>Lecture Hall</option>
                      <option>Auditorium</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>Type</span>
                    <select
                      name="type"
                      value={draft.type}
                      onChange={handleDraftChange}
                    >
                      <option>PC Lab</option>
                      <option>Lecture Hall</option>
                      <option>Auditorium</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>Capacity</span>
                    <input
                      name="capacity"
                      value={draft.capacity}
                      onChange={handleDraftChange}
                      placeholder="Ex: 60"
                    />
                  </label>

                  <label className="field">
                    <span>Hall / Building Location</span>
                    <input
                      name="location"
                      value={draft.location}
                      onChange={handleDraftChange}
                      placeholder="Ex: Engineering Building"
                    />
                  </label>

                  <label className="field">
                    <span>Level / Floor</span>
                    <input
                      name="level"
                      value={draft.level}
                      onChange={handleDraftChange}
                      placeholder="Ex: Level 2"
                    />
                  </label>

                  <label className="field">
                    <span>Status</span>
                    <select
                      name="status"
                      value={draft.status}
                      onChange={handleDraftChange}
                    >
                      <option>ACTIVE</option>
                      <option>OCCUPIED</option>
                      <option>OUT_OF_ORDER</option>
                    </select>
                  </label>

                  <label className="field field--full">
                    <span>Availability Window</span>
                    <input
                      name="availability"
                      value={draft.availability}
                      onChange={handleDraftChange}
                      placeholder="Ex: Mon-Fri | 08:00 - 16:00"
                    />
                  </label>

                  <div className="form-preview">
                    <p className="eyebrow">Space Preview</p>
                    <h3>{draft.name || 'New space draft'}</h3>
                    <p>
                      {draft.category} / {draft.type}
                    </p>
                    <p>
                      {draft.location || 'Location pending'}{' '}
                      {draft.level ? `- ${draft.level}` : ''}
                    </p>
                    <p>{draft.availability || 'Availability not set yet'}</p>
                  </div>
                </form>
              )}

              {managementTab === 'physical' && (
                <form className="resource-form">
                  <label className="field">
                    <span>Asset Name</span>
                    <input
                      name="assetName"
                      value={physicalDraft.assetName}
                      onChange={handlePhysicalDraftChange}
                      placeholder="Ex: Epson Smart Projector"
                    />
                  </label>

                  <label className="field">
                    <span>Asset Type</span>
                    <select
                      name="assetType"
                      value={physicalDraft.assetType}
                      onChange={handlePhysicalDraftChange}
                    >
                      <option>Projector</option>
                      <option>Audio Device</option>
                      <option>Smart Screen</option>
                      <option>Additional Seat</option>
                      <option>Chair</option>
                      <option>PC Table</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>Quantity</span>
                    <input
                      name="quantity"
                      value={physicalDraft.quantity}
                      onChange={handlePhysicalDraftChange}
                      placeholder="Ex: 12"
                    />
                  </label>

                  <label className="field">
                    <span>Assigned Location</span>
                    <input
                      name="assignedLocation"
                      value={physicalDraft.assignedLocation}
                      onChange={handlePhysicalDraftChange}
                      placeholder="Ex: PC Lab 03"
                    />
                  </label>

                  <label className="field">
                    <span>Status</span>
                    <select
                      name="assetStatus"
                      value={physicalDraft.assetStatus}
                      onChange={handlePhysicalDraftChange}
                    >
                      <option>ACTIVE</option>
                      <option>OCCUPIED</option>
                      <option>OUT_OF_ORDER</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>Serial / Inventory Tag</span>
                    <input
                      name="serialTag"
                      value={physicalDraft.serialTag}
                      onChange={handlePhysicalDraftChange}
                      placeholder="Ex: PRJ-NEX-114"
                    />
                  </label>

                  <label className="field field--full">
                    <span>Support / Availability Window</span>
                    <input
                      name="supportWindow"
                      value={physicalDraft.supportWindow}
                      onChange={handlePhysicalDraftChange}
                      placeholder="Ex: Weekdays | 08:00 - 17:00"
                    />
                  </label>

                  <div className="form-preview">
                    <p className="eyebrow">Physical Asset Preview</p>
                    <h3>{physicalDraft.assetName || 'New physical asset draft'}</h3>
                    <p>
                      {physicalDraft.assetType} / {physicalDraft.quantity || '0'} units
                    </p>
                    <p>{physicalDraft.assignedLocation || 'Assignment pending'}</p>
                    <p>
                      {physicalDraft.serialTag || 'Serial tag pending'} /{' '}
                      {physicalDraft.assetStatus}
                    </p>
                  </div>
                </form>
              )}
            </section>

            <aside className="panel panel--detail">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Management Queue</p>
                  <h2>Admin checkpoints</h2>
                </div>
              </div>

              <div className="queue-list">
                <article className="queue-item">
                  <span className="queue-item__title">Space tracking</span>
                  <p>
                    Track lecture halls and PC labs with hall name, building
                    location, floor, capacity, and time availability.
                  </p>
                </article>

                <article className="queue-item">
                  <span className="queue-item__title">Physical tracking</span>
                  <p>
                    Track projectors, audio devices, smart screens, chairs, and
                    PC tables separately with quantity and inventory tags.
                  </p>
                </article>

                <article className="queue-item">
                  <span className="queue-item__title">Planned endpoints</span>
                  <p>
                    `GET /resources`, `POST /spaces`, `POST /physical-assets`,
                    `PATCH /physical-assets/:id/status`.
                  </p>
                </article>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setActivePage('catalogue')}
                >
                  Review catalogue before backend wiring
                </button>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
