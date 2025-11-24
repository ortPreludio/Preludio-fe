import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store para preferencias de la página de Administración
 * Guarda configuración de columnas visibles en localStorage
 */

// Configuración por defecto de columnas visibles
const DEFAULT_COLUMNS = {
    users: {
        nombre: true,
        apellido: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
    },
    events: {
        titulo: true,
        categoria: true,
        fecha: true,
        hora: true,
        estadoPublicacion: true,
        estado: true,
        ubicacion: true,
    },
};

export const useAdminStore = create(
    persist(
        (set, get) => ({
            // Estado
            visibleColumns: DEFAULT_COLUMNS,

            // Actions
            toggleColumn: (view, columnKey) => {
                set((state) => ({
                    visibleColumns: {
                        ...state.visibleColumns,
                        [view]: {
                            ...state.visibleColumns[view],
                            [columnKey]: !state.visibleColumns[view][columnKey],
                        },
                    },
                }));
            },

            setColumnVisibility: (view, columnKey, isVisible) => {
                set((state) => ({
                    visibleColumns: {
                        ...state.visibleColumns,
                        [view]: {
                            ...state.visibleColumns[view],
                            [columnKey]: isVisible,
                        },
                    },
                }));
            },

            resetColumns: (view) => {
                set((state) => ({
                    visibleColumns: {
                        ...state.visibleColumns,
                        [view]: DEFAULT_COLUMNS[view],
                    },
                }));
            },

            resetAllColumns: () => {
                set({ visibleColumns: DEFAULT_COLUMNS });
            },

            // Obtener columnas visibles para una vista
            getVisibleColumns: (view) => {
                return get().visibleColumns[view] || DEFAULT_COLUMNS[view];
            },

            // Obtener solo las columnas que están marcadas como visibles
            getActiveColumns: (view) => {
                const visible = get().visibleColumns[view] || DEFAULT_COLUMNS[view];
                return Object.keys(visible).filter((key) => visible[key]);
            },
        }),
        {
            name: 'admin-preferences', // localStorage key
            partialize: (state) => ({
                // Solo persistir visibleColumns
                visibleColumns: state.visibleColumns,
            }),
        }
    )
);
