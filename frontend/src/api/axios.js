import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
})

export function simulateRequest({ method = 'get', url, handler, delay = 180 }) {
  apiClient.getUri({ url, method })

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(handler())
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}

export default apiClient
