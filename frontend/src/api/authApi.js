import { simulateRequest } from './axios'

const CURRENT_USER_KEY = 'currentUser'

export const authApi = {
  login(credentials) {
    return simulateRequest({
      method: 'post',
      url: '/auth/login',
      data: {
        email: credentials.email || credentials.username, // Handle both mock/real names
        password: credentials.password
      }
    }).then(res => {
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user))
      }
      return res.user
    })
  },

  register(registrationData) {
    return simulateRequest({
      method: 'post',
      url: '/auth/register',
      data: registrationData
    })
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem(CURRENT_USER_KEY)
    return Promise.resolve(true)
  },

  getCurrentUser() {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  },

  oauthLogin() {
    return Promise.reject(new Error('Google login is not configured for this MVP.'))
  },

  getUsers() {
    return simulateRequest({
      method: 'get',
      url: '/users'
    })
  },

  getPendingRequests() {
    return simulateRequest({
      method: 'get',
      url: '/users/pending'
    })
  },

  approveRequest(userId) {
    return simulateRequest({
      method: 'post',
      url: `/users/${userId}/approve`
    })
  },

  rejectRequest(userId) {
    return simulateRequest({
      method: 'delete',
      url: `/users/${userId}/reject`
    })
  },

  createTechnician(payload) {
    return simulateRequest({
      method: 'post',
      url: '/users/technicians',
      data: payload
    })
  }
}
