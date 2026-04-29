import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="panel max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-700">NEXORA</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          You do not have access to this page
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          The current role is not allowed to open this route.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link className="btn-primary" to="/dashboard">
            Go to Dashboard
          </Link>
          <Link className="btn-ghost" to="/login">
            Return to Login
          </Link>
        </div>
      </section>
    </main>
  )
}
