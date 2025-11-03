import { useHashRouter } from './router.jsx'
import { AuthProvider } from './state/auth.jsx'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'

export default function App() {
  const { path } = useHashRouter()
  const View = path === '/login' ? Login : path === '/register' ? Register : Home
  return (<AuthProvider><View /></AuthProvider>)
}