import type { EnrichedPickingMapItem } from '../types/pickingMap';

export const splitUnidade = (items: EnrichedPickingMapItem[]) => {
  const lista: EnrichedPickingMapItem[] = [];

  items.forEach((item) => {
    const originalItem = { ...item, quantidade: 0, pesoLiquido: 0 };
    if (item.quantidade && item.quantidade > 0) {
      item.paletes = 0;
      item.pesoPallet = 0;
      item.caixa = 0;
      item.pesoCaixa = 0;
      item.tipo = 'unidade';
      lista.push(item);
    }
    lista.push(originalItem);
  });
  return lista;
};
