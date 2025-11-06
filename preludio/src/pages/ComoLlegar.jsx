import React from 'react';
import '../styles/page.css';
import '../styles/index.css';


export function ComoLlegar() {
  return (
    <main className="page-content container">
      <section className="location-section">
        <h1>📍 Cómo Llegar a Nuestros Espacios</h1>
        <p>
          Encuentra toda la información necesaria para llegar a la ubicación de nuestros eventos de manera fácil y rápida.
        </p>

        <h2>Ubicación Principal</h2>
        <p>
          Nuestra sede principal está ubicada en: **Calle Ficticia 1234, CABA, Argentina.**
        </p>
        
        <h2>Transporte Público</h2>
        <ul>
          <li>**Subte:** Línea D (Estación Palermo), Línea B (Estación Dorrego).</li>
          <li>**Colectivos:** Líneas 15, 34, 55, 60, 166.</li>
          <li>**Tren:** Ferrocarril San Martín (Estación Palermo).</li>
        </ul>

        <h2>Recomendaciones Adicionales</h2>
        <p>
          Recomendamos llegar con al menos 30 minutos de antelación, especialmente para eventos con alta concurrencia.
        </p>
        
        
      </section>
    </main>
  );
}
export default ComoLlegar;