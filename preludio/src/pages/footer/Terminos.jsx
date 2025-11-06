import React from 'react';
import '../../styles/page.css';

export function Terminos() {
  return (
    <main className="page-content container">
      <section className="legal-section">
        <h1>📜 Términos y Condiciones</h1>
        <p className="subtitle-page">
          Fecha de vigencia: 01 de Enero de 2025
        </p>

        <div className="info-card">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al utilizar los servicios de Preludio, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de los términos, no deberías utilizar nuestros servicios.
          </p>

          <h2>2. Compra de Tickets</h2>
          <ul>
            <li>Las entradas compradas a través de Preludio son para uso personal y no pueden ser revendidas a un precio superior al valor nominal.</li>
            <li>La reventa no autorizada puede resultar en la cancelación de los tickets sin reembolso.</li>
          </ul>
          
          <h2>3. Política de Devoluciones</h2>
          <p>
            Todas las ventas son finales. Las devoluciones o cambios solo se procesarán si el evento es cancelado o pospuesto por el organizador, sujeto a las políticas específicas de cada show.
          </p>
          
          {/* ... Continúa con secciones 4, 5, etc. ... */}
        </div>
      </section>
    </main>
  );
}
export default Terminos;