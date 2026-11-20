import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://www.osmartbd.com/api/v1'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ltc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export type Course = {
  id: number
  title: string
  title_bn?: string | null
  slug: string
  code: string
  language: string
  level: string
  mode: string
  summary?: string | null
  summary_bn?: string | null
  duration_weeks: number
  total_classes: number
  price: number
  member_price: number
  is_featured?: boolean
  highlights?: string[]
  batches?: Batch[]
}

export type Center = {
  id: number
  name: string
  name_bn?: string | null
  slug: string
  code: string
  phone?: string | null
  district?: string | null
  address?: string | null
}

export type Batch = {
  id: number
  name: string
  name_bn?: string | null
  schedule_label?: string | null
  start_date?: string | null
  seats_left: number
  status: string
  course?: { id: number; title: string; slug: string } | null
  center?: { id: number; name: string; slug: string } | null
}

export async function fetchHome() {
  const { data } = await api.get('/ltc/home')
  return data.data
}

export async function fetchCourses(params: Record<string, string> = {}) {
  const { data } = await api.get('/ltc/courses', { params })
  return data
}

export async function fetchCourse(key: string) {
  const { data } = await api.get(`/ltc/courses/${key}`)
  return data.data as Course
}

export async function fetchCenters() {
  const { data } = await api.get('/ltc/centers')
  return data.data as Center[]
}

export async function login(username: string, password: string) {
  const { data } = await api.post('/login', { email: username, password, client: 'web-business' })
  return data.data || data
}

export async function fetchMe() {
  const { data } = await api.get('/ltc/me')
  return data.data
}

export async function enroll(slug: string, payload: { batch_id?: number; payment_method: string; password?: string; note?: string }) {
  const { data } = await api.post(`/ltc/courses/${slug}/enroll`, payload)
  return data
}
