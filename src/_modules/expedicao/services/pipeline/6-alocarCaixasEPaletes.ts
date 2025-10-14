import type { EnrichedPickingMapItem } from '../types/pickingMap';

export function alocarCaixasEPaletes(
  items: EnrichedPickingMapItem[],
): EnrichedPickingMapItem[] {
  return items.map((item) => {
    if (!item.produto) {
      return item;
    }
    const { unPorCaixa, cxPorPallet, pesoCaixa } = item.produto;
    const pesoUnidade = pesoCaixa / unPorCaixa
    const totalUnidades = item.quantidade;
    const caixasDeUnidades = Math.floor(totalUnidades / unPorCaixa);
    const unidadesRestantes = totalUnidades % unPorCaixa;
    const totalCaixas = caixasDeUnidades;
    const paletesDeCaixas = Math.floor(totalCaixas / cxPorPallet);
    const caixasRestantes = totalCaixas % cxPorPallet;
    const percentualPallete = caixasRestantes / cxPorPallet;

    const pesoUnidades = unidadesRestantes * pesoUnidade;
    const pesoCaixas = caixasRestantes * unPorCaixa * pesoUnidade;
    const pesoPaletes =
      paletesDeCaixas * cxPorPallet * unPorCaixa * pesoUnidade;

    return {
      ...item,
      quantidade: unidadesRestantes,
      caixa: caixasRestantes,
      paletes: paletesDeCaixas,
      pesoLiquido: pesoUnidades,
      pesoCaixa: pesoCaixas,
      pesoPallet: pesoPaletes,
      percentualPallete: percentualPallete * 100,
    };
  });
}
