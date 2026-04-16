import { ROLES } from '../constants/roles'
import { simulateRequest } from './axios'
import {
  getSessionUser,
  readDatabase,
  saveSessionUser,
  clearSessionUser,
} from '../mock/database'

export const authApi = {
  login(credentials) {
    return simulateRequest({
      method: 'post',
      url: '/auth/login',
      handler: () => {
        const { username, password, role } = credentials

        if (username !== 'user' || password !== 'user') {
          throw new Error('Use demo credentials: username user and password user.')
        }

        if (!Object.values(ROLES).includes(role)) {
          throw new Error('Please choose a valid role.')
        }

        const database = readDatabase()
        const matchedUser = database.users.find((user) => user.role === role)

        if (!matchedUser) {
          throw new Error('No mock user found for the selected role.')
        }

        saveSessionUser(matchedUser)
        return matchedUser
      },
    })
  },

  logout() {
    return simulateRequest({
      method: 'post',
      url: '/auth/logout',
      handler: () => {
        clearSessionUser()
        return true
      },
    })
  },

  getCurrentUser() {
    return getSessionUser()
  },

  getUsers() {
    return simulateRequest({
      method: 'get',
      url: '/users',
      handler: () => readDatabase().users,
    })
  },
}
