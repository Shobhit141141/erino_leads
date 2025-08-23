import { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useAuth();
  const value = useMemo(() => ({
    user: auth.data,
    isLoading: auth.isLoading,
    isAuthenticated: !!auth.data,
    refetch: auth.refetch,
  }), [auth.data, auth.isLoading, auth.refetch]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
