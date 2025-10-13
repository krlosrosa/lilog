import type { ImpressaoMapaHeader } from "../../../services/types/pickingMap"
import { QRCodeSVG } from "qrcode.react"
import { memo } from "react"

interface HeaderProps {
  mapa: ImpressaoMapaHeader
  tipo?: 'CLIENTE' | 'TRANSPORTE'
  exibirCliente?: 'PRIMEIRO' | 'TODOS' | 'NENHUM'
 }

const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
  <div className={className}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xs font-semibold">{value}</p>
  </div>
)

const StatItem = ({ value, label }: { value: React.ReactNode; label: string }) => (
  <div className="text-center">
    <p className="font-bold text-sm">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
)

export const HeaderPicking = memo(({ mapa, tipo, exibirCliente }: HeaderProps) => {

  const getTypeLabel = (tipo: string) => {
    const types = {
      picking: "PICKING",
      unidade: "UNIDADE",
      palete: "PALETE",
      fifo: "FIFO",
    }
    return types[tipo as keyof typeof types] || tipo.toUpperCase()
  }

  const pesoTotal = (mapa.pesoCaixa || 0) + (mapa.pesoPalete || 0) + (mapa.pesoUnidade || 0)

  const idSegregado = mapa.id.match(/\[(.*?)\]/)

  return (
    <div className="mb-3 w-full border border-slate-300 bg-white">
      {/* Cabeçalho Principal */}
      <div className="flex text-xl items-center justify-between bg-gray-800 px-3 py-1.5 text-white print:bg-black">
        <h1 className="font-bold tracking-wide">
          MAPA DE SEPARAÇÃO - {mapa.transportId}{tipo === 'CLIENTE' && `[${mapa.codClientes[0]}]`}{idSegregado && `[${idSegregado[1]}]`} | {mapa.segmento}
        </h1>
        <h1 className="font-bold tracking-wide">
          {getTypeLabel(mapa.tipo)}
        </h1>
      </div>

      {/* Corpo do Cabeçalho */}
      <div className="p-3">
        <div className="grid grid-cols-8 gap-2">
          {/* Informações Principais */}
          <div className="col-span-7 space-y-2">
            {/* Linha 1 */}
            <div className="grid grid-cols-4 gap-x-2">
              <InfoItem label="PLACA" value={mapa.placa} />
              <InfoItem label="TRANSPORTADORA" value={mapa.transportadora} className="col-span-2" />
              <InfoItem label="SEQ" value={mapa.sequencia} />
            </div>
            {/* Linha 2 */}
            <div className="grid grid-cols-4 gap-x-4">
              <InfoItem label="TRANSPORTE" value={mapa.transportId} />
              <InfoItem label="EMPRESA" value={mapa.empresa} />
              <InfoItem label="ROTA" value={mapa.rota} />
            </div>
            {tipo === 'CLIENTE' && (
              <div className="grid grid-cols-4 gap-x-4">
                <InfoItem label="CLIENTE" value={mapa.codClientes[0]} />
                <InfoItem label="NOME" className="col-span-2" value={mapa.nomeClientes[0]} />
                <InfoItem label="LOCAL" value={mapa.local} />
              </div>
            )}
            <div className="flex justify-between px-2">
              <p className="mt-1 text-[10px] tracking-wider">
                idPalete: {mapa.paleteId}
              </p>
              <p className="mt-1 text-[10px] tracking-wider">{mapa.id}</p>
            </div>
          </div>

          {/* QR Code */}
          {mapa.tipo !== 'palete' && <div className="col-span-1 flex flex-col items-center justify-center text-center">
            <QRCodeSVG value={mapa.paleteId} size={100} />
          </div>}
        </div>

        {/* Clientes e Informações Adicionais */}
        {(mapa.nomeClientes.length > 0 || mapa.infoAdicionaisI) && (
          <div className="mt-2 space-y-1 border-t pt-2 text-[11px]">
            {mapa.nomeClientes.length > 0 && exibirCliente === 'TODOS' && tipo === 'TRANSPORTE' && (
              <div>
                <span className="font-semibold text-muted-foreground">
                  CLIENTES:
                </span>
                <span className="ml-2 text-[9px]">
                  {mapa.nomeClientes.join(" | ")}
                </span>
              </div>
            )}
            {mapa.nomeClientes.length > 0 && exibirCliente === 'PRIMEIRO' && tipo === 'TRANSPORTE' &&  (
              <div>
                <span className="font-semibold text-muted-foreground">
                  CLIENTES:
                </span>
                <span className="ml-2 text-[9px]">
                  {`${mapa.nomeClientes[0]}(${mapa.codClientes[0]})`}
                </span>
              </div>
            )}
            {mapa.infoAdicionaisI && (
              <div>
                <span className="font-semibold text-muted-foreground">
                  INFO:
                </span>
                <span className="ml-2">{mapa.infoAdicionaisI}</span>
              </div>
            )}
          </div>
        )}

        {/* Resumo Quantitativo */}
        <div className="mt-3 flex flex-wrap justify-center border-t pt-3 text-center text-sm font-semibold">
          {(() => {
            const items = []
            
            if (mapa.tipo === 'palete') {
              items.push(
                `${mapa.paletes || 0} PLT`,
                `${pesoTotal.toFixed(0)}kg PESO TOTAL`
              )
            } else if (mapa.tipo === 'unidade') {
              items.push(
                `${mapa.unidades || 0} UN`,
                `${pesoTotal.toFixed(2)}kg PESO TOTAL`
              )
            } else {
              // picking - exibe tudo
              items.push(
                `${mapa.caixas || 0} CXS`,
                `${mapa.paletes || 0} PLT`,
                `${mapa.unidades || 0} UN`,
                `${mapa.linhasVisitadas || 0} LINHAS`,
                `${pesoTotal.toFixed(0)}kg PESO TOTAL`
              )
            }
            
            return items.map((item, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2 text-muted-foreground">|</span>}
                {item}
              </span>
            ))
          })()}
        </div>

        {/* Informações Adicionais II (se necessário) */}
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
