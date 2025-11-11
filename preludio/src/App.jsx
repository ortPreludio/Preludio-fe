import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/auth.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Header } from "./components/layout/Header.jsx";
import { Administration } from "./pages/Administration.jsx";
import { Shows } from "./pages/Shows.jsx";

import Forbidden from "./pages/Forbidden.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import RequireRole from "./routes/RequireRole.jsx";
import RedirectIfAuthenticated from "./routes/RedirectIfAuthenticated.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main style={{ minHeight: "80vh", padding: "2rem" }}>
          <Routes>
            {/* guest-only */}
            <Route element={<RedirectIfAuthenticated />}>
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
            </Route>

            {/* admin-only */}
            <Route element={<RequireRole roles={["ADMIN"]} />}>
              <Route path="/administration" element={<Administration/>} />
            </Route>

            {/* any authed-only (example) */}
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<div>Mi perfil</div>} />
            </Route>

            {/* public */}
            <Route path="/forbidden" element={<Forbidden/>} />
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<NotFound/>} />
            <Route path="/shows" element={<Shows />} />
        </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
