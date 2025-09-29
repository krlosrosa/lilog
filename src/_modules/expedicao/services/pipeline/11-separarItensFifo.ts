import type { EnrichedPickingMapItem } from '../types/pickingMap';

export function separarItensFifo(
  lista: EnrichedPickingMapItem[],
  faixas?: string[],
): EnrichedPickingMapItem[] {
  // Converte a lista de faixas para uppercase para garantir a comparação
  const faixasUpperCase = faixas?.map(f => f.toUpperCase())

  return lista.map(item => {
    if (faixasUpperCase && faixasUpperCase.length > 0) {
      if (faixasUpperCase.includes(item?.faixa?.toUpperCase() ?? "VERDE")) {
        return {
          ...item,
          tipo: "fifo",
          id: `${item.id}`,
        }
      }
    }
    return {
      ...item,
      id: `${item.id}`,
    }
  })
}