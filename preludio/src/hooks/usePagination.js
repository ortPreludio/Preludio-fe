import { useState } from 'react';

/**
 * Hook reutilizable para manejar paginación
 * @param {number} initialPage - Página inicial (1-based)
 * @param {number} initialPerPage - Items por página inicial
 * @returns {Object} Estado y funciones de paginación
 */
export function usePagination(initialPage = 1, initialPerPage = 10) {
    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(initialPerPage);

    // Calcula la página máxima basada en el total de items
    const getMaxPage = (total) => Math.max(1, Math.ceil((total || 0) / (perPage || 1)));

    // Resetea a la primera página
    const resetPage = () => setPage(1);

    // Cambia items por página y resetea a página 1
    const changePerPage = (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    // Va a la siguiente página
    const nextPage = (maxPage) => {
        setPage((prev) => Math.min(prev + 1, maxPage));
    };

    // Va a la página anterior
    const prevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    // Va a una página específica
    const goToPage = (pageNum, maxPage) => {
        const validPage = Math.max(1, Math.min(pageNum, maxPage));
        setPage(validPage);
    };

    return {
        page,
        perPage,
        setPage,
        setPerPage,
        changePerPage,
        resetPage,
        nextPage,
        prevPage,
        goToPage,
        getMaxPage,
    };
}
