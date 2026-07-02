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
    // OTP methods
    sendOTP: ctx.sendOTP,
    verifyOTP: ctx.verifyOTP,
    // Registration
    register: ctx.register,
    // Social
    loginWithGoogle: ctx.loginWithGoogle,
    // Logout & utils
    logout: ctx.logout,
    updateUser: ctx.updateUser,
  };
}
