import './CardReader.css';

export function CardReader() {
    return (
        <div className="card-reader-demo">
            <div className="card-reader">
                <div className="card-slot"></div>
                <p className="card-instruction">Desliza tu tarjeta</p>
            </div>
        </div>
    );
}
