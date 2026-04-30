import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, Wrench, ArrowRight, Globe } from 'lucide-react'
import axios from 'axios'
import { authApi } from '../../api/authApi'
import { ROLE_HOME_PATHS, ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

const studentEmailDomain = import.meta.env.VITE_STUDENT_EMAIL_DOMAIN || 'my.sliit.lk'
const staffEmailDomain = import.meta.env.VITE_STAFF_EMAIL_DOMAIN || 'sliit.lk'
const studentEmailSuffix = `@${studentEmailDomain}`
const staffEmailSuffix = `@${staffEmailDomain}`

const roleCredentials = {
  [ROLES.USER]: {
    username: 'user@campus.local',
    password: 'user',
  },
  [ROLES.ADMIN]: {
    username: 'admin',
    password: 'admin',
  },
  [ROLES.TECHNICIAN]: {
    username: 'technician',
    password: 'technician',
  },
}

const roleOptions = [
  {
    role: ROLES.USER,
    title: 'Student/Staff',
    description: 'Access resources and campus support.',
    icon: User,
    color: 'indigo',
    tasks: [
      'Search campus facilities',
      'Request room bookings',
      'Track support tickets',
    ],
  },
  {
    role: ROLES.ADMIN,
    title: 'Administrator',
    description: 'Manage campus ecosystem and logic.',
    icon: Shield,
    color: 'violet',
    tasks: [
      'Inventory control',
      'Approve booking flows',
      'Team orchestration',
    ],
  },
  {
    role: ROLES.TECHNICIAN,
    title: 'Service Tech',
    description: 'Resolve incidents and maintain assets.',
    icon: Wrench,
    color: 'rose',
    tasks: [
      'Asset maintenance',
      'Incident resolution',
      'Performance reporting',
    ],
  },
]

function UniversityGoogleButton({ disabled, onError, onSuccess }) {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })
        await onSuccess(userInfo.data)
      } catch (err) {
        onError(err.message)
      }
    },
    onError: () => onError('Google Login Failed'),
  })

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => googleLogin()}
      className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 rounded-2xl transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Globe size={20} className="text-indigo-600" />
      <span className="text-sm">Continue with Google</span>
    </button>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const { currentUser, login, authLoading } = useAuth()
  const googleClientConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [formState, setFormState] = useState({
    username: roleCredentials[ROLES.USER].username,
    password: roleCredentials[ROLES.USER].password,
    role: ROLES.USER,
  })
  const [signupState, setSignupState] = useState({
    userType: 'STAFF',
    name: '',
    email: '',
    password: '',
    regNo: '',
    academicYear: '',
    faculty: '',
    purpose: '',
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

      if (user.role !== formState.role) {
        setError(`These credentials belong to ${user.role.toLowerCase()}, not the selected role.`)
        return
      }

      navigate(ROLE_HOME_PATHS[user.role], { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  async function handleGoogleSignupPrefill(googleUser) {
    setError('')
    const email = googleUser?.email?.trim() || ''

    if (!email) {
      setError('Unable to fetch the selected Google email.')
      return
    }

    setSignupState((state) => ({
      ...state,
      name: googleUser?.name || state.name,
      email,
      userType: 'STAFF',
    }))
    setShowSignupModal(true)
  }

  async function handleSignupSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await authApi.register({
        name: signupState.name,
        email: signupState.email,
        password: signupState.password,
        role: ROLES.USER,
        faculty: signupState.faculty,
        regNo: signupState.userType === 'STUDENT' ? signupState.regNo : '',
        academicYear: signupState.userType === 'STUDENT' ? signupState.academicYear : '',
        purpose: signupState.purpose,
      })

      setShowSignupModal(false)
      setSignupState({
        userType: 'STAFF',
        name: '',
        email: '',
        password: '',
        regNo: '',
        academicYear: '',
        faculty: '',
        purpose: '',
      })
      setError('Application submitted! Admin will verify your student or staff registration.')
      setTimeout(() => setError(''), 4000)
    } catch (signupError) {
      setError(signupError.message)
    }
  }

  function isStudentOrStaffEmail(value) {
    const normalizedValue = value.trim().toLowerCase()
    return (
      normalizedValue.endsWith(studentEmailSuffix.toLowerCase()) ||
      normalizedValue.endsWith(staffEmailSuffix.toLowerCase())
    )
  }

  return (
    <main className="relative min-h-screen bg-[#f8fafc] overflow-hidden flex flex-col justify-center px-4 py-8 md:py-12 md:px-8">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto grid gap-12 lg:grid-cols-2 items-center">
        {/* Left: Branding & Role Selection */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">v2.0 Smart Campus</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[0.9]">
              Nexora<br/>
              <span className="text-indigo-600">Workspace.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-500">
              The next generation of university management. Immersive, efficient, and designed for modern campus operations.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {roleOptions.map((option, idx) => (
              <motion.button
                key={option.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormState({
                  role: option.role,
                  username: roleCredentials[option.role].username,
                  password: roleCredentials[option.role].password,
                })}
                className={`text-left p-6 rounded-3xl border transition-all duration-500 overflow-hidden relative group ${
                  formState.role === option.role 
                    ? 'bg-indigo-50 border-indigo-500/50 ring-1 ring-indigo-500/50' 
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5'
                }`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500 ${
                  formState.role === option.role ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                  <option.icon size={24} />
                </div>
                <h3 className={`font-bold transition-colors ${formState.role === option.role ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {option.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                  {option.description}
                </p>
                {formState.role === option.role && (
                  <motion.div 
                    layoutId="role-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" 
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Sign In Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-card border-slate-200 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Access Control</h2>
              <p className="mt-2 text-slate-500 font-medium">
                {formState.role === ROLES.USER
                  ? 'Sign in with your email or continue with Google for direct access'
                  : 'Enter your credentials to proceed'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  {formState.role === ROLES.USER ? 'Email' : 'Identifier'}
                </label>
                <div className="relative">
                  <input
                    type={formState.role === ROLES.USER ? 'email' : 'text'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-indigo-500/50 focus:bg-white transition-all placeholder:text-slate-400"
                    placeholder={formState.role === ROLES.USER ? 'Enter your email' : 'Username or email'}
                    value={formState.username}
                    onChange={e => setFormState(s => ({ ...s, username: e.target.value }))}
                  />
                </div>
                {formState.role !== ROLES.USER && (
                  <p className="text-xs text-slate-400 ml-1">
                    {`Demo login for selected role: ${roleCredentials[formState.role].username} / ${roleCredentials[formState.role].password}`}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-indigo-500/50 focus:bg-white transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={formState.password}
                  onChange={e => setFormState(s => ({ ...s, password: e.target.value }))}
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>{authLoading ? 'Authorizing...' : 'Enter Workspace'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {formState.role === ROLES.USER && (
              <>
                <div className="mt-10 pt-10 border-t border-slate-100 space-y-6">
                  <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Single Sign-On</p>
                  <div className="grid grid-cols-1">
                    {googleClientConfigured ? (
                      <UniversityGoogleButton
                        disabled={authLoading}
                        onError={setError}
                        onSuccess={handleGoogleSignupPrefill}
                      />
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Globe size={20} className="text-indigo-600" />
                        <span className="text-sm">Continue with Google</span>
                      </button>
                    )}
                  </div>
                  {!googleClientConfigured && (
                    <p className="text-center text-xs text-amber-600">
                      Add <code>VITE_GOOGLE_CLIENT_ID</code> to <code>frontend/.env.local</code> and restart the Vite server to enable Google sign-in.
                    </p>
                  )}
                  {googleClientConfigured && (
                    <p className="text-center text-xs text-slate-500">
                      Google will fetch your email and open the signup form so you can continue as Staff or Student.
                    </p>
                  )}
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                  New to the campus?{' '}
                  <button 
                    onClick={() => setShowSignupModal(true)}
                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                  >
                    Request Access
                  </button>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Access Request Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignupModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-10"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Request Access</h2>
                  <p className="text-slate-500 font-medium mt-1">Submit your academic details for provision.</p>
                </div>
                
                <form 
                  onSubmit={handleSignupSubmit}
                  className="space-y-4"
                >
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      type="button" 
                      onClick={() => setSignupState(s => ({ ...s, userType: 'STAFF' }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${signupState.userType !== 'STUDENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Staff
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSignupState(s => ({ ...s, userType: 'STUDENT' }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${signupState.userType === 'STUDENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Student
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <input
                      className="input"
                      placeholder="Full Name"
                      required
                      value={signupState.name}
                      onChange={(e) => setSignupState((s) => ({ ...s, name: e.target.value }))}
                    />
                    <input
                      className="input"
                      placeholder="Email"
                      type="email"
                      required
                      value={signupState.email}
                      onChange={(e) => setSignupState((s) => ({ ...s, email: e.target.value }))}
                    />
                    <input
                      className="input"
                      placeholder="Create Password"
                      type="password"
                      required
                      value={signupState.password}
                      onChange={(e) => setSignupState((s) => ({ ...s, password: e.target.value }))}
                    />
                    
                    {signupState.userType === 'STUDENT' && (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                        <input
                          className="input"
                          placeholder="Reg No (e.g. IT21...)"
                          required
                          value={signupState.regNo}
                          onChange={(e) => setSignupState((s) => ({ ...s, regNo: e.target.value }))}
                        />
                        <select
                          className="input"
                          required
                          value={signupState.academicYear}
                          onChange={(e) => setSignupState((s) => ({ ...s, academicYear: e.target.value }))}
                        >
                          <option value="">Academic Year</option>
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>
                      </div>
                    )}

                    <select
                      className="input"
                      required
                      value={signupState.faculty}
                      onChange={(e) => setSignupState((s) => ({ ...s, faculty: e.target.value }))}
                    >
                      <option value="">Select Faculty</option>
                      <option>Computing & Technology</option>
                      <option>Engineering</option>
                      <option>Business Management</option>
                    </select>
                    <textarea 
                      className="textarea min-h-[80px]" 
                      placeholder="Purpose of access (e.g. Lab Reservation, Technical Triage)" 
                      required
                      value={signupState.purpose}
                      onChange={(e) => setSignupState((s) => ({ ...s, purpose: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowSignupModal(false)}
                      className="btn-ghost flex-1 justify-center !py-3"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary flex-1 justify-center !py-3"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
