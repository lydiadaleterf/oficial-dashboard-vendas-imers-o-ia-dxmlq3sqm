-- Fix accented 'Lançamento Interno' to unaccented 'Lancamento Interno' in all tables
-- The application sends unaccented technical values as filter parameters,
-- but seed data inserted accented values causing 0-row query results.

-- Tables where funil is NOT part of PK (simple update)
UPDATE public.entradas_sem_vaga_hubspot
SET funil = 'Lancamento Interno'
WHERE funil = 'Lançamento Interno';

UPDATE public.vagas_fechadas_agendamento
SET funil = 'Lancamento Interno'
WHERE funil = 'Lançamento Interno';

UPDATE public.transacoes_imersao_detalhado
SET funil = 'Lancamento Interno'
WHERE funil = 'Lançamento Interno';

-- dashboard_diario_imersao: PK (dia, funil) — merge accented into unaccented
DO $$
BEGIN
  UPDATE public.dashboard_diario_imersao d
  SET
    entradas_realizadas = COALESCE(d.entradas_realizadas, 0) + COALESCE(a.entradas_realizadas, 0),
    vagas_fechadas = COALESCE(d.vagas_fechadas, 0) + COALESCE(a.vagas_fechadas, 0),
    receita_fechada = COALESCE(d.receita_fechada, 0) + COALESCE(a.receita_fechada, 0)
  FROM public.dashboard_diario_imersao a
  WHERE a.funil = 'Lançamento Interno'
    AND d.funil = 'Lancamento Interno'
    AND d.dia = a.dia;

  DELETE FROM public.dashboard_diario_imersao
  WHERE funil = 'Lançamento Interno'
    AND dia IN (
      SELECT dia FROM public.dashboard_diario_imersao WHERE funil = 'Lancamento Interno'
    );

  UPDATE public.dashboard_diario_imersao
  SET funil = 'Lancamento Interno'
  WHERE funil = 'Lançamento Interno';
END $$;

-- funil_skip_vs_lancamento_interno: PK (funil, vendedor) — merge accented into unaccented
DO $$
BEGIN
  UPDATE public.funil_skip_vs_lancamento_interno d
  SET
    venda_produto1 = GREATEST(COALESCE(d.venda_produto1, 0), COALESCE(a.venda_produto1, 0)),
    venda_entrada = GREATEST(COALESCE(d.venda_entrada, 0), COALESCE(a.venda_entrada, 0)),
    vagas_fechadas = GREATEST(COALESCE(d.vagas_fechadas, 0), COALESCE(a.vagas_fechadas, 0)),
    self_service_qtd = GREATEST(COALESCE(d.self_service_qtd, 0), COALESCE(a.self_service_qtd, 0)),
    self_service_pct = GREATEST(COALESCE(d.self_service_pct, 0), COALESCE(a.self_service_pct, 0)),
    vendedor_qtd = GREATEST(COALESCE(d.vendedor_qtd, 0), COALESCE(a.vendedor_qtd, 0)),
    vendedor_pct = GREATEST(COALESCE(d.vendedor_pct, 0), COALESCE(a.vendedor_pct, 0)),
    vendas_do_vendedor = GREATEST(COALESCE(d.vendas_do_vendedor, 0), COALESCE(a.vendas_do_vendedor, 0))
  FROM public.funil_skip_vs_lancamento_interno a
  WHERE a.funil = 'Lançamento Interno'
    AND d.funil = 'Lancamento Interno'
    AND d.vendedor = a.vendedor;

  DELETE FROM public.funil_skip_vs_lancamento_interno
  WHERE funil = 'Lançamento Interno'
    AND vendedor IN (
      SELECT vendedor FROM public.funil_skip_vs_lancamento_interno WHERE funil = 'Lancamento Interno'
    );

  UPDATE public.funil_skip_vs_lancamento_interno
  SET funil = 'Lancamento Interno'
  WHERE funil = 'Lançamento Interno';
END $$;

-- vendas_vendedor_diario_imersao: PK (dia, vendedor, funil) — merge accented into unaccented
DO $$
BEGIN
  UPDATE public.vendas_vendedor_diario_imersao d
  SET vendas = COALESCE(d.vendas, 0) + COALESCE(a.vendas, 0)
  FROM public.vendas_vendedor_diario_imersao a
  WHERE a.funil = 'Lançamento Interno'
    AND d.funil = 'Lancamento Interno'
    AND d.dia = a.dia
    AND d.vendedor = a.vendedor;

  DELETE FROM public.vendas_vendedor_diario_imersao
  WHERE funil = 'Lançamento Interno'
    AND (dia, vendedor) IN (
      SELECT dia, vendedor
      FROM public.vendas_vendedor_diario_imersao
      WHERE funil = 'Lancamento Interno'
    );

  UPDATE public.vendas_vendedor_diario_imersao
  SET funil = 'Lancamento Interno'
  WHERE funil = 'Lançamento Interno';
END $$;
