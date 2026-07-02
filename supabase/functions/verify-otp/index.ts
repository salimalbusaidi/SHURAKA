// Edge Function: verify-otp
// Verifies the OTP token and returns user session + role
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

const logStep = (step: string, details?: any) => {
  console.log(`[VERIFY-OTP] ${step}${details ? ' - ' + JSON.stringify(details) : ''}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: 'البريد الإلكتروني ورمز التحقق مطلوبان' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    logStep('Verifying OTP', { email, tokenLength: token.length });

    // Verify OTP via Supabase Auth
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: verifyData, error: verifyError } = await supabaseAnon.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email',
    });

    if (verifyError || !verifyData.session) {
      logStep('OTP verification failed', { error: verifyError?.message });

      const errMsg = verifyError?.message || '';
      if (errMsg.includes('expired') || errMsg.includes('Token has expired')) {
        return new Response(
          JSON.stringify({ error: 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد', code: 'OTP_EXPIRED' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({ error: 'رمز التحقق غير صحيح', code: 'OTP_INVALID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const userId = verifyData.session.user.id;
    logStep('OTP verified, fetching profile', { userId });

    // Fetch user profile with role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('id, username, email, role, status, phone, avatar_url')
      .eq('id', userId)
      .single();

    // Update last_login_at
    await supabaseAdmin
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);

    // Log to audit_logs
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action: 'login_success',
      entity_type: 'auth',
      description: `تسجيل دخول ناجح عبر OTP`,
      metadata: { method: 'email_otp', email },
    });

    logStep('Login success', { userId, role: profile?.role });

    return new Response(
      JSON.stringify({
        success: true,
        session: {
          access_token: verifyData.session.access_token,
          refresh_token: verifyData.session.refresh_token,
          expires_at: verifyData.session.expires_at,
        },
        user: {
          id: userId,
          email: profile?.email || email,
          name: profile?.username || email.split('@')[0],
          role: profile?.role || 'business_owner',
          phone: profile?.phone,
          avatar: profile?.avatar_url,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep('Unexpected error', { error: msg });
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
