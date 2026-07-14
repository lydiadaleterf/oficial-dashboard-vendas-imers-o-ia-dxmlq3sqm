-- Normalize NULL or empty funil values in dashboard_diario_imersao
UPDATE public.dashboard_diario_imersao
SET funil = 'Skip'
WHERE funil IS NULL OR funil = '';

-- Normalize 'Lancamento Interno' variants to 'Lançamento Interno' (with cedilha)
UPDATE public.dashboard_diario_imersao
SET funil = 'Lançamento Interno'
WHERE funil ILIKE 'lancamento%interno' AND funil <> 'Lançamento Interno';

-- Change PK from (dia) to (dia, funil) so multiple funnels can share the same date
ALTER TABLE public.dashboard_diario_imersao DROP CONSTRAINT IF EXISTS dashboard_diario_imersao_pkey;
ALTER TABLE public.dashboard_diario_imersao ALTER COLUMN funil SET NOT NULL;
ALTER TABLE public.dashboard_diario_imersao ADD PRIMARY KEY (dia, funil);

-- Normalize NULL or empty funil values in vendas_vendedor_diario_imersao
UPDATE public.vendas_vendedor_diario_imersao
SET funil = 'Skip'
WHERE funil IS NULL OR funil = '';

UPDATE public.vendas_vendedor_diario_imersao
SET funil = 'Lançamento Interno'
WHERE funil ILIKE 'lancamento%interno' AND funil <> 'Lançamento Interno';

-- Change PK from (dia, vendedor) to (dia, vendedor, funil) to support multi-funnel data
ALTER TABLE public.vendas_vendedor_diario_imersao DROP CONSTRAINT IF EXISTS vendas_vendedor_diario_imersao_pkey;
ALTER TABLE public.vendas_vendedor_diario_imersao ALTER COLUMN funil SET NOT NULL;
ALTER TABLE public.vendas_vendedor_diario_imersao ADD PRIMARY KEY (dia, vendedor, funil);
