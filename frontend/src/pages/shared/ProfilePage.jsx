import { useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { User, Lock, Camera, Shield, ChevronLeft } from 'lucide-react'

export function ProfilePage() {
  const { currentUser, logout } = useAuth()
  const [isChanging, setIsChanging] = useState(false)
  const [passwordState, setPasswordState] = useState({ old: '', new: '', confirm: '' })
  const [success, setSuccess] = useState(false)

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setIsChanging(false)
      setPasswordState({ old: '', new: '', confirm: '' })
    }, 2000)
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your identity, faculty details, and security settings."
        actions={
          <button className="btn-primary !bg-rose-600 hover:!bg-rose-700" type="button" onClick={logout}>
            Sign Out
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-card flex flex-col items-center text-center p-8">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
              <User size={48} className="text-indigo-400" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white shadow-lg border-2 border-white hover:scale-110 transition-all">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{currentUser.name}</h2>
          <span className="mt-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
            {ROLE_LABELS[currentUser.role]}
          </span>
          
          <div className="w-full grid grid-cols-1 gap-4 mt-8 text-left">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
              <p className="text-sm font-bold text-slate-800">{currentUser.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Faculty</p>
              <p className="text-sm font-bold text-slate-800">{currentUser.faculty}</p>
            </div>
          </div>
        </article>

        <article className="glass-card space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-500" size={24} />
            <h2 className="text-xl font-bold text-slate-950">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            {!isChanging ? (
              <button 
                onClick={() => setIsChanging(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-400/50 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg"><Lock size={18} className="text-slate-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Change Account Password</p>
                    <p className="text-xs text-slate-500">Regularly updating your password keeps your data safe.</p>
                  </div>
                </div>
                <ChevronLeft className="rotate-180 text-slate-300" size={16} />
              </button>
            ) : (
              <form onSubmit={handleUpdatePassword} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">Modify Password</h3>
                  <button type="button" onClick={() => setIsChanging(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500">Cancel</button>
                </div>
                
                <div className="space-y-3">
                  <input 
                    type="password" 
                    placeholder="Current Password" 
                    className="input bg-white" 
                    required 
                    value={passwordState.old}
                    onChange={e => setPasswordState(p => ({...p, old: e.target.value}))}
                  />
                  <input 
                    type="password" 
                    placeholder="New Secure Password" 
                    className="input bg-white" 
                    required 
                    value={passwordState.new}
                    onChange={e => setPasswordState(p => ({...p, new: e.target.value}))}
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    className="input bg-white" 
                    required 
                    value={passwordState.confirm}
                    onChange={e => setPasswordState(p => ({...p, confirm: e.target.value}))}
                  />
                </div>

                {success && (
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest text-center italic">
                    Security credentials updated successfully!
                  </p>
                )}

                <button disabled={success} className="btn-primary w-full justify-center !py-2.5 text-xs shadow-md" type="submit">
                  {success ? 'Credential Synced...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </article>
      </section>
    </PageContainer>
  )
}
