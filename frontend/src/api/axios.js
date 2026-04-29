import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
})

// Add a request interceptor for JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new Error('Backend request timed out after 30 seconds. Make sure the Spring server is running and MongoDB is reachable.')
      )
    }

    if (!error.response) {
      return Promise.reject(
        new Error('Cannot reach the backend. Start the Spring server on http://localhost:8080 and try again.')
      )
    }

    const message = error.response?.data?.message || error.message || 'Request failed.'
    return Promise.reject(new Error(message))
  }
)

export function simulateRequest({ method = 'get', url, handler, delay = 180, data }) {
  // If no handler is provided, we use the real API
  if (!handler) {
    return apiClient({ method, url, data }).then(res => res.data.data)
  }

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
