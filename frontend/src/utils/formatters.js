import { ROLE_LABELS } from '../constants/roles'

export function formatDate(value) {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value))
  } catch (e) {
    return '-'
  }
}

export function formatDateTime(value) {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  } catch (e) {
    return '-'
  }
}

export function formatRole(role) {
  return ROLE_LABELS[role] ?? role
}

export function getInitials(name) {
  if (!name) return '??'
  try {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  } catch (e) {
    return '??'
  }
}
