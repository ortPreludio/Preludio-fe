# 📘 ORT Preludio

> **Plataforma web para la gestión y compra de entradas para eventos.**

## 💡 Descripción General

**ORT Preludio** es una aplicación Full-Stack diseñada para simplificar la gestión y adquisición de tickets para diversos eventos.

El sistema cuenta con autenticación mediante JWT, generación de códigos QR únicos para cada ticket y un panel de usuario donde cada comprador puede visualizar, editar o eliminar su reseña acerca de la plataforma. Además cuenta con una sección donde podrá ver todos sus tickets y otra para poder editar su contraseña.
En cuanto al panel de administrador, este podrá ver el listado de todos los usuarios y eventos. En ambas secciones cuenta con un buscador para poder filtrar mas facilmente y ademas cuenta con un configurador de columnas para que pueda ver solo la información que crea necesaria. El administrador podrá crear y editar eventos.  

Se utilizan **rutas protegidas** (wrappers de componentes) que verifican el token y el rol del usuario antes de renderizar la vista, garantizando la **Autorización** adecuada para:
* **Rutas Privadas (USUARIO):** `/mistickets`, `/profile`.
* **Rutas de Administración (ADMIN):** `/administration`, `/events/create`, `/events/edit`, `/user/edit` etc.

### 📌 Funcionalidades Principales

| Categoría | Funcionalidades Clave |
| :--- | :--- |
| **Seguridad y Usuarios** | Autenticación completa (Registro, Login, Sesión persistente, Recuperación de contraseña) mediante JWT y hasheo con Bcrypt. |
| **Tickets y Eventos** | Listado de eventos, compra de entradas, **generación de códigos QR únicos** |
| **Reseñas (Reviews)** | CRUD (Crear, Ver, Editar, Eliminar) de reseñas personales, con restricción de **una reseña por usuario**. |

---

## 🚀 Tecnologías Utilizadas

Este proyecto fue desarrollado utilizando:

### Frontend
* **React (Vite)** 
* **React Router** 

### Backend
* **Node.js + Express** 
* **MongoDB + Mongoose** 
* **JSON Web Token (JWT)** 
* **Bcrypt** 
* **Crypto** 
* **CORS & dotenv** 

---

## ✅ Requisitos previos

- Node.js >= 18 (recomendado).
- MongoDB (local o cluster en Atlas).
- npm o pnpm/yarn (según prefieras).
- Un frontend o herramienta tipo Postman/Insomnia para probar la API.

---

## ⚙️ Configuración de entorno

Crear un archivo `.env` en la raíz del proyecto con, por ejemplo:

```env
# Servidor
PORT=3001
FRONT=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net
APP_ENV=staging
DB_NAME_STAGING=preludio_staging
DB_NAME_PROD=preludio_prod

# JWT
JWT_SECRET=super_secret_access_key
JWT_REFRESH_SECRET=super_secret_refresh_key
```

Notas:

- `MONGODB_URI` **no** debe incluir el nombre de la base al final, solo el cluster.
- `APP_ENV` controla qué DB se elige (staging vs production).
- `JWT_SECRET` y `JWT_REFRESH_SECRET` deben ser claves seguras y distintas.

---

## 🏃‍♂️ Cómo ejecutar en local

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

2. **Instalar dependencias**

```bash
npm install
# o
pnpm install
# o
yarn install
```

3. **Configurar `.env`**

Crear el archivo `.env` como se indicó arriba.

4. **Levantar el servidor**

Según cómo tengas definido `package.json`, por ejemplo:

```bash
npm start
# o
node server.js
# o
npm run dev
```

### 2. Frontend (Cliente)

1.  **Clonar el repositorio:**
    ```bash
    git clone (https://github.com/ortPreludio/Preludio-fe.git)
    cd preludio
    ```

2.  **Navegar al directorio del cliente:**
    ```bash
    cd preludio 
    ```

3.  **Instalar dependencias:**
    ```bash
    npm install
    ```

4.  **Ejecutar el cliente:**
    ```bash
    npm run dev
    # La aplicación se abrirá en tu navegador (ej. http://localhost:5173)
    ```

---

## 🚀 Uso del Sistema

1.  **Registro y Login:** El usuario debe registrarse o iniciar sesión para acceder a las funcionalidades de compra y gestión. La sesión persistente mantiene al usuario autenticado.
2.  **Compra de Tickets:** Navega por la lista de eventos. Una vez realizada la compra, el sistema registra la transacción y genera el ticket con su respectivo código QR.
3.  **Panel de Usuario:** El comprador puede visualizar todos sus tickets adquiridos y gestionar su reseña de la plataforma.
4.  **Gestión de Reseñas:** Crea una opinión sobre la plataforma. El sistema garantiza que solo se pueda emitir **una reseña por usuario**, y permite su edición o eliminación posterior.
5.  **Validación (Backend):** La API expone una ruta para escanear el QR, verificando su unicidad y validez en la base de datos para controlar el acceso al evento.

---

## 🔑 Credenciales de prueba

```text
ADMIN
- Email: admin@preludio.com
- Password: Password01!

USUARIO
- Email: usuario@preludio.com
- Password: Password01!
```
---

## 🌱 Origen de la idea

La idea de desarrollar ORT Preludio surgió de la curiosidad que teníamos sobre cómo funcionan las plataformas que gestionan eventos masivos. Nos llamaba la atención entender cómo se organizan miles de entradas, cómo se controla el acceso y, especialmente, cómo se generan códigos QR únicos e irrepetibles para cada ticket.
Ese interés terminó convirtiéndose en un proyecto que nos permitió trabajar estas tecnologías, entendendiendo sus desafíos y bondades para construir una solución completa que simula, a menor escala, el funcionamiento real de un sistema de venta y validación de entradas.

## 🔑 Credenciales de prueba

```text
ADMIN
- Email: admin@preludio.com
- Password: Password01!

USUARIO
- Email: usuario@preludio.com
- Password: Password01!
```

* **[Ian Gregorini, Gustavo Adonai Rios, Santiago Muñoz y Paola Mattjie]** - [https://github.com/ortPreludio/]

---

## ⚖️ Licencia

Este proyecto está bajo la Licencia **MIT**. 
