import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiLogin, apiLogout } from '../lib/services/auth.service.js';

/**
 * Auth/Session Store with sessionStorage persistence
 * Manages user authentication state and session
 */
export const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            loading: false,
            error: null,
            isInitialized: false,

            // Actions
            setUser: (user) => set({ user, error: null }),

            login: async ({ email, password }) => {
                set({ loading: true, error: null });
                try {
                    const { user } = await apiLogin({ email, password });
                    set({ user, loading: false });
                    return user;
                } catch (error) {
                    set({
                        error: error.message || 'Error al iniciar sesión',
                        loading: false,
                        user: null
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ loading: true, error: null });
                try {
                    await apiLogout();
                } catch (error) {
                    // Log error but still clear user state
                    console.error('Logout error:', error);
                } finally {
                    set({ user: null, loading: false });
                }
            },

            // Validate session with server (called on app init)
            validateSession: async () => {
                if (get().isInitialized) return;

                set({ loading: true });
                try {
                    const res = await fetch('https://preludioback.netlify.app/api/auth/me', { credentials: 'include' });
                    if (res.ok) {
                        const data = await res.json();
                        set({ user: data.user || null, loading: false, isInitialized: true });
                    } else {
                        set({ user: null, loading: false, isInitialized: true });
                    }
                } catch {
                    set({ user: null, loading: false, isInitialized: true });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage', // sessionStorage key
            storage: {
                getItem: (name) => {
                    const str = sessionStorage.getItem(name);
                    return str ? JSON.parse(str) : null;
                },
                setItem: (name, value) => {
                    sessionStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    sessionStorage.removeItem(name);
                },
            },
            partialize: (state) => ({
                // Only persist user, not loading/error/isInitialized states
                user: state.user,
            }),
        }
    )
);

// Backward compatibility hook (drop-in replacement for useAuth)
export function useAuth() {
    const { user, loading, error, setUser, login, logout } = useAuthStore();

    return {
        user,
        loading,
        error,
        setUser,
        login,
        logout,
        // Deprecated - keeping for backward compatibility
        setToken: () => { },
    };
}
