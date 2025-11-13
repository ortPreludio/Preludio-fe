import { request } from "./client.js";

/**
 * Obtiene los tickets comprados por el usuario actual.
 * El backend reconoce al usuario por el token/cookie (no se pasa manualmente).
 * @param {string} order - 'asc' o 'desc' para el orden de la fecha de compra.
 * @returns {Promise<Array>} 
 */
export async function fetchMyTickets(order = 'desc') {
  const url = `/api/tickets/mytickets?order=${order}`;

  try {
    const response = await request(url);

    if (response.msg === 'No tienes tickets comprados aún.') {
      return [];
    }

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error en fetchMyTickets:", error);
    throw new Error(error.message || 'Error al conectar con el servidor de tickets.');
  }
}
