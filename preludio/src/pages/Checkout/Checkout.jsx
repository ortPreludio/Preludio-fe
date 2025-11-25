import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkout } from '../../lib/services/pagos.service';
import { fetchEventById } from '../../lib/services/events.service';
import {
    MercadoPagoProcessor,
    CardProcessor,
    CashProcessor
} from '../../components/organisms/PaymentProcessors';
import { MercadoPagoPreview } from '../../components/molecules/MercadoPagoPreview/MercadoPagoPreview';
import { CardReader } from '../../components/molecules/CardReader/CardReader';
import './Checkout.css';

/**
 * Checkout - Página de pago/checkout
 * Permite al usuario completar un pago para un evento
 */
export function Checkout() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Obtener eventId desde la URL (NO el precio, por seguridad)
    const eventId = searchParams.get('evento');

    const [loading, setLoading] = useState(false);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [error, setError] = useState(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        metodo: 'MERCADO_PAGO',
        tipoEntrada: 'GENERAL',
    });

    // Fetch event data on mount
    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) {
                setLoadingEvent(false);
                return;
            }

            try {
                const eventData = await fetchEventById(eventId);
                setEvent(eventData);
            } catch (err) {
                setError(err.message || 'Error al cargar el evento');
                setMessage(err.message || 'Error al cargar el evento');
                setMessageType('error');
            } finally {
                setLoadingEvent(false);
            }
        };

        loadEvent();
    }, [eventId]);

    // Auto-dismiss message after 3.5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowAnimation(true);

        // Simular tiempo de procesamiento de pago con animación
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            const pagoData = {
                evento: eventId,
                metodo: formData.metodo,
                monto: event.precioBase,
                tipoEntrada: formData.tipoEntrada,
                precioPagado: event.precioBase,
                // Simular referencia externa de MercadoPago
                referenciaExterna: formData.metodo === 'MERCADO_PAGO'
                    ? `MP-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
                    : undefined
            };

            await checkout(pagoData);

            // Mostrar mensaje de éxito
            setShowAnimation(false);
            setMessage('¡Pago completado exitosamente!');
            setMessageType('success');

            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/mistickets');
            }, 2000);

        } catch (err) {
            setShowAnimation(false);
            setError(err.message || 'Error al procesar el pago');
            setMessage(err.message || 'Error al procesar el pago');
            setMessageType('error');
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
                        className="btn btn-ghost checkout-page__error-button"
                    >
                        Volver a eventos
                    </button>
                </div>
            </div>
        );
    }

    if (loadingEvent) {
        return (
            <div className="checkout-page">
                <div className="loader">Cargando información del evento...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="checkout-page">
                <div className="checkout-page__error">
                    <p>Error: No se pudo cargar la información del evento.</p>
                    <button
                        onClick={() => navigate('/shows')}
                        className="btn btn-ghost checkout-page__error-button"
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

            {message && (
                <div className={`msg msg-${messageType}`}>
                    {message}
                </div>
            )}

            {error && !message && (
                <div className="checkout-page__error">
                    {error}
                </div>
            )}

            <div className="checkout-page__summary">
                <h2 className="checkout-page__summary-title">Resumen de Compra</h2>
                <div className="checkout-page__summary-event">
                    <h3>{event.titulo}</h3>
                    <p>{new Date(event.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </div>
                <div className="checkout-page__summary-total">
                    <span>Precio Total:</span>
                    <span className="price">${event.precioBase}</span>
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
                        disabled={loading}
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
                        disabled={loading}
                    >
                        <option value="GENERAL">General</option>
                        <option value="VIP">VIP</option>
                        <option value="PREMIUM">Premium</option>
                    </select>
                </div>

                {/* Preview de Mercado Pago */}
                {formData.metodo === 'MERCADO_PAGO' && !showAnimation && (
                    <div className="checkout-page__info-box">
                        <MercadoPagoPreview />
                    </div>
                )}

                {/* Preview de Tarjeta */}
                {formData.metodo === 'TARJETA' && !showAnimation && (
                    <div className="checkout-page__info-box">
                        <CardReader />
                    </div>
                )}

                {/* Animaciones durante procesamiento */}
                {showAnimation && (
                    <div className="payment-animation">
                        {formData.metodo === 'MERCADO_PAGO' && <MercadoPagoProcessor />}
                        {formData.metodo === 'TARJETA' && <CardProcessor />}
                        {formData.metodo === 'EFECTIVO' && <CashProcessor />}
                    </div>
                )}

                {/* Solo mostrar botones si no hay mensaje de éxito para evitar que se puedan enviar dos veces */}
                {!(message && messageType === 'success') && (
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
                )}
            </form>
        </div>
    );
}
