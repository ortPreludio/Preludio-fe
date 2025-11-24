import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore.js";
import { Home } from "./pages/Home/Home.jsx";
import { Login } from "./pages/Login/Login.jsx";
import { Register } from "./pages/Register/Register.jsx";
import { EditUser } from "./pages/EditUser/EditUser.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import { Header } from "./components/layout/Header/Header.jsx";
import { ComoLlegar } from './pages/ComoLlegar/ComoLlegar.jsx';
import { Premium } from './pages/Premium/Premium.jsx';
import { Faq } from './pages/Faq/Faq.jsx';
import { Administration } from "./pages/Administration/Administration.jsx";
import CreateEvent from "./pages/CreateEvent/CreateEvent.jsx";
import EditEvent from "./pages/EditEvent/EditEvent.jsx";
import { Shows } from "./pages/Shows/Shows.jsx";
import { Reviews } from './pages/Reviews/Reviews.jsx'
import { Footer } from "./components/layout/Footer/Footer.jsx";
import { Privacidad } from './pages/footer/Privacidad.jsx';
import { Terminos } from './pages/footer/Terminos.jsx';
import { DefensaConsumidor } from './pages/footer/DefensaConsumidor.jsx';
import { Refund } from './pages/footer/Refund.jsx';
import { MisTickets } from "./pages/MisTickets/MisTickets.jsx";
import ChangePassword from "./pages/ChangePassword/ChangePassword.jsx";
import Forbidden from "./pages/Forbidden/Forbidden.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import RequireRole from "./routes/RequireRole.jsx";
import RedirectIfAuthenticated from "./routes/RedirectIfAuthenticated.jsx";
import UserDetails from "./pages/UserDetails/UserDetails.jsx";
import EventDetails from "./pages/EventDetails/EventDetails.jsx";

export default function App() {
  const validateSession = useAuthStore((state) => state.validateSession);

  // Validate session on app mount
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  return (
    <BrowserRouter>
      <Header />
      <main style={{ minHeight: "80vh", padding: "2rem" }}>
        <Routes>
          {/* guest-only */}
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* admin-only */}
          <Route element={<RequireRole roles={["ADMIN"]} />}>
            <Route path="/administration" element={<Administration />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Route>

          {/* any authed-only (example) */}
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/mistickets" element={<MisTickets />} />
            <Route path="/profile/edit" element={<EditUser />} />
            <Route path="/perfil/cambiar-password" element={<ChangePassword />} />
          </Route>

          {/* public */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/reviews" element={<Reviews />} />
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
  );
}

