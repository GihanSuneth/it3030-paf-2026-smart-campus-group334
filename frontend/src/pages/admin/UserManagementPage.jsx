import { useState } from 'react'
import { authApi } from '../../api/authApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { formatRole } from '../../utils/formatters'
import { useMockQuery } from '../../hooks/useMockQuery'
import { ROLES } from '../../constants/roles'

export function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('USERS') // USERS, REQUESTS
  const [roleFilter, setRoleFilter] = useState('ALL')
  const { data, loading, error } = useMockQuery(() => authApi.getUsers(), [])

  if (loading) {
    return <LoadingState label="Loading users..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const filteredUsers = data.filter(u => roleFilter === 'ALL' || u.role === roleFilter)
  
  // Mock requests
  const pendingRequests = [
    { id: 'req_1', name: 'Gihan Suneth', email: 'gihan@student.uni.ac.lk', faculty: 'Computing', type: 'STUDENT', regNo: 'IT2100445', year: '3rd Year', purpose: 'Research Lab access' },
    { id: 'req_2', name: 'Arun Kumara', email: 'arun@eng.uni.ac.lk', faculty: 'Engineering', type: 'STUDENT', regNo: 'EN2245001', year: '2nd Year', purpose: 'Support ticket tracking' },
    { id: 'req_3', name: 'Dr. Jane Smith', email: 'jane.s@uni.ac.lk', faculty: 'Computing', type: 'LECTURER', purpose: 'Manage lab inventories and technician assignments.' }
  ]

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
            {tab.label} {tab.id === 'REQUESTS' && <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-md text-[10px]">{pendingRequests.length}</span>}
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
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Context</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{req.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{req.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {req.regNo ? (
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-700">{req.regNo}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{req.year}</p>
                          </div>
                        ) : <span className="text-xs text-slate-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${req.type === 'STUDENT' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} border`}>
                           {req.type}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{req.faculty}</p>
                        <p className="text-[10px] text-slate-400 italic line-clamp-1">"{req.purpose}"</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-all">Provision</button>
                           <button className="px-3 py-1 border border-slate-200 text-slate-400 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">Decline</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </section>
      )}
    </PageContainer>
  )
}
