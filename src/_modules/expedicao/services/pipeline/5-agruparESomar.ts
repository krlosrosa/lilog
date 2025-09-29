import type { EnrichedPickingMapItem } from '../../services/types/pickingMap';

export function agruparESomar(
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
        };
      }

      acc[chaveValor].quantidade += item.quantidade;
      acc[chaveValor].pesoLiquido += item.pesoLiquido;
      return acc;
    },
    {},
  );

  return Object.values(agrupado);
}
