// src/lib/services/events.service.js
import { request, buildQuery } from "../infra/http-client.js";

export function fetchPublicEvents(params = {}) {
  const q = buildQuery({ estadoPublicacion: "PUBLISHED", ...params });
  return request(`/events${q}`);
}

/** Admin / role-aware (paginado) */
export function fetchAdminEvents({
  page = 1,
  limit = 10,
  q = "",
  sort = "fecha",
  order = "asc",
  estado,
  estadoPublicacion,
  categoria,
  from,
  to,
  ciudad,
  provincia,
  lugar,
  token,              // opcional usando Bearer
  withCredentials = true, // para cookies httpOnly
} = {}) {
  const query = buildQuery({
    page, limit, q, sort, order,
    estado, estadoPublicacion, categoria, from, to, ciudad, provincia, lugar,
  });
  return request(`/events${query}`, { token, withCredentials });
}
