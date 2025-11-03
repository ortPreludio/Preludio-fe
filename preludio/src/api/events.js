
import { request, buildQuery } from './client.js'
export function fetchPublicEvents(params = {}) {
  return request(`/events/public${buildQuery(params)}`)
}
