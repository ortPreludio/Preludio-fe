import { AppRouter } from './router/index.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

export default function App(){
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
