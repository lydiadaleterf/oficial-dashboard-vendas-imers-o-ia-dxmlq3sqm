// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      dashboard_diario_imersao: {
        Row: {
          dia: string
          entradas_realizadas: number | null
          receita_fechada: number | null
          vagas_fechadas: number | null
        }
        Insert: {
          dia: string
          entradas_realizadas?: number | null
          receita_fechada?: number | null
          vagas_fechadas?: number | null
        }
        Update: {
          dia?: string
          entradas_realizadas?: number | null
          receita_fechada?: number | null
          vagas_fechadas?: number | null
        }
        Relationships: []
      }
      entradas_sem_vaga_hubspot: {
        Row: {
          deal_id: string | null
          dealname: string | null
          dealstage: string | null
          doc: string | null
          dt_entrada: string | null
          email: string
          link_hubspot: string | null
          nome: string | null
        }
        Insert: {
          deal_id?: string | null
          dealname?: string | null
          dealstage?: string | null
          doc?: string | null
          dt_entrada?: string | null
          email: string
          link_hubspot?: string | null
          nome?: string | null
        }
        Update: {
          deal_id?: string | null
          dealname?: string | null
          dealstage?: string | null
          doc?: string | null
          dt_entrada?: string | null
          email?: string
          link_hubspot?: string | null
          nome?: string | null
        }
        Relationships: []
      }
      funil_skip_imersao_diario: {
        Row: {
          conversao_im_entrada_pct: number | null
          conversao_skip_entrada_pct: number | null
          conversao_skip_vaga_pct: number | null
          dia: string
          venda_imersao_activity: number | null
          vendas_entrada: number | null
          vendas_skip: number | null
        }
        Insert: {
          conversao_im_entrada_pct?: number | null
          conversao_skip_entrada_pct?: number | null
          conversao_skip_vaga_pct?: number | null
          dia: string
          venda_imersao_activity?: number | null
          vendas_entrada?: number | null
          vendas_skip?: number | null
        }
        Update: {
          conversao_im_entrada_pct?: number | null
          conversao_skip_entrada_pct?: number | null
          conversao_skip_vaga_pct?: number | null
          dia?: string
          venda_imersao_activity?: number | null
          vendas_entrada?: number | null
          vendas_skip?: number | null
        }
        Relationships: []
      }
      funil_skip_vs_lancamento_interno: {
        Row: {
          funil: string
          self_service_pct: number | null
          self_service_qtd: number | null
          vagas_fechadas: number | null
          venda_entrada: number | null
          venda_produto1: number | null
          vendas_do_vendedor: number | null
          vendedor: string
          vendedor_pct: number | null
          vendedor_qtd: number | null
        }
        Insert: {
          funil: string
          self_service_pct?: number | null
          self_service_qtd?: number | null
          vagas_fechadas?: number | null
          venda_entrada?: number | null
          venda_produto1?: number | null
          vendas_do_vendedor?: number | null
          vendedor: string
          vendedor_pct?: number | null
          vendedor_qtd?: number | null
        }
        Update: {
          funil?: string
          self_service_pct?: number | null
          self_service_qtd?: number | null
          vagas_fechadas?: number | null
          venda_entrada?: number | null
          venda_produto1?: number | null
          vendas_do_vendedor?: number | null
          vendedor?: string
          vendedor_pct?: number | null
          vendedor_qtd?: number | null
        }
        Relationships: []
      }
      supabase_eventos_public_companies: {
        Row: {
          _nekt_sync_at: string | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          guru_contact_id: string | null
          guru_synced_at: string | null
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          _nekt_sync_at?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          guru_contact_id?: string | null
          guru_synced_at?: string | null
          id: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          _nekt_sync_at?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          guru_contact_id?: string | null
          guru_synced_at?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      supabase_eventos_public_credits: {
        Row: {
          _nekt_sync_at: string | null
          company_id: string | null
          created_at: string | null
          expires_at: string | null
          external_ref: string | null
          granted_at: string | null
          guru_product_id: string | null
          guru_transaction_id: string | null
          id: string
          source: string | null
          status: string | null
          value_cents: number | null
        }
        Insert: {
          _nekt_sync_at?: string | null
          company_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          external_ref?: string | null
          granted_at?: string | null
          guru_product_id?: string | null
          guru_transaction_id?: string | null
          id: string
          source?: string | null
          status?: string | null
          value_cents?: number | null
        }
        Update: {
          _nekt_sync_at?: string | null
          company_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          external_ref?: string | null
          granted_at?: string | null
          guru_product_id?: string | null
          guru_transaction_id?: string | null
          id?: string
          source?: string | null
          status?: string | null
          value_cents?: number | null
        }
        Relationships: []
      }
      supabase_eventos_public_event_templates: {
        Row: {
          _nekt_sync_at: string | null
          capacity: number | null
          created_at: string | null
          csat_intro: string | null
          csat_redirect_url: string | null
          description: string | null
          duration_days: number | null
          id: string
          location: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          _nekt_sync_at?: string | null
          capacity?: number | null
          created_at?: string | null
          csat_intro?: string | null
          csat_redirect_url?: string | null
          description?: string | null
          duration_days?: number | null
          id: string
          location?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          _nekt_sync_at?: string | null
          capacity?: number | null
          created_at?: string | null
          csat_intro?: string | null
          csat_redirect_url?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          location?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      supabase_eventos_public_registrations: {
        Row: {
          _nekt_sync_at: string | null
          cancel_reason: string | null
          cancel_reason_category: string | null
          cancel_reason_options: string[] | null
          class_id: string | null
          cnpj: string | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          credit_id: string | null
          custom_fields: string | null
          event_template_id: string | null
          guru_verified: boolean | null
          id: string
          participant_email: string | null
          participant_name: string | null
          participant_phone: string | null
          reschedule_count: number | null
          reschedule_reason: string | null
          reschedule_reason_category: string | null
          reschedule_reason_options: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          _nekt_sync_at?: string | null
          cancel_reason?: string | null
          cancel_reason_category?: string | null
          cancel_reason_options?: string[] | null
          class_id?: string | null
          cnpj?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_id?: string | null
          custom_fields?: string | null
          event_template_id?: string | null
          guru_verified?: boolean | null
          id: string
          participant_email?: string | null
          participant_name?: string | null
          participant_phone?: string | null
          reschedule_count?: number | null
          reschedule_reason?: string | null
          reschedule_reason_category?: string | null
          reschedule_reason_options?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          _nekt_sync_at?: string | null
          cancel_reason?: string | null
          cancel_reason_category?: string | null
          cancel_reason_options?: string[] | null
          class_id?: string | null
          cnpj?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_id?: string | null
          custom_fields?: string | null
          event_template_id?: string | null
          guru_verified?: boolean | null
          id?: string
          participant_email?: string | null
          participant_name?: string | null
          participant_phone?: string | null
          reschedule_count?: number | null
          reschedule_reason?: string | null
          reschedule_reason_category?: string | null
          reschedule_reason_options?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transacoes_imersao_detalhado: {
        Row: {
          cidade: string | null
          data_compra: string | null
          doc: string | null
          email: string | null
          estado: string | null
          is_vaga_fechada: boolean | null
          link_guru: string
          link_hubspot: string | null
          nome: string | null
          oferta: string | null
          status: string | null
          valor_pago: number | null
        }
        Insert: {
          cidade?: string | null
          data_compra?: string | null
          doc?: string | null
          email?: string | null
          estado?: string | null
          is_vaga_fechada?: boolean | null
          link_guru: string
          link_hubspot?: string | null
          nome?: string | null
          oferta?: string | null
          status?: string | null
          valor_pago?: number | null
        }
        Update: {
          cidade?: string | null
          data_compra?: string | null
          doc?: string | null
          email?: string | null
          estado?: string | null
          is_vaga_fechada?: boolean | null
          link_guru?: string
          link_hubspot?: string | null
          nome?: string | null
          oferta?: string | null
          status?: string | null
          valor_pago?: number | null
        }
        Relationships: []
      }
      vagas_fechadas_agendamento: {
        Row: {
          class_id: string | null
          data_agendamento: string | null
          data_vaga_fechada: string | null
          doc: string | null
          email: string
          link_guru: string | null
          nome: string | null
          status_agendamento: string | null
        }
        Insert: {
          class_id?: string | null
          data_agendamento?: string | null
          data_vaga_fechada?: string | null
          doc?: string | null
          email: string
          link_guru?: string | null
          nome?: string | null
          status_agendamento?: string | null
        }
        Update: {
          class_id?: string | null
          data_agendamento?: string | null
          data_vaga_fechada?: string | null
          doc?: string | null
          email?: string
          link_guru?: string | null
          nome?: string | null
          status_agendamento?: string | null
        }
        Relationships: []
      }
      vendas_vendedor_diario_imersao: {
        Row: {
          dia: string
          vendas: number | null
          vendedor: string
        }
        Insert: {
          dia: string
          vendas?: number | null
          vendedor: string
        }
        Update: {
          dia?: string
          vendas?: number | null
          vendedor?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
