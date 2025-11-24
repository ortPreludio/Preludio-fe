import './CardProcessor.css';

export function CardProcessor() {
    return (
        <div className="card-processor">
            <div className="card-reader-active">
                <div className="card-slot-active">
                    <div className="card-swipe"></div>
                </div>
                <div className="card-lights">
                    <span className="light"></span>
                    <span className="light"></span>
                    <span className="light"></span>
                </div>
            </div>
            <p>Procesando tarjeta...</p>
        </div>
    );
}
