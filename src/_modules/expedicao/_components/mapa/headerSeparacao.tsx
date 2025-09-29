import type { ImpressaoMapaHeader } from '../../services/types/pickingMap';
import { memo } from "react"

interface HeaderProps {
  mapa: ImpressaoMapaHeader;
}

export const Header = memo(({ mapa }: HeaderProps) => {
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

  return (
    <div className='w-full bg-white border border-black print:border-black mb-3'>
      {/* Cabeçalho Principal */}
      <div className='bg-gray-800 print:bg-black text-white px-3 py-1.5 flex justify-between items-center'>
        <h1 className='text-base font-bold tracking-wide'>
          MAPA DE SEPARAÇÃO - {getTypeLabel(mapa.tipo)} | {mapa.segmento}
        </h1>
        <div className='flex items-center space-x-4 text-xs'>
          <span>PRIORIDADE: {mapa.prioridade}</span>
          <span>{formatDateTime()}</span>
        </div>
      </div>

      {/* Dados Principais */}
      <div className='p-2'>
        {/* Linha 1: Identificação */}
        <div className='grid grid-cols-6 gap-2 mb-2 text-xs'>
          <div className='border-r border-gray-300 pr-2'>
            <span className='font-semibold text-gray-600'>ID:</span>
            <div className='font-bold'>{mapa.id}</div>
          </div>
          <div className='border-r border-gray-300 pr-2'>
            <span className='font-semibold text-gray-600'>TRANSPORT:</span>
            <div className='font-bold'>{mapa.transportId}</div>
          </div>
          <div className='border-r border-gray-300 pr-2'>
            <span className='font-semibold text-gray-600'>ROTA:</span>
            <div className='font-bold'>{mapa.rota}</div>
          </div>
          <div className='border-r border-gray-300 pr-2'>
            <span className='font-semibold text-gray-600'>PLACA:</span>
            <div className='font-bold'>{mapa.placa}</div>
          </div>
          <div className='border-r border-gray-300 pr-2'>
            <span className='font-semibold text-gray-600'>REMESSA:</span>
            <div className='font-bold'>{mapa.remessa}</div>
          </div>
          <div className='border-r border-gray-300 pr-2'>
            <span className='font-semibold text-gray-600'>SEQ:</span>
            <div className='font-bold'>{mapa.sequencia}</div>
          </div>
          <div>
            <span className='font-semibold text-gray-600'>EMPRESA:</span>
            <div className='font-bold truncate'>{mapa.empresa}</div>
          </div>
        </div>

        {/* Linha 2: Transportadora e Clientes */}
        <div className='border-t border-gray-300 pt-2 mb-2'>
          <div className='grid grid-cols-2 gap-4 text-xs'>
            <div>
              <span className='font-semibold text-gray-600'>
                TRANSPORTADORA:
              </span>
              <span className='ml-2 font-bold'>{mapa.transportadora}</span>
            </div>
            <div>
              <span className='font-semibold text-gray-600'>PERFIL:</span>
              <span className='ml-2 font-bold'>{mapa.perfilUtilizado}</span>
            </div>
          </div>
          {mapa.nomeClientes.length > 0 && (
            <div className='mt-1 text-xs'>
              <span className='font-semibold text-gray-600'>CLIENTES:</span>
              <span className='ml-2'>{mapa.nomeClientes.join(' | ')}</span>
            </div>
          )}
        </div>

        {/* Linha 3: Resumo Quantitativo */}
        <div className='border-t border-gray-300 pt-2'>
          <div className='grid grid-cols-7 gap-2 text-xs text-center'>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>{mapa.caixas || 0}</div>
              <div className='text-gray-600 text-xs'>CXS</div>
            </div>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>{mapa.paletes || 0}</div>
              <div className='text-gray-600 text-xs'>PLT</div>
            </div>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>{mapa.unidades || 0}</div>
              <div className='text-gray-600 text-xs'>UN</div>
            </div>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>
                {(mapa.pesoCaixa || 0).toFixed(0)}kg
              </div>
              <div className='text-gray-600 text-xs'>P.CX</div>
            </div>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>
                {(mapa.pesoPalete || 0).toFixed(0)}kg
              </div>
              <div className='text-gray-600 text-xs'>P.PLT</div>
            </div>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>
                {(mapa.pesoUnidade || 0).toFixed(0)}kg
              </div>
              <div className='text-gray-600 text-xs'>P.UN</div>
            </div>
            <div className='bg-gray-100 p-1.5 border'>
              <div className='font-bold text-sm'>
                {mapa.linhasVisitadas || 0}
              </div>
              <div className='text-gray-600 text-xs'>LINHAS</div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais - Compacto */}
        {(mapa.infoAdicionaisI || mapa.infoAdicionaisII) && (
          <div className='border-t border-gray-300 pt-1 mt-2 text-xs'>
            {mapa.infoAdicionaisI && (
              <div className='mb-1'>
                <span className='font-semibold text-gray-600'>INFO I:</span>
                <span className='ml-2'>{mapa.infoAdicionaisI}</span>
              </div>
            )}
            {mapa.infoAdicionaisII && (
              <div>
                <span className='font-semibold text-gray-600'>INFO II:</span>
                <span className='ml-2'>{mapa.infoAdicionaisII}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
