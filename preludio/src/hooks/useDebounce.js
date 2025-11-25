import { useState, useEffect } from 'react';

/**
 * Hook para debouncing de valores
 * @param {any} value - Valor a debounce
 * @param {number} delay - Delay en ms (default 500ms)
 * @returns {any} Valor con debounce aplicado
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
