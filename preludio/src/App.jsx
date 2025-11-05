import { Router } from './router/index.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Router
        routes={[
          { path: '/', component: Home },
          { path: '/login', component: Login },
          { path: '/register', component: Register },
        ]}
        fallback={{ component: Home }}
      />
    </AuthProvider>
  );
}
