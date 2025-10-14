import type { EnrichedPickingMapItem } from '../types/pickingMap';

export function alocarCaixasCarregamento(
  items: EnrichedPickingMapItem[],
): EnrichedPickingMapItem[] {
  return items.map((item) => {
    if (!item.produto) {
      return item;
    }
    const { unPorCaixa, pesoCaixa } = item.produto;
    const pesoUnidade = pesoCaixa / unPorCaixa
    const totalUnidades = item.quantidade;
    const caixasDeUnidades = Math.floor(totalUnidades / unPorCaixa);
    const unidadesRestantes = totalUnidades % unPorCaixa;
    const totalCaixas = caixasDeUnidades;

    const pesoUnidades = unidadesRestantes * pesoUnidade;
    const pesoCaixas =  unPorCaixa * pesoUnidade;

    return {
      ...item,
      quantidade: unidadesRestantes,
      caixa: totalCaixas,
      pesoLiquido: pesoUnidades,
      pesoCaixa: pesoCaixas,
    };
  });
}
