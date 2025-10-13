import { DefinirConfiguracaoImpressaoDto } from '@/_services/api/model';
import type { ImpressaoMapaItem } from '../../../services/types/pickingMap';
import { memo } from 'react';
import { TableRowFifo } from './tableRowFifo';

interface BodyProps {
  itens: ImpressaoMapaItem[];
  config: DefinirConfiguracaoImpressaoDto | undefined;
  transporteId: string;
}

export const BodyFifo = memo(({ itens, config, transporteId }: BodyProps) => {
  if (!itens || itens.length === 0) {
    return (
      <div className='w-full p-8 text-center bg-gray-50 print:bg-white border border-gray-200 print:border-black'>
        <p className='text-gray-500 print:text-black'>
          Nenhum item encontrado para separação
        </p>
      </div>
    );
  }

  return (
    <div className='w-full bg-white print:shadow-none'>
      <div className='overflow-hidden border border-gray-300 print:border-black'>
        <table className='w-full table-fixed text-xs'>
          <thead>
          <tr>
              <th></th>
              <th></th>
              <RowHeader extraClass="w-[30%]">{transporteId}</RowHeader>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr className='bg-gray-100 print:bg-gray-200'>
              <RowHeader extraClass="w-[10%]">Endereço</RowHeader>
              <RowHeader extraClass="w-[10%]">SKU</RowHeader>
              <RowHeader extraClass="w-[30%]">Descrição</RowHeader>
              <RowHeader extraClass="w-[10%]">Lote</RowHeader>
              <RowHeader extraClass="w-[10%]">Data de Fabricação</RowHeader>
              <RowHeader extraClass="w-[10%]">Data Máxima</RowHeader>
              <RowHeader extraClass="w-[5%]">Caixas</RowHeader>
              {!config?.separarUnidades && <RowHeader extraClass="w-[5%]">Unid.</RowHeader>}
              {!config?.separarPaleteFull && <RowHeader extraClass="w-[5%]">Paletes</RowHeader>}
              <RowHeader extraClass="w-[10%]">Faixa</RowHeader>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <TableRowFifo
                config={config}
                key={`${item.sku}-${item.lote}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});


function RowHeader({
  children,
  extraClass,
}: {
  children: React.ReactNode
  extraClass?: string
}) {
  return (
    <th
      className={`border-b border-r border-gray-300 px-2 py-0.5 font-semibold text-gray-700 print:border-black ${extraClass}`}
    >
      {children}
    </th>
  )
}