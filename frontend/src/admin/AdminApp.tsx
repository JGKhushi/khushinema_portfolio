import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

function Gate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}

/** Root of the /admin single-page area. */
export function AdminApp() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
