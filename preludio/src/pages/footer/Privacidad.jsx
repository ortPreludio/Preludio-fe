import React from 'react';
import '../../styles/page.css';

export function Privacidad() {
  return (
    <main className="page-content container">
      <section className="legal-section">
        <h1>🔒 Políticas de Privacidad</h1>
        <p className="subtitle-page">
          Última actualización: Noviembre 2025
        </p>

        <div className="info-card">
          <h2>1. Información que Recopilamos</h2>
          <p>
            Recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, y datos de pago al registrarte o comprar tickets. También recopilamos datos automáticamente sobre tu uso de la plataforma.
          </p>

          <h2>2. Uso de tu Información</h2>
          <p>
            Utilizamos la información recopilada para: procesar tus transacciones, enviarte confirmaciones de eventos, personalizar tu experiencia en la plataforma y notificarte sobre futuros shows de tu interés.
          </p>
          
          <h2>3. Derechos del Usuario</h2>
          <p>
            Tienes derecho a acceder, rectificar o solicitar la eliminación de tus datos personales. Para ejercer estos derechos, por favor, contáctanos a través del email proporcionado en la sección Contacto.
          </p>
          
          {/* ... Continúa con secciones 4, 5, etc. ... */}
        </div>
      </section>
    </main>
  );
}
export default Privacidad;