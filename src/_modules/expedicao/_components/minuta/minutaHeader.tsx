import type { ImpressaoMapaHeader } from '../../services/types/pickingMap';
import { QRCodeSVG } from "qrcode.react";

interface HeaderProps {
  mapa: ImpressaoMapaHeader;
}

export const Header = ({ mapa }: HeaderProps) => {
  const formatDateTime = () => {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (tipo: string) => {
    const types = {
      picking: 'PICKING',
      unidade: 'UNIDADE',
      palete: 'PALETE',
      fifo: 'FIFO',
    };
    return types[tipo as keyof typeof types] || tipo.toUpperCase();
  };

  const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  )

  const pesoTotal = (mapa.pesoCaixa || 0) + (mapa.pesoPalete || 0) + (mapa.pesoUnidade || 0)

  return (
    <div className="mb-3 w-full border border-slate-300 bg-white">
      {/* Cabeçalho Principal */}
      <div className="flex text-xl items-center justify-center bg-gray-800 px-3 py-1.5 text-white print:bg-black">
        <h1 className="font-bold tracking-wide">
          MINUTA DE CARREGAMENTO - {mapa.transportId}
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
              <InfoItem label="ROTA" value={mapa.rota} />
            </div>
            <div>
              {(mapa.nomeClientes.length > 0 || mapa.infoAdicionaisI) && (
                <div className="mt-2 space-y-1 border-t pt-2 text-[11px]">
                  {mapa.nomeClientes.length > 0 && (
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        CLIENTES:
                      </span>
                      <span className="ml-2 text-[9px]">
                        {mapa.nomeClientes.join(" | ")}
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
            </div>
            <div>
              <p className="mt-1 text-[10px] tracking-wider">
                idPalete: {mapa.paleteId}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="col-span-1 flex flex-col items-center justify-center text-center">
            <QRCodeSVG value={mapa.paleteId} size={100} />
          </div>
        </div>

        {/* Resumo Quantitativo */}
        <div className="mt-3 flex flex-wrap justify-center border-t pt-3 text-center text-sm font-semibold">
          {(() => {
            const formatInt = (n?: number) => new Intl.NumberFormat('pt-BR').format(n ?? 0)
            const formatKg = (n?: number) => `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)} kg`

            const items = [
              `${formatInt(mapa.caixas)} CXS`,
              `${formatInt(mapa.paletes)} PLT`,
              `${formatInt(mapa.unidades)} UN`,
              `${formatInt(mapa.linhasVisitadas)} LINHAS`,
              `${formatKg(pesoTotal)} PESO TOTAL`,
            ]

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
  );
};
