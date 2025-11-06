import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/page.css';
import '../styles/index.css';


export function Premium() {
  return (
    <main className="page-content container">
      <section className="premium-section">
        <h1>👑 Experiencia Preludio Premium</h1>
        <p>
          Desbloquea beneficios exclusivos, acceso prioritario y experiencias inolvidables con nuestra suscripción Premium.
        </p>

        <div className="benefits-grid">
          <h2>Beneficios Exclusivos</h2>
          <ul>
            <li>✅ **Preventa Prioritaria:** Accede a tickets antes que nadie.</li>
            <li>✅ **Descuentos Fijos:** 10% de descuento en todas tus compras.</li>
            <li>✅ **Acceso VIP:** Entrada preferencial y zonas exclusivas en eventos seleccionados.</li>
            <li>✅ **Merchandising Exclusivo:** Regalos y descuentos en la tienda oficial.</li>
          </ul>
        </div>
        
        <div className="cta-premium">
            <Link to="/register" className="btn btn-primary btn-large">¡Suscríbete Ahora!</Link>
        </div>
      </section>
    </main>
  );
}
export default Premium;