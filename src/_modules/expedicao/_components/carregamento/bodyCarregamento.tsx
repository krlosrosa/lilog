
import { DefinirConfiguracaoImpressaoDto } from '@/_services/api/model';
import { memo } from 'react';
import { ImpressaoMapaItem } from '../../services/types/pickingMap';
import { TableRowCarregamento } from './tableRow';

interface BodyProps {
  itens: ImpressaoMapaItem[];
  config: DefinirConfiguracaoImpressaoDto | undefined;
  transporteId: string;
}

export const BodyCarregamento = memo(({ itens, config, transporteId }: BodyProps) => {
  if (!itens || itens.length === 0) {
    return (
      <div className='w-full p-8 text-center bg-gray-50 print:bg-white border border-gray-200'>
        <p className='text-gray-500 print:text-black'>
          Nenhum item encontrado para separação
        </p>
      </div>
    );
  }

  return (
    <div className='w-full bg-white'>
      <div className='overflow-hidden border border-gray-300'>
        <table className='w-full table-fixed text-xs'>
          <thead>
            <tr>
              <th></th>
              <RowHeader extraClass="w-[30%]">{transporteId}</RowHeader>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr className='bg-gray-100 print:bg-gray-200'>
              <RowHeader extraClass="w-[10%]">SKU</RowHeader>
              <RowHeader extraClass="w-[30%]">Descrição</RowHeader>
              <RowHeader extraClass="w-[10%]">Lote</RowHeader>
              <RowHeader extraClass="w-[5%]">Caixas</RowHeader>
              <RowHeader extraClass="w-[5%]">Unid.</RowHeader>
              <RowHeader extraClass="w-[10%]">Faixa</RowHeader>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <TableRowCarregamento
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
      className={`border-gray-300 px-2 py-0.5 font-semibold text-gray-700 ${extraClass}`}
    >
      {children}
    </th>
  )
}