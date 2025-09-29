import { GetOverViewQuery } from "@/_services/graphql/produtividade/getOverView.graphql"
import { CardDashBoard } from "./cardDashBoard"
import { CheckCheck, Package, ChartNoAxesCombined, Boxes, Loader } from "lucide-react"

type OverViewData = GetOverViewQuery['overViewProdutividade']

interface OverViewProps {
  overview: OverViewData | undefined | null
}

export function OverView({ overview }: OverViewProps) {
  // Early return if overview is not available
  if (!overview) {
    return (
      <div className="w-full my-2">
        <div className="flex items-center justify-center p-8 bg-muted/30 border border-border rounded-xl">
          <div className="text-muted-foreground">Dados de overview não disponíveis</div>
        </div>
      </div>
    );
  }
  const formatNumber = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '0'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(numValue) ? '0' : numValue.toLocaleString('pt-BR')
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-1">
      <CardDashBoard type="totalProcessos" title="Total de processos" value={formatNumber(overview?.processos) || 0} icon={<Boxes className="h-8 w-8 text-blue-400" />} />
      <CardDashBoard type="emAndamento" title="Em Andamento" value={formatNumber(overview?.emAndamento) || 0} icon={<Loader className="h-8 w-8 text-amber-400 animate-spin" />} />
      <CardDashBoard type="concluidos" title="Concluidos" value={formatNumber(overview?.concluidos) || 0} icon={<CheckCheck className="h-8 w-8 text-emerald-400" />} />
      <CardDashBoard type="totalCaixas" title="Total de Caixas" value={formatNumber(overview?.totalCaixas) || 0} icon={<Package className="h-8 w-8 text-violet-400" />} />
      <CardDashBoard type="produtividade" title="Produtividade" value={formatNumber(overview?.produtividade) || 0} icon={<ChartNoAxesCombined className="h-8 w-8 text-blue-400" />} />
    </div>
  )
}