import { DefinirConfiguracaoImpressaoDto } from '@/_services/api/model';
import type { ImpressaoMapaItem } from '../../../services/types/pickingMap';
import { memo } from 'react';
import { TableRowPicking } from './tableRow';

interface BodyProps {
  itens: ImpressaoMapaItem[];
  config: DefinirConfiguracaoImpressaoDto | undefined;
  transporteId: string;
}

export const BodyPicking = memo(({ itens, config, transporteId }: BodyProps) => {
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
        {/* MUDANÇA PRINCIPAL: trocado de table-fixed para table-auto.
          Isso faz com que as colunas se ajustem ao conteúdo.
        */}
        <table className='w-full table-auto text-xs'>
          <thead>
            {/* Esta primeira linha pode ser removida se o transporteId for exibido de outra forma */}
            <tr>
              <th></th>
              <th></th>
              {/* Deixei o transporteId aqui, mas ele agora vai se alinhar com a coluna descrição */}
              <RowHeader>{transporteId}</RowHeader>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr className='bg-gray-100 print:bg-gray-200'>
              {/* Para colunas com conteúdo curto que NUNCA devem quebrar, usamos whitespace-nowrap.
                Isso garante que "SKU", "Lote", datas e quantidades fiquem em uma única linha.
              */}
              <RowHeader extraClass="whitespace-nowrap">Endereço</RowHeader>
              <RowHeader extraClass="whitespace-nowrap">SKU</RowHeader>
              
              {/* A coluna "Descrição" NÃO tem classe de largura ou nowrap.
                Ela vai se expandir para usar o espaço disponível e quebrar a linha se necessário.
                Adicionar uma largura mínima (min-w) é uma boa prática para evitar que ela fique muito espremida.
              */}
              <RowHeader extraClass="min-w-[200px]">Descrição</RowHeader>
              
              <RowHeader extraClass="whitespace-nowrap">Lote</RowHeader>
              <RowHeader extraClass="whitespace-nowrap">Fab</RowHeader>
              {config?.dataMaximaPercentual != null && config.dataMaximaPercentual > 0 && <RowHeader extraClass="whitespace-nowrap">Max</RowHeader>}
              <RowHeader extraClass="whitespace-nowrap">Cxs</RowHeader>
              {!config?.separarUnidades && <RowHeader extraClass="whitespace-nowrap">Und.</RowHeader>}
              {!config?.separarPaleteFull && <RowHeader extraClass="whitespace-nowrap">Plts</RowHeader>}
              <RowHeader extraClass="whitespace-nowrap">Faixa</RowHeader>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <TableRowPicking
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
      // Padding ajustado para dar um pouco mais de respiro
      className={`border-gray-300 px-2 py-1 font-semibold text-left text-gray-700 ${extraClass}`}
    >
      {children}
    </th>
  )
}