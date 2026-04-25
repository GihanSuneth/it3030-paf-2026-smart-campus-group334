import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="panel max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-700">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Page not found
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          The page you requested does not exist in the current frontend scaffold.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link className="btn-primary" to="/">
            Go Home
          </Link>
          <Link className="btn-ghost" to="/login">
            Login
          </Link>
        </div>
      </section>
    </main>
  )
}
