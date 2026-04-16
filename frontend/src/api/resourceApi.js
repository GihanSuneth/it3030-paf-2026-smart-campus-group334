import { ROLES } from '../constants/roles'
import { appendNotification, mutateDatabase, readDatabase } from '../mock/database'
import { simulateRequest } from './axios'

function applyFilters(resources, filters) {
  return resources.filter((resource) => {
    const matchesQuery =
      !filters.query ||
      resource.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      resource.location.toLowerCase().includes(filters.query.toLowerCase())

    const matchesType = !filters.type || filters.type === 'ALL' || resource.type === filters.type
    const matchesStatus =
      !filters.status || filters.status === 'ALL' || resource.status === filters.status
    const matchesLocation =
      !filters.location ||
      filters.location === 'ALL' ||
      resource.location === filters.location

    return matchesQuery && matchesType && matchesStatus && matchesLocation
  })
}

export const resourceApi = {
  getResources(filters = {}) {
    return simulateRequest({
      method: 'get',
      url: '/resources',
      handler: () => applyFilters(readDatabase().resources, filters),
    })
  },

  getResourceById(resourceId) {
    return simulateRequest({
      method: 'get',
      url: `/resources/${resourceId}`,
      handler: () => {
        const resource = readDatabase().resources.find((item) => item.id === resourceId)

        if (!resource) {
          throw new Error('Resource not found.')
        }

        return resource
      },
    })
  },

  createResource(payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: '/resources',
      handler: () => {
        if (currentUser?.role !== ROLES.ADMIN) {
          throw new Error('Only admins can manage resources.')
        }

        return mutateDatabase((database) => {
          const resource = {
            id: `resource-${Date.now()}`,
            ...payload,
          }

          database.resources.unshift(resource)

          appendNotification(database, {
            title: 'Resource added',
            message: `${resource.name} is now available in the catalogue.`,
            targetRoles: [ROLES.ADMIN],
          })

          return resource
        })
      },
    })
  },

  updateResource(resourceId, payload, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/resources/${resourceId}`,
      handler: () => {
        if (currentUser?.role !== ROLES.ADMIN) {
          throw new Error('Only admins can update resources.')
        }

        return mutateDatabase((database) => {
          const resource = database.resources.find((item) => item.id === resourceId)

          if (!resource) {
            throw new Error('Resource not found.')
          }

          Object.assign(resource, payload)

          appendNotification(database, {
            title: 'Resource updated',
            message: `${resource.name} is now ${resource.status}.`,
            targetRoles: [ROLES.ADMIN, ROLES.USER],
          })

          return resource
        })
      },
    })
  },
}
