import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

export function ProfilePage() {
  const { currentUser, logout } = useAuth()

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Basic user information for the current mock session."
        actions={
          <button className="btn-primary" type="button" onClick={logout}>
            Sign Out
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="panel space-y-4">
          <h2 className="text-xl font-semibold text-slate-950">User Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Name</p>
              <p className="mt-1 text-sm text-slate-500">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Role</p>
              <p className="mt-1 text-sm text-slate-500">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Email</p>
              <p className="mt-1 text-sm text-slate-500">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Faculty</p>
              <p className="mt-1 text-sm text-slate-500">{currentUser.faculty}</p>
            </div>
          </div>
        </article>

        <article className="panel space-y-4">
          <h2 className="text-xl font-semibold text-slate-950">Integration Notes</h2>
          <ul className="space-y-3 text-sm text-slate-500">
            <li>This profile is served by the mock auth module for frontend development.</li>
            <li>The structure is ready to connect to a Spring Boot REST API later.</li>
            <li>Role-based navigation and guards already use this account state.</li>
          </ul>
        </article>
      </section>
    </PageContainer>
  )
}
