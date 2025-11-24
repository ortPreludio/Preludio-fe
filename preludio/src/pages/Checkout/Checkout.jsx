import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkout } from '../../lib/services/pagos.service';
import './Checkout.css';

/**
 * Checkout - Página de pago/checkout
 * Permite al usuario completar un pago para un evento
 */
export function Checkout() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Obtener eventId y precio desde la URL
    const eventId = searchParams.get('evento');
    const precio = searchParams.get('precio') || 0;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        metodo: 'MERCADO_PAGO',
        tipoEntrada: 'GENERAL',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const pagoData = {
                evento: eventId,
                metodo: formData.metodo,
                monto: parseFloat(precio),
                tipoEntrada: formData.tipoEntrada,
                precioPagado: parseFloat(precio),
                // Simular referencia externa de MercadoPago
                referenciaExterna: formData.metodo === 'MERCADO_PAGO'
                    ? `MP-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
                    : undefined
            };

            const result = await checkout(pagoData);

            // Redirigir a mis tickets tras un pago exitoso
            alert('¡Pago completado exitosamente!');
            navigate('/mistickets');

        } catch (err) {
            setError(err.message || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    if (!eventId) {
        return (
            <div className="checkout-page">
                <div className="checkout-page__error">
                    <p>Error: No se especificó un evento para el checkout.</p>
                    <button
                        onClick={() => navigate('/shows')}
                        className="btn btn-ghost"
                        style={{ marginTop: 'var(--spacing-2)' }}
                    >
                        Volver a eventos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-page__title">Checkout - Finalizar Compra</h1>

            {error && (
                <div className="checkout-page__error">
                    {error}
                </div>
            )}

            <div className="checkout-page__summary">
                <h2 className="checkout-page__summary-title">Resumen de Compra</h2>
                <div className="checkout-page__summary-total">
                    <span>Precio Total:</span>
                    <span className="price">${precio}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="checkout-page__form">
                <h2 className="checkout-page__form-title">Método de Pago</h2>

                <div className="checkout-page__form-group">
                    <label className="checkout-page__form-label">
                        Método de Pago
                    </label>
                    <select
                        name="metodo"
                        value={formData.metodo}
                        onChange={handleChange}
                        className="checkout-page__form-select"
                        required
                    >
                        <option value="MERCADO_PAGO">Mercado Pago</option>
                        <option value="TARJETA">Tarjeta de Crédito/Débito</option>
                        <option value="EFECTIVO">Efectivo</option>
                    </select>
                </div>

                <div className="checkout-page__form-group">
                    <label className="checkout-page__form-label">
                        Tipo de Entrada
                    </label>
                    <select
                        name="tipoEntrada"
                        value={formData.tipoEntrada}
                        onChange={handleChange}
                        className="checkout-page__form-select"
                        required
                    >
                        <option value="GENERAL">General</option>
                        <option value="VIP">VIP</option>
                        <option value="PREMIUM">Premium</option>
                    </select>
                </div>

                {formData.metodo === 'MERCADO_PAGO' && (
                    <div className="checkout-page__info-box">
                        <p>
                            ⓘ En producción, aquí se mostraría el botón de Mercado Pago.
                            Por ahora, esto es una simulación.
                        </p>
                    </div>
                )}

                <div className="checkout-page__actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !eventId}
                    >
                        {loading ? 'Procesando...' : 'Confirmar Pago'}
                    </button>
                </div>
            </form>
        </div>
    );
}
