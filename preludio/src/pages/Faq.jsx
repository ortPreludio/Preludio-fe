import React from 'react';
import '../styles/page.css';
import '../styles/index.css';


export function Faq() {
  return (
    <main className="page-content container">
      <section className="faq-section">
        <h1>❓ Preguntas Frecuentes (FAQ)</h1>
        <p>Encuentra respuestas rápidas a las dudas más comunes sobre tickets, eventos y cuentas de usuario.</p>

        <div className="faq-list">
          <details className="faq-item">
            <summary>¿Cómo puedo comprar tickets?</summary>
            <p>Puedes comprar tickets directamente desde la página del show o evento, haciendo clic en el botón "Comprar". Necesitarás una cuenta de usuario.</p>
          </details>
          
          <details className="faq-item">
            <summary>¿Qué hago si no recibo mi ticket por email?</summary>
            <p>Primero, revisa tu carpeta de SPAM. Si no está allí, inicia sesión en tu cuenta, ve a la sección "Mis Compras" y descarga el ticket directamente.</p>
          </details>
          
          <details className="faq-item">
            <summary>¿Se puede cancelar o modificar una compra?</summary>
            <p>Generalmente, las ventas son finales. Consulta nuestra política de devoluciones en la sección de 'Términos y Condiciones'.</p>
          </details>
          
        </div>
        
      </section>
    </main>
  );
}
export default Faq;