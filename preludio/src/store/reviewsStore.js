import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAllReviews } from '../api/reviews.js';

/**
 * Reviews Store with localStorage persistence
 * Stores minimal review data for list rendering
 */
export const useReviewsStore = create(
    persist(
        (set, get) => ({
            // State
            reviews: [],
            loading: false,
            error: null,
            lastFetch: null,

            // Actions
            setReviews: (reviews) => {
                // Only store data needed for review cards
                const minimalReviews = reviews.map(review => ({
                    _id: review._id || review.id,
                    rating: review.rating,
                    comment: review.comment,
                    user: {
                        nombre: review.user?.nombre,
                        apellido: review.user?.apellido,
                    },
                    createdAt: review.createdAt,
                }));
                set({
                    reviews: minimalReviews,
                    lastFetch: Date.now(),
                    error: null
                });
            },

            addReview: (review) => {
                const minimalReview = {
                    _id: review._id || review.id,
                    rating: review.rating,
                    comment: review.comment,
                    user: {
                        nombre: review.user?.nombre,
                        apellido: review.user?.apellido,
                    },
                    createdAt: review.createdAt,
                };
                set((state) => ({
                    reviews: [minimalReview, ...state.reviews]
                }));
            },

            updateReview: (id, data) => {
                set((state) => ({
                    reviews: state.reviews.map(review =>
                        review._id === id ? { ...review, ...data } : review
                    ),
                }));
            },

            deleteReview: (id) => {
                set((state) => ({
                    reviews: state.reviews.filter(review => review._id !== id),
                }));
            },

            clearReviews: () => set({ reviews: [], lastFetch: null, error: null }),

            fetchReviews: async () => {
                set({ loading: true, error: null });
                try {
                    const reviews = await fetchAllReviews();
                    get().setReviews(reviews);
                    set({ loading: false });
                } catch (error) {
                    set({
                        error: error.message || 'Error al cargar reseñas',
                        loading: false
                    });
                }
            },

            // Utility to check if data is stale (older than 5 minutes)
            isStale: () => {
                const { lastFetch } = get();
                if (!lastFetch) return true;
                const fiveMinutes = 5 * 60 * 1000;
                return Date.now() - lastFetch > fiveMinutes;
            },
        }),
        {
            name: 'reviews-storage', // localStorage key
            partialize: (state) => ({
                // Only persist reviews and lastFetch, not loading/error states
                reviews: state.reviews,
                lastFetch: state.lastFetch,
            }),
        }
    )
);
