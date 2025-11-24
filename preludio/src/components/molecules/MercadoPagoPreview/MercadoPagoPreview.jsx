import { MercadoPagoLogo } from '../../atoms/MercadoPagoLogo/MercadoPagoLogo';
import './MercadoPagoPreview.css';

export function MercadoPagoPreview() {
    return (
        <div className="mercadopago-preview">
            <MercadoPagoLogo size="medium" />
            <p>Procesarás tu pago de forma segura con Mercado Pago</p>
        </div>
    );
}
