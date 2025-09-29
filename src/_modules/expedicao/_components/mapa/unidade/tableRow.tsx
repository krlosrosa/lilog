import { DefinirConfiguracaoImpressaoDto } from '@/_services/api/model';
import { ImpressaoMapaItem } from '../../../services/types/pickingMap';
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TableRowProps {
  item: ImpressaoMapaItem;
  index: number;
  config: DefinirConfiguracaoImpressaoDto | undefined;
}

export const TableRowUnidade = ({ item, index, config }: TableRowProps) => {
  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-25 print:bg-gray-50"
      } hover:bg-gray-50 print:hover:bg-gray-50`}
    >
      <RowCell extraClass="w-[10%]">{item.sku}</RowCell>
      <RowCell extraClass="w-[30%] text-[10px] break-words">{item.descricao}</RowCell>
      <RowCell extraClass="w-[10%]">{item.lote}</RowCell>
      <RowCell extraClass="w-[10%]">
        {format(item.dtFabricacao, "dd/MM/yyyy", { locale: ptBR })}
      </RowCell>
      <RowCell extraClass="w-[10%]">
        {format(item.dtMaxima, "dd/MM/yyyy", { locale: ptBR })}
      </RowCell>
      <RowCell extraClass="w-[10%]">{item.endereco}</RowCell>
        <RowCell extraClass="w-[5%]">{item.quantidade}</RowCell>
      <RowCell extraClass="w-[5%]">
        {item.faixa.toUpperCase() === "VERDE" ? "" : item.faixa}
      </RowCell>
    </tr>
  )
}

function RowCell({
  children,
  extraClass,
}: {
  children: React.ReactNode
  extraClass?: string
}) {
  return (
    <td
      className={`border-b border-r border-gray-300 p-0.5 text-center print:border-black ${extraClass}`}
    >
      {children}
    </td>
  )
}
