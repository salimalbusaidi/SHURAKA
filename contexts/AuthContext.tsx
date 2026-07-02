// Powered by OnSpace.AI - Real Supabase Auth with OTP support
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
  // OTP Login (primary)
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  verifyOTP: (email: string, token: string) => Promise<{ success: boolean; role?: UserRole; error?: string; code?: string }>;
  // Registration
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  // Logout & utilities
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
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

  // ── OTP: Send ──────────────────────────────────────────────────
  const sendOTP = async (email: string): Promise<{ success: boolean; error?: string; code?: string }> => {
    try {
      const trimmedEmail = email.trim().toLowerCase();

      // Call our Edge Function which validates email exists first
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: trimmedEmail },
      });

      if (error) {
        // Try to extract detailed error from FunctionsHttpError
        let errorMessage = 'تعذر إرسال رمز التحقق، حاول مرة أخرى';
        let code = 'SEND_FAILED';
        try {
          const text = await (error as any).context?.text?.();
          if (text) {
            const parsed = JSON.parse(text);
            errorMessage = parsed.error || errorMessage;
            code = parsed.code || code;
          }
        } catch (_) {}
        return { success: false, error: errorMessage, code };
      }

      if (data?.error) {
        return { success: false, error: data.error, code: data.code };
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'تعذر إرسال رمز التحقق، تحقق من اتصالك بالإنترنت' };
    }
  };

  // ── OTP: Verify ────────────────────────────────────────────────
  const verifyOTP = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; role?: UserRole; error?: string; code?: string }> => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedToken = token.trim();

      // Call our Edge Function for verification
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email: trimmedEmail, token: trimmedToken },
      });

      if (error) {
        let errorMessage = 'رمز التحقق غير صحيح';
        let code = 'OTP_INVALID';
        try {
          const text = await (error as any).context?.text?.();
          if (text) {
            const parsed = JSON.parse(text);
            errorMessage = parsed.error || errorMessage;
            code = parsed.code || code;
          }
        } catch (_) {}
        return { success: false, error: errorMessage, code };
      }

      if (data?.error) {
        return { success: false, error: data.error, code: data.code };
      }

      if (data?.session) {
        // Set the session in Supabase client so auth state updates
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        const role = (data.user?.role as UserRole) || 'business_owner';
        if (data.user) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role,
            avatar: data.user.avatar,
          });
        }
        return { success: true, role };
      }

      return { success: false, error: 'حدث خطأ في تسجيل الدخول' };
    } catch (e: any) {
      return { success: false, error: 'تعذر التحقق من الرمز، تحقق من اتصالك بالإنترنت' };
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

  // ── Google OAuth ───────────────────────────────────────────────
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'shuraka://auth/callback' },
      });
      if (error) return { success: false, error: translateAuthError(error.message) };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: translateAuthError(e.message) };
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
      sendOTP,
      verifyOTP,
      register,
      logout,
      loginWithGoogle,
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
