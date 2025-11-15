import { useEffect, useState } from 'react';
import { useAuth } from '../state/auth.jsx';
import { fetchAllReviews, fetchMyReview, createReview, updateMyReview, deleteMyReview } from '../api/reviews.js';
import { Section } from '../components/layout/Section.jsx';

export function Reviews() {
  const { user } = useAuth(); // Solo necesitamos user, no token
  
  const [allReviews, setAllReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, [user]);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const reviews = await fetchAllReviews();
      setAllReviews(reviews);
      
      if (user) {
        const my = await fetchMyReview(); // Sin pasar token
        setMyReview(my);
        if (my) {
          setFormData({ rating: my.rating, comment: my.comment });
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    try {
      if (myReview) {
        await updateMyReview(formData); // Sin pasar token
        alert('Reseña actualizada correctamente');
      } else {
        await createReview(formData); // Sin pasar token
        alert('Reseña creada correctamente');
      }
      setShowForm(false);
      loadReviews();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar tu reseña?')) return;
    
    try {
      await deleteMyReview(); // Sin pasar token
      alert('Reseña eliminada correctamente');
      setMyReview(null);
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      loadReviews();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="loader">Cargando reseñas...</div>;

  return (
    <div className="reviews-page">
      <Section title="Reseñas de nuestros usuarios">
        
        {/* Sección para dejar/editar reseña */}
        {user && (
          <div className="my-review-section">
            {!showForm && !myReview && (
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                Dejar una reseña
              </button>
            )}

            {!showForm && myReview && (
              <div className="my-review-card">
                <h3>Tu reseña</h3>
                <div className="rating">{'⭐'.repeat(myReview.rating)}</div>
                <p>{myReview.comment}</p>
                <div className="actions">
                  <button onClick={() => setShowForm(true)} className="btn btn-secondary">
                    Editar
                  </button>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="review-form">
                <h3>{myReview ? 'Editar reseña' : 'Nueva reseña'}</h3>
                
                <div className="form-group">
                  <label>Calificación:</label>
                  <select 
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    required
                  >
                    <option value={1}>⭐ 1</option>
                    <option value={2}>⭐⭐ 2</option>
                    <option value={3}>⭐⭐⭐ 3</option>
                    <option value={4}>⭐⭐⭐⭐ 4</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Comentario:</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    minLength={10}
                    maxLength={500}
                    required
                    placeholder="Cuéntanos tu experiencia (mínimo 10 caracteres)"
                    rows={5}
                  />
                  <small>{formData.comment.length}/500 caracteres</small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {myReview ? 'Actualizar' : 'Publicar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)} 
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Lista de todas las reseñas */}
        <div className="reviews-list">
          <h3>Todas las reseñas ({allReviews.length})</h3>
          
          {error && <div className="error">{error}</div>}
          
          {allReviews.length === 0 && (
            <p>No hay reseñas todavía. ¡Sé el primero en dejar una!</p>
          )}

          {allReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="user-info">
                  <strong>
                    {review.user?.nombre} {review.user?.apellido}
                  </strong>
                  <div className="rating">{'⭐'.repeat(review.rating)}</div>
                </div>
                <span className="date">
                  {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}