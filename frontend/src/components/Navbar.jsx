import { useLocation } from 'react-router-dom'

function Navbar({ items }) {
  const location = useLocation()
  const activeItem =
    items.find((item) => item.path === location.pathname) ?? items[0]

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Operations Dashboard</p>
        <h2>{activeItem.label}</h2>
      </div>

      <div className="topbar-actions">
        <div className="search-shell" aria-label="Dashboard search">
          <span>Search</span>
          <strong>Rooms, assets, tickets...</strong>
        </div>
        <div className="profile-chip">
          <span className="profile-avatar">NX</span>
          <div>
            <strong>NEXORA Admin</strong>
            <span>Control room</span>
          </div>
        </div>
      </div>
    </header>
  )
}


export default Navbar
