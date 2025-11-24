import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente utilitario que asegura que la página haga scroll al inicio
 * cada vez que cambia la ruta (navegación).
 */
export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
