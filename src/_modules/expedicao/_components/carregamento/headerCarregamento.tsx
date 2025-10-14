import { QRCodeSVG } from "qrcode.react"
import { memo } from "react"
import { ImpressaoMapaHeader } from "../../services/types/pickingMap";

interface HeaderProps {
  mapa: ImpressaoMapaHeader
}

const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
  <div className={className}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xs font-semibold">{value}</p>
  </div>
)

export const HeaderCarregamento = memo(({ mapa }: HeaderProps) => {

  const pesoTotal = (mapa.pesoCaixa || 0) + (mapa.pesoPalete || 0) + (mapa.pesoUnidade || 0)

  return (
    <div className="mb-3 w-full border border-slate-300 bg-white">
      {/* Cabeçalho Principal */}
      <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5">
        <h1 className="font-bold tracking-wide text-black text-xl">
          MAPA DE CARREGAMENTO
        </h1>
        <h1 className="font-bold tracking-wide text-black text-xl">
          {mapa.segmento}
        </h1>
      </div>

      {/* Corpo do Cabeçalho */}
      <div className="p-3">
        <div className="grid grid-cols-8 gap-2">
          {/* QR Code à esquerda */}
          {mapa.tipo !== 'palete' && (
            <div className="col-span-1 p-2 flex flex-col items-center justify-center text-center">
              <QRCodeSVG value={mapa.paleteId} size={100} />
            </div>
          )}

          {/* Informações Principais */}
          <div className="col-span-7 space-y-2 ml-4">
            {/* Linha única com Placa, Transportadora, Transporte, Rota */}
            <div className="grid grid-cols-4 gap-x-2">
              <InfoItem label="PLACA" value={mapa.placa} />
              <InfoItem label="TRANSPORTADORA" value={mapa.transportadora} />
              <InfoItem label="TRANSPORTE" value={mapa.transportId} />
              <InfoItem label="ROTA" value={mapa.rota} />
            </div>

            {/* Resumo Quantitativo (onde antes ficava transporte/rota) */}
            <div className="flex flex-wrap justify-center border-t pt-2 text-center text-sm font-semibold">
              {(() => {
                const items = []
                if (mapa.tipo === 'palete') {
                  items.push(`${mapa.paletes || 0} PLT`, `${pesoTotal.toFixed(0)}kg PESO TOTAL`)
                } else if (mapa.tipo === 'unidade') {
                  items.push(`${mapa.unidades || 0} UN`, `${pesoTotal.toFixed(2)}kg PESO TOTAL`)
                } else {
                  items.push(`${mapa.caixas || 0} CXS`, `${mapa.unidades || 0} UN`, `${pesoTotal.toFixed(0)}kg PESO TOTAL`)
                }
                return items.map((item, index) => (
                  <span key={index}>
                    {index > 0 && <span className="mx-2 text-muted-foreground">|</span>}
                    {item}
                  </span>
                ))
              })()}
            </div>

            {/* IDs secundários */}
            <div className="flex justify-between px-2">
              <p className="mt-1 text-[10px] tracking-wider">
                idPalete: {mapa.paleteId}
              </p>
              <p className="mt-1 text-[10px] tracking-wider">{mapa.id}</p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais II */}
        {mapa.infoAdicionaisII && (
          <div className="mt-2 border-t pt-2 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground">
                INFO II:
              </span>
              <span className="ml-2">{mapa.infoAdicionaisII}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
