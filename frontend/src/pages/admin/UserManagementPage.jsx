import { useState, useEffect } from 'react'
import { authApi } from '../../api/authApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { formatRole } from '../../utils/formatters'
import { ROLES } from '../../constants/roles'

export function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('USERS') // USERS, REQUESTS
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [allUsers, pendingReqs] = await Promise.all([
        authApi.getUsers(),
        authApi.getPendingRequests()
      ])
      setUsers(allUsers)
      setRequests(pendingReqs)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (id) => {
    try {
      await authApi.approveRequest(id)
      fetchData()
    } catch (err) {
      alert('Approval failed: ' + err.message)
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to decline this request?')) return
    try {
      await authApi.rejectRequest(id)
      fetchData()
    } catch (err) {
      alert('Rejection failed: ' + err.message)
    }
  }

  if (loading) return <LoadingState label="Loading directory..." />
  if (error) return <ErrorState message={error} />

  const filteredUsers = users.filter(u => roleFilter === 'ALL' || u.role === roleFilter)

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Access Control"
        title="User Management"
        description="Filter and monitor user profiles or provision new access requests."
      />

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        {[
          { id: 'USERS', label: 'Monitor Users' },
          { id: 'REQUESTS', label: 'Access Requests' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-[14px] text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label} {tab.id === 'REQUESTS' && <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-md text-[10px]">{requests.length}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'USERS' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit overflow-x-auto max-w-full">
            {['ALL', ROLES.USER, ROLES.ADMIN, ROLES.TECHNICIAN].map((role) => (
              <button 
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-6 py-2 rounded-[14px] text-xs font-bold transition-all whitespace-nowrap ${roleFilter === role ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {role === 'ALL' ? 'All Roles' : formatRole(role)}
              </button>
            ))}
          </div>

          <section className="glass-card overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Role</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">#{user.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          user.role === ROLES.ADMIN ? 'bg-indigo-50 text-indigo-600' :
                          user.role === ROLES.TECHNICIAN ? 'bg-emerald-50 text-emerald-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{user.faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <section className="glass-card overflow-hidden !p-0 animate-in fade-in slide-in-from-bottom-2">
           <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-rose-50/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Credentials</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{req.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{req.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {req.regNo ? (
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-700">{req.regNo}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{req.academicYear}</p>
                          </div>
                        ) : <span className="text-xs text-slate-400">Lecturer</span>}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${req.regNo ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} border`}>
                           {req.regNo ? 'STUDENT' : 'LECTURER'}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{req.faculty}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                            onClick={() => handleApprove(req.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-all shadow-sm"
                           >
                             Provision
                           </button>
                           <button 
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1 border border-slate-200 text-slate-400 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                           >
                              Decline
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs font-medium italic">
                        No pending access requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </section>
      )}
    </PageContainer>
  )
}
