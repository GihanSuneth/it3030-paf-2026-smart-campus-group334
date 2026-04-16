import { MOCK_DATA_EVENT } from '../constants/events'
import { seedData } from './seedData'

const DATABASE_KEY = 'nexora-smart-campus-db'
const SESSION_KEY = 'nexora-smart-campus-session'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function ensureBrowser() {
  return typeof window !== 'undefined'
}

function dispatchChange() {
  if (ensureBrowser()) {
    window.dispatchEvent(new Event(MOCK_DATA_EVENT))
  }
}

export function readDatabase() {
  if (!ensureBrowser()) {
    return clone(seedData)
  }

  const storedValue = window.localStorage.getItem(DATABASE_KEY)

  if (!storedValue) {
    window.localStorage.setItem(DATABASE_KEY, JSON.stringify(seedData))
    return clone(seedData)
  }

  return JSON.parse(storedValue)
}

export function writeDatabase(database) {
  if (!ensureBrowser()) {
    return
  }

  window.localStorage.setItem(DATABASE_KEY, JSON.stringify(database))
  dispatchChange()
}

export function mutateDatabase(mutator) {
  const database = readDatabase()
  const result = mutator(database)
  writeDatabase(database)
  return clone(result)
}

export function getSessionUser() {
  if (!ensureBrowser()) {
    return null
  }

  const storedValue = window.localStorage.getItem(SESSION_KEY)
  return storedValue ? JSON.parse(storedValue) : null
}

export function saveSessionUser(user) {
  if (!ensureBrowser()) {
    return
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  dispatchChange()
}

export function clearSessionUser() {
  if (!ensureBrowser()) {
    return
  }

  window.localStorage.removeItem(SESSION_KEY)
  dispatchChange()
}

export function appendNotification(database, notification) {
  database.notifications.unshift({
    id: `notification-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    targetRoles: [],
    targetUserIds: [],
    readBy: [],
    createdAt: new Date().toISOString(),
    link: '/notifications',
    ...notification,
  })
}

export function buildComment(currentUser, message) {
  return {
    id: `comment-${Date.now()}`,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorRole: currentUser.role,
    message,
    createdAt: new Date().toISOString(),
  }
}

export function matchesNotificationUser(notification, currentUser) {
  if (!currentUser) {
    return false
  }

  return (
    notification.targetUserIds.includes(currentUser.id) ||
    notification.targetRoles.includes(currentUser.role)
  )
}
