import { useState } from 'react'
import { authApi } from '../../api/authApi'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketCard } from '../../components/tickets/TicketCard'
import { StatCard } from '../../components/common/StatCard'
import { TechnicianAssignmentPanel } from '../../components/technician/TechnicianAssignmentPanel'
import { useMockQuery } from '../../hooks/useMockQuery'
import { Search, Info } from 'lucide-react'
import { ROLES } from '../../constants/roles'

export function ManageTicketsPage() {
  const [activeTab, setActiveTab] = useState('MANAGE') // MANAGE, ASSIGN
  const [searchId, setSearchId] = useState('')
  const [targetTicketId, setTargetTicketId] = useState(null)
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  
  const ticketsQuery = useMockQuery(() => ticketApi.getAllTickets(), [])
  const usersQuery = useMockQuery(() => authApi.getUsers(), [])

  if (ticketsQuery.loading || usersQuery.loading) {
    return <LoadingState label="Loading ticket operations..." />
  }

  if (ticketsQuery.error || usersQuery.error) {
    return <ErrorState message={ticketsQuery.error || usersQuery.error} />
  }

  const technicians = usersQuery.data.filter(u => u.role === ROLES.TECHNICIAN)
  const tickets = [...ticketsQuery.data].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  const pendingTriage = tickets.filter(t => !t.technicianId && ['CREATED', 'UNDER_REVIEW'].includes(t.status)).length
  const filteredTickets = tickets.filter((ticket) => {
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter
    const matchesTicketId = !searchId.trim() || (ticket.ticketCode || ticket.id).toLowerCase().includes(searchId.trim().toLowerCase())
    return matchesPriority && matchesTicketId
  })
  
  const targetTicket = targetTicketId ? tickets.find(t => t.id === targetTicketId) : null

  async function handleAssign(technicianId) {
    if (!targetTicketId) return
    const technician = technicians.find((item) => item.id === technicianId)
    if (!technician) return
    await ticketApi.assignTechnician(targetTicketId, technicianId, technician.name)
    await ticketsQuery.refetch()
    setTargetTicketId(null)
    setSearchId('')
    setActiveTab('MANAGE')
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Operations"
        title="Ticket Handling"
        description="Unified control for triage, assignment, and resource lifecycle."
      />

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        {[
          { id: 'MANAGE', label: 'Manage Tickets' },
          { id: 'ASSIGN', label: 'Assign Technician' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-[14px] text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'MANAGE' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Tickets" value={tickets.length} hint="Total system throughput." />
            <StatCard label="Pending Triage" value={pendingTriage} hint="Awaiting initial ownership." />
            <StatCard label="Active Jobs" value={tickets.filter(t => ['TECHNICIAN_ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(t.status)).length} hint="Assigned work in progress." />
          </section>

          <section className="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)]">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Priority Filter</span>
              <select className="input" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                <option value="ALL">All priorities</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Ticket ID Search</span>
              <input
                className="input"
                placeholder="Search by ticket ID"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
              />
            </label>
          </section>

          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/tickets/${ticket.id}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <article className="glass-card max-w-2xl">
              <h2 className="text-lg font-bold text-slate-950 mb-1">Direct Assignment</h2>
              <p className="text-xs text-slate-500 mb-6 font-medium">Input a Ticket Code to quickly route it to an available technician.</p>
              
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    className="input pl-10" 
                    placeholder="Enter Ticket Code (e.g. TK1001)" 
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setTargetTicketId((tickets.find((ticket) => ticket.ticketCode === searchId)?.id) || null)}
                  className="btn-primary !py-2.5"
                >
                  Find Ticket
                </button>
              </div>
           </article>

           {targetTicket ? (
             <div className="grid gap-6 md:grid-cols-2 mt-8 animate-in zoom-in-95">
                <article className="glass-card border-l-4 border-indigo-500 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    <Info size={14} /> Found Record
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{targetTicket.title}</h3>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">{targetTicket.ticketCode || targetTicket.id}</p>
                  <p className="text-sm font-medium text-slate-500 italic">"{targetTicket.description}"</p>
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Location</p>
                      <p className="text-xs font-bold text-slate-700">{targetTicket.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Status</p>
                      <p className="text-xs font-bold text-slate-700">{targetTicket.status}</p>
                    </div>
                  </div>
                </article>

                <TechnicianAssignmentPanel 
                  technicians={technicians}
                  onAssign={handleAssign}
                />
             </div>
           ) : searchId && (
             <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-500 italic">Enter a valid ID and click 'Find' to proceed with assignment.</p>
             </div>
           )}
        </div>
      )}
    </PageContainer>
  )
}
