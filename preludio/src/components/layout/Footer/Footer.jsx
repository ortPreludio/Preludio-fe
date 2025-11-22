import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/footer.css'; 

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        
        {/* Columna 1: Navegación Rápida y Legal */}
        <div className="footer-section">
          <h3>Información y Ayuda</h3>
          <ul>
            <li><Link to="/legal/privacidad">Políticas de Privacidad</Link></li>
            <li><Link to="/legal/terminos">Términos y Condiciones</Link></li>
            <li><Link to="/legal/defensaconsumidor">Defensa del consumidor</Link></li>
            <li><Link to="/refund">Me arrepentí de mi compra</Link></li>
          </ul>
        </div>
        
        {/* Columna 2: Redes Sociales */}
        <div className="footer-section social-links">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="https://instagram.com/preludio" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://x.com/preludio" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
            <li><a href="https://youtube.com/preludio" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            <li><a href="https://facebook.com/preludio" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          </ul>
        </div>

        {/* Columna 3: Contacto y Dirección */}
        <div className="footer-section contact-info">
          <h3>Contacto</h3>
          <p>
            **Dirección física:**<br />
            Humboldt 450, CABA 
          </p>
          <p>
            **Email:** info@preludio.com
          </p>
        </div>

      </div>

      {/* Franja de Copyright Separada */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Preludio. Todos los derechos reservados. </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;