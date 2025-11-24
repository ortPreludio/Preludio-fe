// src/lib/services/tickets.service.js
import { request, buildQuery } from "../infra/http-client.js";

/**
 * Crear un ticket (compra de entrada)
 * @param {Object} data - Datos del ticket
 * @param {string} data.eventoId - ID del evento
 * @param {string} data.tipoEntrada - Tipo de entrada (opcional)  
 * @param {number} data.precioPagado - Precio pagado (opcional)
 * @returns {Promise} - Ticket creado
 */
export function createTicket(data) {
  return request('/tickets', {
    method: 'POST',
    body: data
  });
}

/**
 * Obtener mis tickets (usuario autenticado)
 * Si eres ADMIN y pasas ?todos=true, obtiene todos los tickets del sistema
 * @param {Object} params - Parámetros opcionales
 * @param {string} params.order - Orden: 'asc' o 'desc' (default: 'desc')
 * @param {boolean} params.todos - Solo para ADMIN: obtener todos los tickets
 * @returns {Promise<Array>} - Array de tickets
 */
export async function fetchMyTickets({ order = 'desc', todos = false } = {}) {
  const query = buildQuery({ order, todos });
  const res = await request(`/tickets${query}`);
  return Array.isArray(res) ? res : [];
}

/**
 * Obtener un ticket por ID
 * @param {string} id - ID del ticket
 * @returns {Promise} - Ticket con evento y comprador poblados
 */
export function fetchTicketById(id) {
  return request(`/tickets/${id}`);
}

/**
 * Actualizar un ticket (solo ADMIN)
 * @param {string} id - ID del ticket
 * @param {Object} data - Datos actualizados
 * @returns {Promise} - Ticket actualizado
 */
export function updateTicket(id, data) {
  return request(`/tickets/${id}`, {
    method: 'PUT',
    body: data
  });
}

/**
 * Eliminar/Cancelar un ticket (solo ADMIN)
 * @param {string} id - ID del ticket
 * @returns {Promise} - Confirmación de eliminación
 */
export function deleteTicket(id) {
  return request(`/tickets/${id}`, {
    method: 'DELETE'
  });
}

