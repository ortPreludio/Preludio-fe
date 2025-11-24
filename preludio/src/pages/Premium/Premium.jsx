import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/page.css';
import './Premium.css';

export function Premium() {

    // Lista de beneficios organizada para el mapeo
    const beneficios = [
        { title: 'Preventa Prioritaria', description: 'Accede a tickets antes que nadie para los eventos más codiciados.' },
        { title: 'Descuentos Fijos', description: 'Obtén un 10% de descuento permanente en la mayoría de tus compras de tickets.' },
        { title: 'Acceso VIP', description: 'Disfruta de entrada preferencial y zonas exclusivas en eventos seleccionados.' },
        { title: 'Merchandising Exclusivo', description: 'Recibe regalos especiales y descuentos en la tienda oficial de Preludio.' },
    ];

    return (
        <main className="page-content container">
            <section className="premium-section">
                <h1>👑 Experiencia Preludio Premium</h1>
                <p className="subtitle-page">
                    Desbloquea beneficios exclusivos, acceso prioritario y experiencias inolvidables con nuestra suscripción Premium.
                </p>

                {/* CONTENEDOR GRID: Muestra los ítems en una cuadrícula */}
                <div className="benefits-grid">

                    {beneficios.map((b, index) => (
                        <div className="benefit-item" key={index}>
                            <h3>{b.title}</h3>
                            <p>{b.description}</p>
                        </div>
                    ))}

                </div>

                {/* Llama a la Acción */}
                <div className="cta-premium">
                    <Link to="/register" className="btn btn-primary btn-large">¡Suscríbete Ahora!</Link>
                </div>
            </section>
        </main>
    );
}
export default Premium;