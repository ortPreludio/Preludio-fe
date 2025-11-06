import React from 'react';
import '../styles/page.css';
import '../styles/index.css';


export function ComoLlegar() {
  return (
    <main className="page-content container">
      <section className="location-section">
        
        <h1>📍 Cómo Llegar a Nuestros Espacios</h1>
        <p className="subtitle-page">
          Encuentra toda la información necesaria para llegar a la ubicación de nuestros eventos de manera fácil y rápida.
        </p>

        {/* CONTENEDOR PRINCIPAL: info-card y grid de 2 columnas */}
        <div className="info-card"> 
            
            {/* Columna 1: Contenido de Detalles */}
            <div className="location-details">
                
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
            </div>
            
            {/* Columna 2: Mapa */}
            <div className="map-placeholder">
                {/* IFRAME DEL MAPA EMBEBIDO */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.3816618494698!2d-58.44800119999999!3d-34.594509300000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5eb6fb40a93%3A0x1fcab11b62b55896!2sMovistar%20Arena!5e0!3m2!1ses!2sar!4v1762388911425!5m2!1ses!2sar" 
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            
        </div>
        
      </section>
    </main>
  );
}
export default ComoLlegar;