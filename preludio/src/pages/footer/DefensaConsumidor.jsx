import React from 'react';
import '../../styles/page.css';

export function DefensaConsumidor() {
  return (
    <main className="page-content container">
      <section className="legal-section">
        <h1>🛡️ Defensa del Consumidor</h1>
        <p className="subtitle-page">
          Información obligatoria según Ley N° [Número de Ley Local]
        </p>

        <div className="info-card">
          <h2>1. Autoridad de Aplicación</h2>
          <p>
            Ante cualquier duda o reclamo, usted puede contactar a la Dirección General de Defensa y Protección del Consumidor de [Ciudad/País].
          </p>

          <h2>2. Procedimiento de Reclamos</h2>
          <p>
            Si tienes un problema con la compra de tickets o la prestación de nuestros servicios que no se resuelve a través de nuestros canales habituales, puedes iniciar un reclamo formal en línea a través del siguiente enlace: [Link a la web de Defensa del Consumidor].
          </p>
          
          <h2>3. Contacto Directo</h2>
          <p>
            Nuestro número de contacto para defensa del consumidor es: **0800-PRELUDIO (Lunes a Viernes, 9 a 18h).**
          </p>
        </div>
      </section>
    </main>
  );
}
export default DefensaConsumidor;