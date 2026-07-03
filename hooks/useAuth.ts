// Powered by OnSpace.AI - useAuth hook
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return {
    user: ctx.user,
    isAuthenticated: ctx.isAuthenticated,
    isLoading: ctx.isLoading,
    register: ctx.register,
    loginWithPassword: ctx.loginWithPassword,
    resetPassword: ctx.resetPassword,
    logout: ctx.logout,
    updateUser: ctx.updateUser,
  };
}
