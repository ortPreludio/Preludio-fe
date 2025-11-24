// src/lib/services/pagos.service.js
import { request, buildQuery } from "../infra/http-client.js";

/**
 * Crear un pago (checkout)
 * @param {Object} data - Datos del pago
 * @param {string} data.ticketId - ID del ticket (opcional, si ya existe)
 * @param {string} data.evento - ID del evento (si no hay ticketId)
 * @param {string} data.metodo - Método de pago: 'MERCADO_PAGO', 'TARJETA', 'EFECTIVO'
 * @param {number} data.monto - Monto total
 * @param {string} data.referenciaExterna - Referencia externa (opcional, ej: ID de MercadoPago)
 * @param {string} data.tipoEntrada - Tipo de entrada (opcional)
 * @param {number} data.precioPagado - Precio pagado (opcional)
 * @returns {Promise} - Pago creado con ticket poblado
 */
export function checkout(data) {
    return request('/pagos/checkout', {
        method: 'POST',
        body: data
    });
}

/**
 * Obtener mis pagos (usuario autenticado)
 * @param {Object} params - Parámetros de paginación y búsqueda
 * @param {number} params.page - Página actual (default: 1)
 * @param {number} params.limit - Resultados por página (default: 10)
 * @param {string} params.q - Búsqueda general
 * @param {string} params.sort - Campo para ordenar (default: 'createdAt')
 * @param {string} params.order - Orden: 'asc' o 'desc' (default: 'desc')
 * @returns {Promise} - { items, total, page, limit }
 */
export function fetchMyPagos({
    page = 1,
    limit = 10,
    q = "",
    sort = "createdAt",
    order = "desc"
} = {}) {
    const query = buildQuery({ page, limit, q, sort, order });
    return request(`/pagos${query}`);
}

/**
 * Listar todos los pagos (solo ADMIN)
 * @param {Object} params - Parámetros de paginación y búsqueda
 * @returns {Promise} - { items, total, page, limit }
 */
export function fetchAllPagos({
    page = 1,
    limit = 10,
    q = "",
    sort = "createdAt",
    order = "desc"
} = {}) {
    const query = buildQuery({ page, limit, q, sort, order });
    return request(`/pagos/list${query}`);
}

/**
 * Obtener un pago por ID
 * @param {string} id - ID del pago
 * @returns {Promise} - Pago con ticket poblado
 */
export function fetchPagoById(id) {
    return request(`/pagos/${id}`);
}
