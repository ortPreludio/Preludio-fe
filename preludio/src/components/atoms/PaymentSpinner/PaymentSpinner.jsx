import './PaymentSpinner.css';

export function PaymentSpinner({ color = '#009ee3' }) {
    return (
        <div
            className="payment-spinner"
            style={{ '--spinner-color': color }}
        />
    );
}
