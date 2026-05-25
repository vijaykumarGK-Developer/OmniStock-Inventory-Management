import api from './api'

export function getSales(params: { from?: string; to?: string }) {
  const q = new URLSearchParams()
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  return api.get(`/reports/sales?${q}`).then((r) => r.data.data)
}

export function getStock() {
  return api.get('/reports/stock').then((r) => r.data.data)
}

export function getPurchases(params: { from?: string; to?: string }) {
  const q = new URLSearchParams()
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  return api.get(`/reports/purchases?${q}`).then((r) => r.data.data)
}

export function getProfit(params: { from?: string; to?: string }) {
  const q = new URLSearchParams()
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  return api.get(`/reports/profit?${q}`).then((r) => r.data.data)
}
