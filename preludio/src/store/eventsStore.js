import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchPublicEvents } from '../lib/services/events.service.js';

/**
 * Events Store with localStorage persistence
 * Stores minimal event data for list/card rendering
 * Full event details should be fetched on EventDetails page
 */
export const useEventsStore = create(
    persist(
        (set, get) => ({
            // State
            events: [],
            loading: false,
            error: null,
            lastFetch: null,

            // Actions
            setEvents: (events) => {
                // Only store minimal data needed for cards
                const minimalEvents = events.map(event => ({
                    _id: event._id || event.id,
                    titulo: event.titulo,
                    categoria: event.categoria,
                    fecha: event.fecha,
                    hora: event.hora,
                    imagen: event.imagen,
                    precioBase: event.precioBase || event.precio,
                    estadoPublicacion: event.estadoPublicacion,
                    ubicacion: event.ubicacion,
                }));
                set({
                    events: minimalEvents,
                    lastFetch: Date.now(),
                    error: null
                });
            },

            clearEvents: () => set({ events: [], lastFetch: null, error: null }),

            fetchEvents: async (params = {}) => {
                set({ loading: true, error: null });
                try {
                    const data = await fetchPublicEvents(params);
                    const events = Array.isArray(data) ? data : data.items || [];
                    get().setEvents(events);
                    set({ loading: false });
                } catch (error) {
                    set({
                        error: error.message || 'Error al cargar eventos',
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
            name: 'events-storage', // localStorage key
            partialize: (state) => ({
                // Only persist events and lastFetch, not loading/error states
                events: state.events,
                lastFetch: state.lastFetch,
            }),
        }
    )
);
