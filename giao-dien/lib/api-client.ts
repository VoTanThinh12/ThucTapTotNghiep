// API client helper for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface FetchOptions {
  headers?: Record<string, string>
  body?: any
}

async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  options: FetchOptions = {}
) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

export const api = {
  // Auth
  login: (email: string, password: string, userType: string) =>
    apiCall('/auth/login', 'POST', { body: { email, password, userType } }),

  // Fields
  getFields: () => apiCall('/fields', 'GET'),
  getField: (id: string) => apiCall(`/fields/${id}`, 'GET'),
  createField: (data: any) => apiCall('/fields', 'POST', { body: data }),
  updateField: (id: string, data: any) =>
    apiCall(`/fields/${id}`, 'PUT', { body: data }),
  deleteField: (id: string) => apiCall(`/fields/${id}`, 'DELETE'),

  // Bookings
  getBookings: () => apiCall('/bookings', 'GET'),
  getBooking: (id: string) => apiCall(`/bookings/${id}`, 'GET'),
  createBooking: (data: any) => apiCall('/bookings', 'POST', { body: data }),
  updateBooking: (id: string, data: any) =>
    apiCall(`/bookings/${id}`, 'PUT', { body: data }),
  cancelBooking: (id: string) => apiCall(`/bookings/${id}`, 'DELETE'),

  // Users
  getProfile: () => apiCall('/users', 'GET'),
  updateProfile: (data: any) => apiCall('/users', 'PUT', { body: data }),
}
