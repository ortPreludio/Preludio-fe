import { useEffect, useState } from 'react';
import { useAuth } from '../../store/authStore.js';
import { fetchMyReview, createReview, updateMyReview, deleteMyReview } from '../../api/reviews.js';
import { useReviewsStore } from '../../store/reviewsStore.js';
import { Section } from '../../components/layout/Section/Section.jsx';
import './Reviews.css';

export function Reviews() {
  const { user } = useAuth();

  // Use Zustand store for all reviews
  const { reviews: allReviews, loading, error, fetchReviews, isStale } = useReviewsStore();

  // Keep myReview as local state (user-specific)
  const [myReview, setMyReview] = useState(null);
  const [loadingMyReview, setLoadingMyReview] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Mensajes visuales
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      // Load all reviews from store (or fetch if stale/empty)
      if (allReviews.length === 0 || isStale()) {
        fetchReviews();
      }

      // Load my review if user is logged in
      if (user) {
        setLoadingMyReview(true);
        try {
          const my = await fetchMyReview();
          if (!mounted) return;
          setMyReview(my);
          if (my) {
            setFormData({ rating: my.rating, comment: my.comment });
          }
        } catch {
          // 404 means no review yet, which is fine
          if (!mounted) return;
        } finally {
          if (mounted) {
            setLoadingMyReview(false);
          }
        }
      }
    };

    loadReviews();
    return () => { mounted = false; };
  }, [user, allReviews.length, fetchReviews, isStale]);

  // Hace desaparecer el mensaje 
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [message]);

  const refetchReviews = async () => {
    // Refetch all reviews and update store
    await fetchReviews();

    // Refetch my review
    if (user) {
      try {
        const my = await fetchMyReview();
        setMyReview(my);
        if (my) {
          setFormData({ rating: my.rating, comment: my.comment });
        }
      } catch {
        // No review found
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Debes iniciar sesión para dejar una reseña");
      setMessageType("error");
      return;
    }

    try {
      if (myReview) {
        await updateMyReview(formData);
        setMessage("Reseña actualizada correctamente");
        setMessageType("success");
      } else {
        await createReview(formData);
        setMessage("Reseña creada correctamente");
        setMessageType("success");
      }

      setShowForm(false);
      refetchReviews();

    } catch (e) {
      setMessage(e.message);
      setMessageType("error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar tu reseña?")) return;

    try {
      await deleteMyReview();

      setMessage("Reseña eliminada correctamente");
      setMessageType("success");

      setMyReview(null);
      setFormData({ rating: 5, comment: "" });
      setShowForm(false);
      refetchReviews();

    } catch (e) {
      setMessage(e.message);
      setMessageType("error");
    }
  };

  if (loading || loadingMyReview) return <div className="loader">Cargando reseñas...</div>;

  return (
    <div className="reviews-page">
      <Section title="Reseñas de nuestros usuarios">

        {message && (
          <div className={`msg msg-${messageType}`}>
            {message}
          </div>
        )}

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
                <h3>{myReview ? "Editar reseña" : "Nueva reseña"}</h3>

                <div className="form-group">
                  <label>Calificación:</label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
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
                    {myReview ? "Actualizar" : "Publicar"}
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

        {/* Lista de reseñas */}
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