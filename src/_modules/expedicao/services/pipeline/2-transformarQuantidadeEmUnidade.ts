import type { EnrichedPickingMapItem } from '../../services/types/pickingMap';

export function transformarQuantidadeEmUnidade(
  enrichedShipments: EnrichedPickingMapItem[],
): EnrichedPickingMapItem[] {
  return enrichedShipments.map((item) => {
    const uuMedidas = ['CX', 'SC', 'FRD', 'FD'];
    let quantidadeUnidades = 0;
    let pesoLiquido = 0;
    if (uuMedidas.includes(item.unMedida)) {
      quantidadeUnidades = item.quantidade * (item.produto?.unPorCaixa || 0);
      pesoLiquido = quantidadeUnidades * (item.produto?.pesoUnidade || 0);
    } else {
      quantidadeUnidades = item.quantidade;
      pesoLiquido = item.pesoLiquido;
    }
    return {
      ...item,
      quantidade: quantidadeUnidades,
      pesoLiquido,
    };
  });
}
