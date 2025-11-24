import './MercadoPagoLogo.css';

export function MercadoPagoLogo({ size = 'medium' }) {
    return (
        <div className={`mp-logo mp-logo--${size}`}>
            MP
        </div>
    );
}
