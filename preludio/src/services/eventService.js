import { http, qs } from './http.js'
export const eventService = {
  listPublic: (params={}) => http(`/events/public${qs(params)}`),
}
