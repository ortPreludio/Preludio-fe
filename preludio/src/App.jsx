import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/auth.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Header } from "./components/layout/Header.jsx";
import { Administration } from "./pages/Administration.jsx";

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
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
