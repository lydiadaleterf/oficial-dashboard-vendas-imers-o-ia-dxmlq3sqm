-- Seed dashboard_diario_imersao with both funnels across 14 days
INSERT INTO public.dashboard_diario_imersao (dia, entradas_realizadas, vagas_fechadas, receita_fechada, funil) VALUES
  ('2026-07-01', 12, 3, 27000, 'Skip'),
  ('2026-07-01',  5, 1,  9000, 'Lançamento Interno'),
  ('2026-07-02', 10, 2, 18000, 'Skip'),
  ('2026-07-02',  7, 2, 18000, 'Lançamento Interno'),
  ('2026-07-03', 15, 4, 36000, 'Skip'),
  ('2026-07-03',  4, 1,  9000, 'Lançamento Interno'),
  ('2026-07-04',  8, 2, 18000, 'Skip'),
  ('2026-07-04',  6, 2, 18000, 'Lançamento Interno'),
  ('2026-07-05', 11, 3, 27000, 'Skip'),
  ('2026-07-05',  5, 1,  9000, 'Lançamento Interno'),
  ('2026-07-06',  9, 2, 18000, 'Skip'),
  ('2026-07-06',  8, 2, 18000, 'Lançamento Interno'),
  ('2026-07-07', 14, 3, 27000, 'Skip'),
  ('2026-07-07',  4, 1,  9000, 'Lançamento Interno'),
  ('2026-07-08', 10, 2, 18000, 'Skip'),
  ('2026-07-08',  6, 1,  9000, 'Lançamento Interno'),
  ('2026-07-09', 13, 3, 27000, 'Skip'),
  ('2026-07-09',  5, 1,  9000, 'Lançamento Interno'),
  ('2026-07-10', 11, 3, 27000, 'Skip'),
  ('2026-07-10',  7, 2, 18000, 'Lançamento Interno'),
  ('2026-07-11',  9, 2, 18000, 'Skip'),
  ('2026-07-11',  4, 1,  9000, 'Lançamento Interno'),
  ('2026-07-12', 12, 3, 27000, 'Skip'),
  ('2026-07-12',  6, 2, 18000, 'Lançamento Interno'),
  ('2026-07-13', 10, 2, 18000, 'Skip'),
  ('2026-07-13',  5, 1,  9000, 'Lançamento Interno'),
  ('2026-07-14',  8, 2, 18000, 'Skip'),
  ('2026-07-14',  4, 1,  9000, 'Lançamento Interno')
ON CONFLICT (dia, funil) DO NOTHING;

-- Seed funil_skip_vs_lancamento_interno with Lançamento Interno sellers
INSERT INTO public.funil_skip_vs_lancamento_interno
  (funil, venda_produto1, venda_entrada, vagas_fechadas, self_service_qtd, self_service_pct, vendedor_qtd, vendedor_pct, vendedor, vendas_do_vendedor)
VALUES
  ('Lançamento Interno', 80, 76, 19, 10, 13.1, 9, 11.8, 'Ana Paula', 5),
  ('Lançamento Interno', 80, 76, 19, 10, 13.1, 9, 11.8, 'Carlos Silva', 4)
ON CONFLICT (funil, vendedor) DO NOTHING;

-- Seed vendas_vendedor_diario_imersao with Lançamento Interno data
INSERT INTO public.vendas_vendedor_diario_imersao (dia, vendedor, vendas, funil) VALUES
  ('2026-07-01', 'Ana Paula', 1, 'Lançamento Interno'),
  ('2026-07-02', 'Ana Paula', 1, 'Lançamento Interno'),
  ('2026-07-03', 'Ana Paula', 0, 'Lançamento Interno'),
  ('2026-07-04', 'Ana Paula', 1, 'Lançamento Interno'),
  ('2026-07-05', 'Ana Paula', 0, 'Lançamento Interno'),
  ('2026-07-06', 'Ana Paula', 1, 'Lançamento Interno'),
  ('2026-07-07', 'Ana Paula', 0, 'Lançamento Interno'),
  ('2026-07-08', 'Ana Paula', 1, 'Lançamento Interno'),
  ('2026-07-09', 'Ana Paula', 0, 'Lançamento Interno'),
  ('2026-07-10', 'Ana Paula', 1, 'Lançamento Interno'),
  ('2026-07-01', 'Carlos Silva', 0, 'Lançamento Interno'),
  ('2026-07-02', 'Carlos Silva', 1, 'Lançamento Interno'),
  ('2026-07-04', 'Carlos Silva', 1, 'Lançamento Interno'),
  ('2026-07-06', 'Carlos Silva', 1, 'Lançamento Interno'),
  ('2026-07-10', 'Carlos Silva', 1, 'Lançamento Interno'),
  ('2026-07-12', 'Carlos Silva', 1, 'Lançamento Interno')
ON CONFLICT (dia, vendedor, funil) DO NOTHING;
