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
    <main className="min-h-screen bg-transparent px-3 py-3 md:px-5 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1520px] gap-4 lg:grid-cols-[minmax(0,1.45fr)_31rem]">
        <section className="hero-panel relative flex min-h-[72vh] flex-col justify-between overflow-hidden p-6 md:p-8 xl:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(78,121,167,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(242,142,43,0.1),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />
          <div className="absolute -right-16 top-10 hidden h-64 w-64 rounded-full bg-[rgba(78,121,167,0.08)] blur-3xl lg:block" />
          <div className="absolute bottom-12 left-10 hidden h-48 w-48 rounded-full bg-[rgba(242,142,43,0.08)] blur-3xl lg:block" />
          <div className="relative space-y-8">
            <div className="max-w-5xl">
              <p className="text-[1.9rem] font-bold uppercase tracking-[0.34em] text-slate-900">
                NEXORA
              </p>
              <h1 className="mt-4 max-w-5xl font-serif-display text-[3.9rem] font-semibold tracking-tight text-slate-950 md:text-[4.8rem] xl:text-[5.6rem]">
                University Management Suite
              </h1>
              <p className="mt-5 max-w-4xl text-xl leading-9 text-slate-600 xl:text-[1.38rem]">
                A modern campus operations dashboard for facilities, bookings, support issues,
                notifications, and role-based workflows with a cleaner, faster experience.
              </p>
            </div>

            <div className="marketing-grid">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  className="choice-card"
                  data-active={formState.role === option.role}
                  type="button"
                  onClick={() =>
                    setFormState((current) => ({ ...current, role: option.role }))
                  }
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <span className="choice-card-badge">{option.title[0]}</span>
                      <span className={`role-dot ${formState.role === option.role ? 'role-dot-active' : ''}`} />
                    </div>
                    <h2 className="mt-5 text-[1.45rem] font-semibold tracking-tight text-slate-950">{option.title}</h2>
                    <p className="mt-2 text-base leading-7 text-slate-600">{option.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#365f8b]">
                      Continue as {option.title}
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_22rem]">
              <div className="marketing-highlight">
                <span className="subtle-pill">Designed For Clarity</span>
                <h2 className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950">
                  Cleaner decisions, faster actions, less friction.
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                  The interface keeps the next important action visible first, reduces visual noise,
                  and gives each role a clearer path through campus workflows.
                </p>
              </div>

              <div className="marketing-highlight bg-[linear-gradient(180deg,rgba(255,255,255,0.85)_0%,rgba(244,248,252,0.92)_100%)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#365f8b]">
                  Workspace Fit
                </p>
                <div className="mt-4 space-y-3">
                  {roleOptions.map((option) => (
                    <div key={option.role} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-800">{option.title}</span>
                      <span className={`role-dot ${formState.role === option.role ? 'role-dot-active' : ''}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel flex min-h-[72vh] flex-col justify-center border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,250,253,0.98)_100%)] p-6 md:p-7">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#365f8b]">
              Sign In
            </p>
            <h2 className="mt-3 text-[2.5rem] font-semibold tracking-tight text-slate-950">
              Open Your Workspace
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Choose a role and enter the matching workspace.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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

            {error ? <p className="text-sm text-rose-700">{error}</p> : null}

            <button className="btn-primary w-full justify-center py-3.5 text-lg" disabled={authLoading} type="submit">
              {authLoading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 rounded-[24px] border border-slate-200/90 bg-white/85 p-4 shadow-[0_10px_18px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Selected role</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {roleOptions.find((option) => option.role === formState.role)?.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {roleOptions.find((option) => option.role === formState.role)?.description}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
