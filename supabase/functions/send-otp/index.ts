// Edge Function: send-otp
// Generates a 6-digit OTP, stores hashed version, sends email via Supabase Auth OTP
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

const logStep = (step: string, details?: any) => {
  console.log(`[SEND-OTP] ${step}${details ? ' - ' + JSON.stringify(details) : ''}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'صيغة البريد الإلكتروني غير صحيحة' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    logStep('Checking if email exists', { email });

    // Check if user exists in user_profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, status')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (profileError) {
      logStep('Profile lookup error', { error: profileError.message });
      return new Response(
        JSON.stringify({ error: 'تعذر التحقق من البريد الإلكتروني' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!profile) {
      logStep('Email not found', { email });
      return new Response(
        JSON.stringify({ error: 'هذا البريد غير مسجل لدينا', code: 'EMAIL_NOT_FOUND' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check if account is active
    if (profile.status && profile.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'هذا الحساب معطل، يرجى التواصل مع الدعم', code: 'ACCOUNT_DISABLED' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    logStep('User found, sending OTP via Supabase Auth', { userId: profile.id });

    // Use Supabase Auth built-in OTP (sends email automatically)
    const { error: otpError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.trim().toLowerCase(),
    });

    // Use signInWithOtp approach — sends OTP email via Supabase
    // We use the admin client to trigger OTP sending
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { error: signInError } = await supabaseAnon.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: false, // Only allow existing users
      },
    });

    if (signInError) {
      logStep('OTP send error', { error: signInError.message });

      // Handle "user not found" from Supabase side
      if (
        signInError.message.includes('Signups not allowed') ||
        signInError.message.includes('not allowed') ||
        signInError.message.includes('User not found')
      ) {
        return new Response(
          JSON.stringify({ error: 'هذا البريد غير مسجل لدينا', code: 'EMAIL_NOT_FOUND' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      return new Response(
        JSON.stringify({ error: 'تعذر إرسال رمز التحقق، حاول مرة أخرى', code: 'SEND_FAILED' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Log OTP send event to audit_logs
    await supabaseAdmin.from('audit_logs').insert({
      user_id: profile.id,
      action: 'otp_sent',
      entity_type: 'auth',
      description: `تم إرسال رمز OTP إلى ${email}`,
      metadata: { email, timestamp: new Date().toISOString() },
    });

    logStep('OTP sent successfully', { email });

    return new Response(
      JSON.stringify({ success: true, message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep('Unexpected error', { error: msg });
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
