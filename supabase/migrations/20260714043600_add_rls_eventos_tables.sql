-- Enable RLS on supabase_eventos_public tables
ALTER TABLE public.supabase_eventos_public_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supabase_eventos_public_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supabase_eventos_public_event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supabase_eventos_public_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to ensure idempotency
DROP POLICY IF EXISTS "authenticated_select_companies" ON public.supabase_eventos_public_companies;
DROP POLICY IF EXISTS "authenticated_select_credits" ON public.supabase_eventos_public_credits;
DROP POLICY IF EXISTS "authenticated_select_event_templates" ON public.supabase_eventos_public_event_templates;
DROP POLICY IF EXISTS "authenticated_select_registrations" ON public.supabase_eventos_public_registrations;

-- Create SELECT policies for authenticated users
CREATE POLICY "authenticated_select_companies" ON public.supabase_eventos_public_companies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_credits" ON public.supabase_eventos_public_credits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_event_templates" ON public.supabase_eventos_public_event_templates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_registrations" ON public.supabase_eventos_public_registrations
  FOR SELECT TO authenticated USING (true);
