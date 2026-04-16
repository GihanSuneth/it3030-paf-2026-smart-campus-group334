import { NavLink } from 'react-router-dom'

function Sidebar({ items }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="brand-kicker">Smart Campus Platform</p>
        <h1> NEXORA </h1>
        <p className="brand-copy">
          Centralize campus operations with one connected command center.
        </p>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard sections">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-card${isActive ? ' active' : ''}`
            }
          >
            <span className="nav-tag">{item.tag}</span>
            <span className="nav-meta">
              <strong>{item.shortLabel}</strong>
              <span>{item.label}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        Campus systems synchronized
      </div>
    </aside>
  )
}

export default Sidebar
