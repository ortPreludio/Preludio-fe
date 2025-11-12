import React from 'react';
import '../../styles/page.css';

export function Refund() {
  return (
    <main className="page-content container">
      <section className="legal-section">
        <h1>🔙 Me Arrepentí de mi Compra</h1>
        <p className="subtitle-page">
          Derecho de Revocación según Art. [Número de Ley Local]
        </p>

        <div className="info-card">
          <h2>1. Plazo para el Arrepentimiento</h2>
          <p>
            De acuerdo con la legislación vigente para la venta a distancia, el consumidor tiene derecho a revocar la aceptación de la compra (arrepentimiento) dentro de los **[X] días corridos** contados a partir de la fecha de la compra o de la recepción del ticket, lo que ocurra último.
          </p>

          <h2>2. Excepciones</h2>
          <p>
            Este derecho no aplica si el evento se realiza en un plazo inferior al plazo de revocación, o si el ticket ya ha sido utilizado para acceder al evento.
          </p>
          
          <h2>3. Cómo Solicitar la Devolución</h2>
          <p>
            Para ejercer este derecho, debe enviar un correo electrónico a **arrepentimiento@preludio.com** indicando su número de compra y sus datos personales. El reembolso se procesará en un plazo de [X] días hábiles.
          </p>
        </div>
      </section>
    </main>
  );
}
export default Refund;