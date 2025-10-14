import type { EnrichedPickingMapItem } from '../types/pickingMap';

export function alocarCaixaEUnidade(
  enrichedShipments: EnrichedPickingMapItem[],
): EnrichedPickingMapItem[] {
  return enrichedShipments.map((item) => {
    const uuMedidas = ['CX', 'SC', 'FRD'];
    let qtdCaixa = 0
    let qtdUnidade = 0

    if (uuMedidas.includes(item.unMedida)) {
      qtdCaixa = item.quantidade;
    } else {
      qtdUnidade = item.quantidade;
    }
    
    return {
      ...item,
      quantidade: qtdUnidade,
      caixa: qtdCaixa,
    };
  });
}
