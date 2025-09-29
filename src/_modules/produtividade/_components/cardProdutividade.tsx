import { Card, CardContent } from "@/_shared/components/ui/card";
import { Badge } from "@/_shared/components/ui/badge";
import { BuscarProdutividadeQuery } from "@/_services/graphql/produtividade/getProdutividade.graphql";
import { formatTime } from "@/_shared/utils/formatTime";
import { formatDate } from "@/_shared/utils/formaData";
import { getStatusColor } from "@/_shared/utils/gerColorStatus";
import { formatName } from "@/_shared/utils/formatName";  
import TimelineDemandaModal from "./timeLineProdutividade";
import { useState } from "react";
type ProdutividadeArray = BuscarProdutividadeQuery['produtividade'][number]

type CardProdutividadeProps = {
  produtividade: ProdutividadeArray;
}

export function CardProdutividade({ produtividade }: CardProdutividadeProps) {
  const [open, setOpen] = useState(false)

  return (
    <TimelineDemandaModal
      key={produtividade.idDemanda}
      paleteId={produtividade.idDemanda.toString()}
      open={open}
      setOpen={setOpen}
    >
      <Card className="hover:shadow-sm transition-shadow p-1 duration-200 mb-2">
        <CardContent className="px-3 py-1">
          <div className="flex items-center justify-between">
            {/* ID e Info Principal */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold text-gray-900">
                  #{produtividade.idDemanda}
                </span>
                <span className="text-xs text-gray-500">
                  {produtividade.centerId}
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-medium text-gray-900 truncate">
                  {formatName(produtividade.nomeFuncionario)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(produtividade.inicio)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {produtividade.empresa}
                </span>
                <span className="text-xs text-gray-500">
                  {produtividade.processo}
                </span>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="flex items-center gap-6">
              {/* Caixas */}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {produtividade.caixas.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Caixas</div>
              </div>

              {/* Unidades */}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {produtividade.unidades.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Unid.</div>
              </div>

              {/* Visitas */}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {produtividade.visitas}
                </div>
                <div className="text-xs text-gray-500">Vis.</div>
              </div>

              {/* Produtividade */}
              <div className="text-right">
                <div className="text-sm font-semibold text-green-700">
                  {produtividade.produtividade.toFixed(1)}/h
                </div>
                <div className="text-xs text-gray-500">Produt.</div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-end gap-1">
                <Badge className={`${getStatusColor(produtividade.statusDemanda)} text-xs px-2 py-1`}>
                  {produtividade.statusDemanda}
                </Badge>
                <span className="text-xs text-gray-500">
                  {produtividade.turno}
                </span>
              </div>
            </div>
          </div>

          {/* Linha inferior com tempos */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="text-gray-600 dark:text-gray-400">
                {formatDate(produtividade.inicio)}
                {produtividade.fim && formatDate(produtividade.fim)
                  && ` → ${formatDate(produtividade.fim)}`}
              </span>
              <span>Total: {formatTime(produtividade.tempoTotal)}</span>
              <span>Trabalhado: {formatTime(produtividade.tempoTrabalhado)}</span>
              <span>Pausas: {formatTime(produtividade.tempoPausas)} ({produtividade.pausas}x)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Paletes: {produtividade.paletes}</span>
                <span>Segmento: {produtividade.segmento}</span>
                <span>ID: {produtividade.funcionarioId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TimelineDemandaModal>
  )
}