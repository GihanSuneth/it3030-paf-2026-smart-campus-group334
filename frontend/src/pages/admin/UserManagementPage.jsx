import { authApi } from '../../api/authApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { formatRole } from '../../utils/formatters'
import { useMockQuery } from '../../hooks/useMockQuery'

export function UserManagementPage() {
  const { data, loading, error } = useMockQuery(() => authApi.getUsers(), [])

  if (loading) {
    return <LoadingState label="Loading users..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Users"
        title="User Management"
        description="Mock user and role list for frontend access control testing."
      />

      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Faculty
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {data.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{user.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{formatRole(user.role)}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{user.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageContainer>
  )
}
