import { PaymentSpinner } from '../../../atoms/PaymentSpinner/PaymentSpinner';
import { MercadoPagoLogo } from '../../../atoms/MercadoPagoLogo/MercadoPagoLogo';
import './MercadoPagoProcessor.css';

export function MercadoPagoProcessor() {
    return (
        <div className="mercadopago-processor">
            <PaymentSpinner />
            <MercadoPagoLogo size="large" className="mp-logo-animated" />
            <p>Procesando pago con Mercado Pago...</p>
            <div className="mp-progress-bar">
                <div className="mp-progress-fill"></div>
            </div>
        </div>
    );
}
