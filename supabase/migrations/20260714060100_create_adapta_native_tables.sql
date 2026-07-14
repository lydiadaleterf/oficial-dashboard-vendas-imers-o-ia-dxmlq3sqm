CREATE TABLE IF NOT EXISTS public.adapta_summit_vendas_diario (
  dia DATE NOT NULL,
  oferta TEXT,
  status TEXT,
  vendas INTEGER DEFAULT 0,
  receita NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.adapta_case_leads_hubspot (
  deal_id TEXT PRIMARY KEY,
  origem_primaria TEXT,
  origem_secundaria TEXT,
  utm_source TEXT,
  dealstage TEXT,
  data_criacao TIMESTAMPTZ
);

ALTER TABLE public.adapta_summit_vendas_diario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adapta_case_leads_hubspot ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_adapta_vendas" ON public.adapta_summit_vendas_diario;
CREATE POLICY "authenticated_select_adapta_vendas" ON public.adapta_summit_vendas_diario
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_select_adapta_leads" ON public.adapta_case_leads_hubspot;
CREATE POLICY "authenticated_select_adapta_leads" ON public.adapta_case_leads_hubspot
  FOR SELECT TO authenticated USING (true);

DO $$
DECLARE
  i INT;
  ops TEXT[] := ARRAY['LinkedIn Ads', 'Google Ads', 'Instagram', 'Indicação', 'Orgânico', 'Webinar', 'Evento Presencial', 'Parceria'];
  oss TEXT[] := ARRAY['Post Orgânico', 'Story', 'Email', 'WhatsApp', 'Landing Page', 'Direto', 'Webinar Replay'];
  utms TEXT[] := ARRAY['linkedin', 'google', 'instagram', 'indicacao', 'organico', 'webinar', 'evento', 'parceria'];
  dstages TEXT[] := ARRAY['novo lead', 'tentativa 01', 'conectado', 'reunião agendada', 'em negociação', 'ganho', 'perdido'];
BEGIN
  FOR i IN 1..104 LOOP
    INSERT INTO public.adapta_case_leads_hubspot (deal_id, origem_primaria, origem_secundaria, utm_source, dealstage, data_criacao)
    VALUES (
      'lead-' || LPAD(i::TEXT, 4, '0'),
      ops[CASE WHEN i <= 30 THEN 1 WHEN i <= 55 THEN 3 WHEN i <= 75 THEN 5 WHEN i <= 88 THEN 4 WHEN i <= 96 THEN 6 WHEN i <= 101 THEN 2 WHEN i <= 103 THEN 7 ELSE 8 END],
      oss[((i - 1) % 7) + 1],
      utms[CASE WHEN i <= 30 THEN 1 WHEN i <= 55 THEN 3 WHEN i <= 75 THEN 5 WHEN i <= 88 THEN 4 WHEN i <= 96 THEN 6 WHEN i <= 101 THEN 2 WHEN i <= 103 THEN 7 ELSE 8 END],
      dstages[CASE WHEN i <= 40 THEN 1 WHEN i <= 60 THEN 2 WHEN i <= 75 THEN 3 WHEN i <= 85 THEN 4 WHEN i <= 95 THEN 5 WHEN i <= 100 THEN 6 ELSE 7 END],
      NOW() - (i || ' days')::INTERVAL
    )
    ON CONFLICT (deal_id) DO NOTHING;
  END LOOP;
END $$;
