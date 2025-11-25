import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para fetch con manejo de loading/error
 * Útil para casos que no usan Zustand stores
 * 
 * @param {Function} fetchFn - Función async que retorna los datos
 * @param {Array} deps - Dependencias que disparan el refetch
 * @param {Object} options - Opciones del hook
 * @returns {Object} { data, loading, error, refetch }
 */
export function useFetch(fetchFn, deps = [], options = {}) {
    const {
        immediate = true,  // Ejecutar inmediatamente o esperar llamada manual
        initialData = null,
        onSuccess,
        onError,
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const executeFetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchFn();
            setData(result);
            if (onSuccess) onSuccess(result);
            return result;
        } catch (err) {
            const errorMsg = err?.message || 'Error al cargar datos';
            setError(errorMsg);
            if (onError) onError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFn, onSuccess, onError]);

    useEffect(() => {
        if (immediate) {
            executeFetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const refetch = useCallback(() => {
        return executeFetch();
    }, [executeFetch]);

    return {
        data,
        loading,
        error,
        refetch,
        setData, // Permite actualizar datos manualmente
    };
}
