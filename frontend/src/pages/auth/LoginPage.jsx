import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
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
  const { currentUser, login, oauthLogin, authLoading } = useAuth()
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [formState, setFormState] = useState({
    username: 'user',
    password: 'user',
    role: ROLES.USER,
  })
  const [error, setError] = useState('')

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        )
        // Here you would typically send userInfo.data to your backend
        console.log('Google User Info:', userInfo.data)
        
        // Falling back to our mock oauth handler
        await handleOAuth('google')
      } catch (err) {
        console.error(err)
        setError('Failed to fetch Google profile.')
      }
    },
    onError: () => setError('Google Login Failed'),
  })

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

  async function handleOAuth(provider) {
    setError('')
    try {
      const user = await oauthLogin(provider, formState.role)
      // Since it's a simulated signup/signin, we just navigate
      navigate(ROLE_HOME_PATHS[user.role], { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-5 md:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1320px] gap-5 lg:grid-cols-[minmax(0,1.25fr)_28rem]">
        <section className="hero-panel relative overflow-hidden flex flex-col justify-between border-0 shadow-none">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(30,58,95,0.04),transparent_58%)] lg:block" />
          <div className="relative space-y-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1e3a5f]">
                NEXORA
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-[#1a2533] md:text-6xl">
                University Management<br/>Suite
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-500">
                A polished university operations workspace for resources, bookings,
                incidents, notifications, and role-based management.
              </p>
            </div>

            <div className="marketing-grid">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  className={`soft-grid-card text-left flex flex-col items-start ${
                    formState.role === option.role
                      ? 'border-[#1e3a5f] bg-white ring-1 ring-[#1e3a5f] shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                  type="button"
                  onClick={() =>
                    setFormState((current) => ({ ...current, role: option.role }))
                  }
                >
                  <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    formState.role === option.role
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {option.title[0]}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{option.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">Booking Flow</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Search resources, submit requests, and follow approvals.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Incident Support</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Raise campus issues with attachments, notes, and updates.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Role Security</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Clear workspaces for users, admins, and technicians.
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

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
              Development Access
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the same credentials for every role: username <span className="bg-slate-200 px-1 rounded">user</span> and password <span className="bg-slate-200 px-1 rounded">user</span>.
            </p>
          </div>
        </section>

        <section className="panel flex flex-col justify-center border-slate-100 bg-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1e3a5f]">
              Sign In
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Open Your<br/>Workspace
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-500">
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

            <button className="btn-primary w-full justify-center mt-2 bg-[#1a2b4b] hover:bg-[#152845] py-3 rounded-lg" disabled={authLoading} type="submit">
              {authLoading ? 'Signing in...' : 'Continue'}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-sm font-medium text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="btn-ghost flex justify-center w-full !rounded-lg !py-2.5 !text-sm border-slate-200 hover:border-slate-300"
              >
                Google
              </button>
            </div>

            <p className="text-center text-sm text-slate-600 mt-2">
              Don't have an account?{' '}
              <button type="button" onClick={() => setShowSignupModal(true)} className="font-semibold text-[#1e3a5f] hover:underline">
                Sign up
              </button>
            </p>
          </form>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-900">Why this layout works</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Clear role selection, large readable text, strong contrast, and direct actions reduce cognitive load and make the first screen easier to use.
            </p>
          </div>
        </section>
      </div>

      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Create an account</h3>
                <button onClick={() => setShowSignupModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-base font-semibold text-slate-800">Select Role</span>
                  <select
                    className="input !py-3"
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
                </div>
                
                <button
                  type="button"
                  onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                  className="btn-ghost flex justify-center w-full !rounded-xl !py-3 border-slate-200 hover:border-slate-300 items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>
              
              <p className="mt-6 text-center text-sm text-slate-500">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
