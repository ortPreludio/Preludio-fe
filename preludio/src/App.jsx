import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/auth.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Header } from "./components/layout/Header.jsx";
import { ComoLlegar } from './pages/ComoLlegar.jsx';
import { Premium } from './pages/Premium.jsx';
import { Faq } from './pages/Faq.jsx';
import { Administration } from "./pages/Administration.jsx";
import { Shows } from "./pages/Shows.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { Privacidad } from './pages/footer/Privacidad.jsx';
import { Terminos } from './pages/footer/Terminos.jsx';
import { DefensaConsumidor } from './pages/footer/DefensaConsumidor.jsx';
import { Refund } from './pages/footer/Refund.jsx';
import Forbidden from "./pages/Forbidden.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import RequireRole from "./routes/RequireRole.jsx";
import RedirectIfAuthenticated from "./routes/RedirectIfAuthenticated.jsx";
import { MisTickets } from "./pages/MisTickets.jsx";

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
              <Route path="/mistickets" element={<MisTickets />} />
            </Route>

            {/* public */}
            <Route path="/forbidden" element={<Forbidden/>} />
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<NotFound/>} />
            <Route path="/shows" element={<Shows />} />
            {/* 2. RUTAS DE INFORMACIÓN (QUE ESTABAN BLOQUEADAS) */}
            <Route path="/comollegar" element={<ComoLlegar />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/legal/privacidad" element={<Privacidad />} />
            <Route path="/legal/terminos" element={<Terminos />} />
            <Route path="/legal/defensaconsumidor" element={<DefensaConsumidor />} />
            <Route path="/refund" element={<Refund />} />

        </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
