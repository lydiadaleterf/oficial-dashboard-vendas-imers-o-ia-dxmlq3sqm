-- Enable RLS on target tables
ALTER TABLE public.dashboard_diario_imersao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funil_skip_vs_lancamento_interno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_vendedor_diario_imersao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas_fechadas_agendamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entradas_sem_vaga_hubspot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_imersao_detalhado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funil_skip_imersao_diario ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to ensure idempotency
DROP POLICY IF EXISTS "authenticated_select_dashboard" ON public.dashboard_diario_imersao;
DROP POLICY IF EXISTS "authenticated_select_funil" ON public.funil_skip_vs_lancamento_interno;
DROP POLICY IF EXISTS "authenticated_select_vendas" ON public.vendas_vendedor_diario_imersao;
DROP POLICY IF EXISTS "authenticated_select_vagas" ON public.vagas_fechadas_agendamento;
DROP POLICY IF EXISTS "authenticated_select_entradas" ON public.entradas_sem_vaga_hubspot;
DROP POLICY IF EXISTS "authenticated_select_transacoes" ON public.transacoes_imersao_detalhado;
DROP POLICY IF EXISTS "authenticated_select_funil_diario" ON public.funil_skip_imersao_diario;

-- Create SELECT policies for authenticated users
CREATE POLICY "authenticated_select_dashboard" ON public.dashboard_diario_imersao
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_funil" ON public.funil_skip_vs_lancamento_interno
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_vendas" ON public.vendas_vendedor_diario_imersao
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_vagas" ON public.vagas_fechadas_agendamento
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_entradas" ON public.entradas_sem_vaga_hubspot
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_transacoes" ON public.transacoes_imersao_detalhado
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_funil_diario" ON public.funil_skip_imersao_diario
  FOR SELECT TO authenticated USING (true);

-- Seed Initial Admin User
DO $DO_BLOCK$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lydia@adapta.org') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'lydia@adapta.org',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Lydia"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;
END $DO_BLOCK$;
