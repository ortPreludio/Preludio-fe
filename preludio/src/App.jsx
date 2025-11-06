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


function RequireAuth({ children }) {
  const { token } = useAuth();
  const loc = useLocation();
  if (!token) {
    const backTo = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?returnTo=${backTo}`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main style={{ minHeight: "80vh", padding: "2rem" }}>
          <Routes>
            {/* 1. RUTAS PÚBLICAS Y DE AUTENTICACIÓN */}
            <Route path="/" element={<Home />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             
             {/* 2. RUTAS DE INFORMACIÓN (QUE ESTABAN BLOQUEADAS) */}
            <Route path="/comollegar" element={<ComoLlegar />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/faq" element={<Faq />} />

            {/* 3. RUTAS PROTEGIDAS (Usando RequireAuth) */}
            <Route 
              path="/administration" 
              element={<RequireAuth><Administration /></RequireAuth>} 
            />

            {/* 4. RUTA COMODÍN (DEBE IR ÚLTIMA) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
