import React, { useEffect, useRef } from 'react';
import '../../styles/page.css';
import './Faq.css'

export function Faq() {
  const containerRef = useRef(null);

  // Ensure only one <details> stays open at a time (accordion behavior)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const details = Array.from(container.querySelectorAll('details.faq-item'));

    function onToggle(e) {
      const target = e.target;
      // When a details is opened, close the others
      if (target.open) {
        details.forEach(d => {
          if (d !== target) d.removeAttribute('open');
        });
      }
    }

    details.forEach(d => d.addEventListener('toggle', onToggle));

    return () => details.forEach(d => d.removeEventListener('toggle', onToggle));
  }, []);

  return (
    <main className="page-content container">
      <section className="faq-section">
        <h1>❓ Preguntas Frecuentes (FAQ)</h1>
        <p className="subtitle-page">
          Encuentra respuestas rápidas a las dudas más comunes sobre tickets, eventos, accesos y servicios.
        </p>

        <div className="faq-list" ref={containerRef}>
          <details className="faq-item">
            <summary>¿Qué objetos puedo llevar?</summary>
            <p>Se permiten objetos personales, bolsos pequeños y cámaras compactas sin trípode. No se permiten mochilas grandes ni bultos voluminosos por motivos de seguridad.</p>
          </details>

          <details className="faq-item">
            <summary>¿Qué no está permitido?</summary>
            <p>No se permiten bebidas alcohólicas traídas desde afuera, objetos punzantes, fuegos artificiales, drogas ni cualquier elemento que pueda poner en riesgo la seguridad del público.</p>
          </details>

          <details className="faq-item">
            <summary>¿Cómo llegar al lugar?</summary>
            <p>La dirección es Humboldt 450, Buenos Aires. Recomendamos utilizar transporte público o apps de movilidad. Ver rutas en Google Maps: <a href="https://www.google.com/maps/search/?api=1&query=Humboldt+450" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>.</p>
          </details>

          <details className="faq-item">
            <summary>¿Dónde estacionar?</summary>
            <p>Hay cocheras y estacionamientos privados en las cercanías. Consultá las opciones de parking en Google Maps: <a href="https://www.google.com/maps/search/estacionamiento+Humboldt+450" target="_blank" rel="noopener noreferrer">Ver estacionamientos</a>.</p>
          </details>

          <details className="faq-item">
            <summary>¿Cuánto tiempo antes debo llegar?</summary>
            <p>Se recomienda llegar al menos 45-60 minutos antes del inicio para pasar controles de seguridad y encontrar tu asiento con tranquilidad.</p>
          </details>

          <details className="faq-item">
            <summary>Entradas y accesos especiales</summary>
            <p>Revisá tu entrada para ver el acceso asignado (General, VIP, Accesible). Si necesitás asistencia, contactá al soporte con anticipación.</p>
          </details>

          <details className="faq-item">
            <summary>¿Puedo entrar con comida o bebida?</summary>
            <p>No está permitido introducir bebidas alcohólicas. Los alimentos y bebidas no alcohólicas pueden estar disponibles dentro del recinto.</p>
          </details>

          <details className="faq-item">
            <summary>¿Hay accesibilidad para personas con movilidad reducida?</summary>
            <p>Sí. Existen accesos y ubicaciones reservadas. Contactanos si necesitás asistencia o información sobre accesibilidad.</p>
          </details>

          <details className="faq-item">
            <summary>¿Se permiten reingresos?</summary>
            <p>Las políticas de reingreso dependen del evento. Revisá las condiciones en la información del show o consultá con el organizador.</p>
          </details>

        </div>

      </section>
    </main>
  );
}
export default Faq;