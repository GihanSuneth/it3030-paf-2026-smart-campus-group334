import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROLE_HOME_PATHS, ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

const roleOptions = [
  {
    role: ROLES.USER,
    title: 'User',
    description: 'Browse resources, request bookings, and track tickets.',
  },
  {
    role: ROLES.ADMIN,
    title: 'Admin',
    description: 'Manage resources, review bookings, and coordinate tickets.',
  },
  {
    role: ROLES.TECHNICIAN,
    title: 'Technician',
    description: 'Work assigned tickets, add updates, and close repairs.',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { currentUser, login, authLoading } = useAuth()
  const [formState, setFormState] = useState({
    username: 'user',
    password: 'user',
    role: ROLES.USER,
  })
  const [error, setError] = useState('')

  if (currentUser) {
    return <Navigate replace to={ROLE_HOME_PATHS[currentUser.role]} />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const user = await login(formState)
      navigate(ROLE_HOME_PATHS[user.role], { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-5 md:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1320px] gap-5 lg:grid-cols-[minmax(0,1.25fr)_28rem]">
        <section className="hero-panel relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(207,189,146,0.28),transparent_58%)] lg:block" />
          <div className="relative space-y-6">
            <div>
              <p className="text-[2rem] font-bold uppercase tracking-[0.34em] text-[#22375d]">
                NEXORA
              </p>
              <h1 className="mt-4 max-w-4xl font-serif-display text-6xl font-semibold tracking-tight text-slate-950 md:text-7xl">
                University Management Suite
              </h1>
              <p className="mt-5 max-w-3xl text-xl leading-9 text-slate-600">
                A polished university operations workspace for resources, bookings,
                incidents, notifications, and role-based management.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  className={`soft-grid-card text-left ${
                    formState.role === option.role
                      ? 'border-[#c2ad86] bg-[#fffaf2] shadow-[0_18px_36px_rgba(105,82,46,0.12)]'
                      : 'bg-white/80'
                  }`}
                  type="button"
                  onClick={() =>
                    setFormState((current) => ({ ...current, role: option.role }))
                  }
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ece6da] text-lg font-semibold text-[#634d32]">
                    {option.title[0]}
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-950">{option.title}</h2>
                  <p className="mt-2 text-base leading-7 text-slate-600">{option.description}</p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="section-panel">
                <p className="text-base font-semibold text-slate-900">Booking Flow</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Search resources, submit requests, and follow approvals.
                </p>
              </div>
              <div className="section-panel">
                <p className="text-base font-semibold text-slate-900">Incident Support</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Raise campus issues with attachments, notes, and updates.
                </p>
              </div>
              <div className="section-panel">
                <p className="text-base font-semibold text-slate-900">Role Security</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Clear workspaces for users, admins, and technicians.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 rounded-[28px] border border-[#e0d8c7] bg-white/90 p-5 shadow-[0_12px_28px_rgba(67,80,75,0.06)]">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#775b35]">
              Development Access
            </p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Use the same credentials for every role: username `user` and password `user`.
            </p>
          </div>
        </section>

        <section className="panel flex flex-col justify-center border-[#e3dccd] bg-[linear-gradient(180deg,#fffdf8_0%,#f7f4ea_100%)]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#775b35]">
              Sign In
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Open Your Workspace
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Choose a role and enter the matching workspace.
            </p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="text-base font-semibold text-slate-800">Username</span>
              <input
                className="input"
                value={formState.username}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, username: event.target.value }))
                }
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-semibold text-slate-800">Password</span>
              <input
                className="input"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-semibold text-slate-800">Role</span>
              <select
                className="input"
                value={formState.role}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, role: event.target.value }))
                }
              >
                {roleOptions.map((option) => (
                  <option key={option.role} value={option.role}>
                    {option.title}
                  </option>
                ))}
              </select>
            </label>

            {error ? <p className="text-base text-rose-700">{error}</p> : null}

            <button className="btn-primary w-full justify-center" disabled={authLoading} type="submit">
              {authLoading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 rounded-[24px] border border-[#e3dccd] bg-[#fffdf8] p-4">
            <p className="text-base font-semibold text-slate-900">Why this layout works</p>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Clear role selection, large readable text, strong contrast, and direct actions reduce cognitive load and make the first screen easier to use.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
