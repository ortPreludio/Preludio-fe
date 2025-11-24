import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore.js";
import { Header } from "../components/layout/Header/Header.jsx";
import { Footer } from "../components/layout/Footer/Footer.jsx";
import { ScrollToTop } from "../utils/ScrollToTop.jsx";
import { AppRouter } from "./AppRouter.jsx";

export default function App() {
  const validateSession = useAuthStore((state) => state.validateSession);

  // Validate session on app mount
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main>
        <AppRouter />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
