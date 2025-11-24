// src/lib/services/reviews.service.js
import { request } from "../infra/http-client.js";

/**
 * Obtener todas las reseñas (público)
 */
export function fetchAllReviews() {
  return request('/reviews');
}

/**
 * Obtener mi reseña (autenticado)
 * Usa cookies httpOnly automáticamente
 */
export async function fetchMyReview() {
  try {
    return await request('/reviews/me/review');
  } catch (error) {
    // Si es 404, no hay reseña
    if (error.message?.includes('404')) return null;
    throw error;
  }
}

/**
 * Crear reseña (autenticado)
 * @param {Object} data - Datos de la reseña (rating, comentario, etc.)
 */
export function createReview(data) {
  return request('/reviews', {
    method: 'POST',
    body: data
  });
}

/**
 * Actualizar mi reseña (autenticado)
 * @param {Object} data - Datos actualizados
 */
export function updateMyReview(data) {
  return request('/reviews/me', {
    method: 'PUT',
    body: data
  });
}

/**
 * Eliminar mi reseña (autenticado)
 */
export function deleteMyReview() {
  return request('/reviews/me', {
    method: 'DELETE'
  });
}