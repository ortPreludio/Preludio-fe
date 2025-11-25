import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button.jsx';
import './BuyButton.css';

/**
 * BuyButton - Botón de compra con lógica de entradas agotadas
 * Props:
 * - eventId: ID del evento
 * - entradasDisponibles: Número de entradas disponibles
 * - children: Texto del botón (opcional, default: "Comprar")
 * - className: Clases CSS adicionales (opcional)
 * - variant: 'primary' | 'ghost' (opcional)
 * - fullWidth: Si es true, el botón ocupa todo el ancho (opcional)
 */
export function BuyButton({
    eventId,
    entradasDisponibles,
    children = "Comprar",
    className = "",
    variant = "primary",
    fullWidth = false
}) {
    const navigate = useNavigate();
    // Aseguramos que sea un número y verificamos si es <= 0
    // Si es undefined o null, asumimos que hay entradas (para compatibilidad con eventos viejos)
    const stock = Number(entradasDisponibles);
    const hasStock = entradasDisponibles !== undefined && entradasDisponibles !== null && !isNaN(stock);
    const isSoldOut = hasStock && stock <= 0;

    const handleClick = () => {
        if (!isSoldOut) {
            navigate(`/checkout?evento=${eventId}`);
        }
    };

    // Si es fullWidth, agregamos la clase btn-block al botón
    const buttonVariant = fullWidth ? `${variant} btn-block` : variant;

    return (
        <div className={`buy-button ${isSoldOut ? 'sold-out' : ''} ${fullWidth ? 'full-width' : ''} ${className}`}>
            <Button
                as="button"
                variant={buttonVariant}
                onClick={handleClick}
                disabled={isSoldOut}
            >
                {children}
            </Button>
            {isSoldOut && (
                <span className="buy-button__tooltip">Entradas agotadas</span>
            )}
        </div>
    );
}
