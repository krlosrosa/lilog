import type { EnrichedPickingMapItem } from '../types/pickingMap';

export function   agruparESomarCarregamento(
  lista: EnrichedPickingMapItem[],
): EnrichedPickingMapItem[] {
  const agrupado = lista.reduce(
    (acc: Record<string, EnrichedPickingMapItem>, item) => {
      const chaveValor = `${item.codItem}-${item.lote}-${item.id}`;

      if (!acc[chaveValor]) {
        acc[chaveValor] = {
          ...item,
          quantidade: 0,
          pesoLiquido: 0,
          caixa: 0
        };
      }

      acc[chaveValor].quantidade += item.quantidade;
      acc[chaveValor].pesoLiquido += item.pesoLiquido;
      acc[chaveValor].caixa += item.caixa ?? 0;

      return acc;
    },
    {},
  );

  return Object.values(agrupado);
}
