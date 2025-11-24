const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Obtener todas las reseñas (público)
export async function fetchAllReviews() {
  const res = await fetch(`${API_URL}/api/reviews`);
  if (!res.ok) throw new Error('Error al obtener reseñas');
  return res.json();
}

// Obtener mi reseña (autenticado) - SIN TOKEN, usa cookies
export async function fetchMyReview() {
  const res = await fetch(`${API_URL}/api/reviews/me/review`, {
    credentials: 'include' // <- IMPORTANTE: envía las cookies
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Error al obtener tu reseña');
  }
  return res.json();
}

// Crear reseña (autenticado) - SIN TOKEN, usa cookies
export async function createReview(data) {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', //esto envía las cookies
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || 'Error al crear reseña');
  }
  return res.json();
}

// Actualizar mi reseña (autenticado) - SIN TOKEN, usa cookies
export async function updateMyReview(data) {
  const res = await fetch(`${API_URL}/api/reviews/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', //aca lo mismo, envía las cookies
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar reseña');
  }
  return res.json();
}

// Eliminar mi reseña (autenticado) - SIN TOKEN, usa cookies
export async function deleteMyReview() {
  const res = await fetch(`${API_URL}/api/reviews/me`, {
    method: 'DELETE',
    credentials: 'include' //envía las cookies
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar reseña');
  }
  return res.json();
}