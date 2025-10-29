# Plataforma de Eventos con Ticketing — MVP (React + Node)

Este proyecto es un **MVP 100% funcional** de una plataforma de gestión de eventos con ticketing (QR), con:
- **Front** en React + Vite (listado/filtrado, detalle, carrito, checkout, tickets con QR, panel admin).
- **Server** en Node/Express como **proxy** para consumir una API externa de música (setlist.fm).
- Persistencia **LocalStorage/SessionStorage** para MVP.
- Estado global con **Zustand**.
- Ruteo con **React Router**.
- **QR** con `qrcode.react`.
- Página **Mapa/Radio musical** (simple) con Leaflet.


## Requisitos
- Node.js 18+
- npm (o pnpm/yarn)

## Instalación
```bash
# 1) Instalar dependencias del server
cd server
npm install

# 2) Instalar dependencias del front
cd ../web
npm install
```

## Desarrollo (2 terminales)
```bash
# Terminal A
cd server
npm run dev  # http://localhost:4000

# Terminal B
cd web
npm run dev  # http://localhost:5173
```
> El front proxea `/api/*` al server en `:4000` durante el desarrollo.

## Variables de entorno (server)
Crea `server/.env` (opcional):
```
SETLIST_FM_API_KEY=tu_api_key_de_setlistfm
SETLIST_FM_USER_AGENT=tu-app/1.0 (email@ejemplo.com)
PORT=4000
```

## Build / Deploy
- Front:
  ```bash
  cd web
  npm run build
  npm run preview
  ```
- Server:
  ```bash
  cd server
  npm start
  ```

## Usuarios de prueba (mock)
- Admin: `admin@demo.com` / `admin123`
- Cliente: `cliente@demo.com` / `cliente123`

## Flujo principal
1. Home: listado, búsqueda, filtros, orden por fecha.
2. Detalle: ver event info, **Agregar al carrito** / **Ver setlists** (API).
3. Carrito → Checkout: confirmar, genera ticket(s) con QR.
4. Mis Tickets: ver QR y detalles.
5. Admin: crear/editar/publicar/borrar eventos con validaciones básicas.

---

**Licencia:** MIT
