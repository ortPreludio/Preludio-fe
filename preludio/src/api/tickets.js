import { request, buildQuery } from "./client.js";

/**
 * Obtiene los tickets comprados por el usuario actual.
 * Se apoya en `request()` que envía cookies por defecto.
 * @param {string} order - 'asc' o 'desc'
 */
export async function fetchMyTickets(order = 'desc') {
  const path = `/tickets/mytickets${buildQuery({ order })}`;
  const res = await request(path);
  return Array.isArray(res) ? res : [];
}
