// src/api/users.js
import { request, buildQuery } from "./client.js";

/** Solo ADMIN puede listar */
export function fetchUsers({
  page = 1,
  limit = 10,
  q = "",
  sort = "createdAt",
  order = "desc",
  token,
  withCredentials = true,
} = {}) {
  const query = buildQuery({ page, limit, q, sort, order });
  return request(`/users${query}`, { token, withCredentials });
}
