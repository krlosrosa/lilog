import type { EnrichedPickingMapItem } from '../../services/types/pickingMap';

export function agruparESomarMinuta(
  lista: EnrichedPickingMapItem[],
): EnrichedPickingMapItem[] {
  const agrupado = lista.reduce(
    (acc: Record<string, EnrichedPickingMapItem>, item) => {
      const chaveValor = `${item.id}-${item.produto?.empresa}-${item.produto?.segmento}`;

      if (!acc[chaveValor]) {
        acc[chaveValor] = {
          ...item,
          quantidade: 0,
          caixa: 0,
          paletes: 0,
          pesoLiquido: 0,
          pesoCaixa: 0,
          pesoPallet: 0,
          visitas: 0,
        };
      }

      const current = acc[chaveValor];
      if (current) {
        current.quantidade += item.quantidade;
        current.caixa = (current.caixa ?? 0) + (item.caixa ?? 0);
        current.paletes = (current.paletes ?? 0) + (item.paletes ?? 0);
        current.pesoLiquido += item.pesoLiquido;
        current.pesoCaixa = (current.pesoCaixa ?? 0) + (item.pesoCaixa ?? 0);
        current.pesoPallet = (current.pesoPallet ?? 0) + (item.pesoPallet ?? 0);
        current.visitas = (current.visitas ?? 0) + (item.visitas ?? 0);
      }
      return acc;
    },
    {},
  );

  return Object.values(agrupado);
}
