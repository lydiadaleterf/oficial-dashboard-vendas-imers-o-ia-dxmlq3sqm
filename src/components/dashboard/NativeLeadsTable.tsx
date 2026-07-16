import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdaptaLead } from '@/services/adapta-native'
import { dealStageBadgeClass } from '@/lib/deal-stage-colors'
import { formatDate } from '@/lib/format'

interface NativeLeadsTableProps {
  leads: AdaptaLead[]
}

export function NativeLeadsTable({ leads }: NativeLeadsTableProps) {
  return (
    <div className="max-h-[600px] overflow-auto rounded-lg border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50 sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-xs">Deal ID</TableHead>
            <TableHead className="text-xs">Origem Primária</TableHead>
            <TableHead className="text-xs">Origem Secundária</TableHead>
            <TableHead className="text-xs">UTM Source</TableHead>
            <TableHead className="text-xs">Stage</TableHead>
            <TableHead className="text-xs">Data Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead.deal_id} className="hover:bg-slate-50/80">
                <TableCell className="text-xs font-mono text-slate-600">{lead.deal_id}</TableCell>
                <TableCell className="text-xs text-slate-700">
                  {lead.origem_primaria || '-'}
                </TableCell>
                <TableCell className="text-xs text-slate-700">
                  {lead.origem_secundaria || '-'}
                </TableCell>
                <TableCell className="text-xs text-slate-700">{lead.utm_source || '-'}</TableCell>
                <TableCell>
                  {lead.dealstage ? (
                    <Badge variant="secondary" className={dealStageBadgeClass(lead.dealstage)}>
                      {lead.dealstage}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {formatDate(lead.data_criacao)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                Nenhum lead encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
