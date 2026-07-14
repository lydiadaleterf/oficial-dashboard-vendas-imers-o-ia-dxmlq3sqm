-- Fix inflated values for 'Lancamento Interno' funnel across all tables
-- The previous seed migration inserted bloated aggregate values that did not
-- match the real database reference values.

-- 1. Fix funil_skip_vs_lancamento_interno
DELETE FROM public.funil_skip_vs_lancamento_interno WHERE funil = 'Lancamento Interno';

INSERT INTO public.funil_skip_vs_lancamento_interno
  (funil, venda_produto1, venda_entrada, vagas_fechadas, self_service_qtd, self_service_pct, vendedor_qtd, vendedor_pct, vendedor, vendas_do_vendedor)
VALUES
  ('Lancamento Interno', 0, 5, 10, 5, 83.3, 1, 16.7, 'Ana Paula', 1)
ON CONFLICT (funil, vendedor) DO NOTHING;

-- 2. Fix dashboard_diario_imersao (14 days, sums: entradas=5, vagas=10, receita=97000)
DELETE FROM public.dashboard_diario_imersao WHERE funil = 'Lancamento Interno';

INSERT INTO public.dashboard_diario_imersao (dia, entradas_realizadas, vagas_fechadas, receita_fechada, funil) VALUES
  ('2026-07-01', 0, 1,  9000, 'Lancamento Interno'),
  ('2026-07-02', 1, 1,  9000, 'Lancamento Interno'),
  ('2026-07-03', 0, 1, 12000, 'Lancamento Interno'),
  ('2026-07-04', 0, 0,     0, 'Lancamento Interno'),
  ('2026-07-05', 0, 1,  9000, 'Lancamento Interno'),
  ('2026-07-06', 1, 1,  8000, 'Lancamento Interno'),
  ('2026-07-07', 0, 0,     0, 'Lancamento Interno'),
  ('2026-07-08', 0, 1,  9000, 'Lancamento Interno'),
  ('2026-07-09', 1, 1, 10000, 'Lancamento Interno'),
  ('2026-07-10', 1, 1,  9000, 'Lancamento Interno'),
  ('2026-07-11', 0, 0,     0, 'Lancamento Interno'),
  ('2026-07-12', 1, 1,  8000, 'Lancamento Interno'),
  ('2026-07-13', 0, 1, 12000, 'Lancamento Interno'),
  ('2026-07-14', 0, 0,  2000, 'Lancamento Interno')
ON CONFLICT (dia, funil) DO NOTHING;

-- 3. Fix vendas_vendedor_diario_imersao (only 1 sale by Ana Paula)
DELETE FROM public.vendas_vendedor_diario_imersao WHERE funil = 'Lancamento Interno';

INSERT INTO public.vendas_vendedor_diario_imersao (dia, vendedor, vendas, funil) VALUES
  ('2026-07-02', 'Ana Paula', 1, 'Lancamento Interno')
ON CONFLICT (dia, vendedor, funil) DO NOTHING;
