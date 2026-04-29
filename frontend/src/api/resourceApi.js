import { simulateRequest } from './axios'

export const resourceApi = {
  getResources() {
    return simulateRequest({
      method: 'get',
      url: '/resources'
    })
  },

  getResourceById(resourceId) {
    return simulateRequest({
      method: 'get',
      url: `/resources/${resourceId}`
    })
  },

  createResource(payload) {
    return simulateRequest({
      method: 'post',
      url: '/resources',
      data: payload
    })
  },

  updateResource(resourceId, payload) {
    return simulateRequest({
      method: 'put',
      url: `/resources/${resourceId}`,
      data: payload
    })
  },

  deleteResource(resourceId) {
    return simulateRequest({
      method: 'delete',
      url: `/resources/${resourceId}`
    })
  }
}
