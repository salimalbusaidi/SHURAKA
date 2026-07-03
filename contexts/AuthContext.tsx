// Powered by OnSpace.AI - Real Supabase Auth
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseClient } from '@/template';

export type UserRole = 'business_owner' | 'employee' | 'customer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  // Load session on mount
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await loadUserProfile(session.user.id, session.user.email || '');
        }
      } catch (e) {
        console.error('Session load error:', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
        if (mounted) setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        if (mounted) setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('id, username, email, role, phone, avatar_url')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        setUser({
          id: userId,
          name: email.split('@')[0],
          email,
          role: 'business_owner',
        });
        return;
      }

      setUser({
        id: profile.id,
        name: profile.username || email.split('@')[0],
        email: profile.email || email,
        phone: profile.phone,
        role: (profile.role as UserRole) || 'business_owner',
        avatar: profile.avatar_url,
      });
    } catch (e) {
      console.error('Profile load error:', e);
      setUser({ id: userId, name: email.split('@')[0], email, role: 'business_owner' });
    }
  };

  // ── Register ───────────────────────────────────────────────────
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            username: data.name,
            role: data.role || 'business_owner',
            phone: data.phone || '',
          },
        },
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      if (authData.user) {
        await supabase.from('user_profiles').upsert({
          id: authData.user.id,
          email: data.email.trim().toLowerCase(),
          username: data.name,
          role: data.role || 'business_owner',
          phone: data.phone || '',
          status: 'active',
        }, { onConflict: 'id' });

        const needsVerification = !authData.session;
        if (!needsVerification) {
          await loadUserProfile(authData.user.id, data.email);
        }
        return { success: true, needsVerification };
      }
      return { success: false, error: 'فشل إنشاء الحساب' };
    } catch (e: any) {
      return { success: false, error: translateAuthError(e.message) };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const loginWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email || email.trim());
        return { success: true };
      }

      return { success: false, error: 'تعذر تسجيل الدخول، حاول مرة أخرى.' };
    } catch (e: any) {
      return { success: false, error: translateAuthError(e.message) };
    }
  };
  
const resetPassword = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: window.location.origin + '/(auth)/login',
      }
    );

    if (error) {
      return {
        success: false,
        error: translateAuthError(error.message),
      };
    }

    return {
      success: true,
    };
  } catch (e: any) {
    return {
      success: false,
      error: translateAuthError(e.message),
    };
  }
};

  const updateUser = (data: Partial<AuthUser>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      register,
      loginWithPassword,
      resetPassword,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function translateAuthError(msg: string): string {
  if (!msg) return 'حدث خطأ، يرجى المحاولة مرة أخرى';
  if (msg.includes('Invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  if (msg.includes('Email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني أولاً';
  if (msg.includes('User already registered')) return 'البريد الإلكتروني مسجل مسبقًا';
  if (msg.includes('Password should be')) return 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل';
  if (msg.includes('rate limit') || msg.includes('Rate limit')) return 'محاولات كثيرة، يرجى الانتظار قليلاً';
  if (msg.includes('network') || msg.includes('fetch')) return 'خطأ في الشبكة، يرجى التحقق من الاتصال';
  if (msg.includes('Token has expired') || msg.includes('expired')) return 'انتهت صلاحية رمز التحقق';
  if (msg.includes('Invalid token') || msg.includes('invalid')) return 'رمز التحقق غير صحيح';
  if (msg.includes('Signups not allowed')) return 'هذا البريد غير مسجل لدينا';
  return msg;
}
