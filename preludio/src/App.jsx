import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./state/auth.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Header } from "./components/layout/Header.jsx";

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
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
