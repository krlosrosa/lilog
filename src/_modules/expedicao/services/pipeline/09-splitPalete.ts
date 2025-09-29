import type { EnrichedPickingMapItem } from '../types/pickingMap';

interface SplitPaleteProps {
  items: EnrichedPickingMapItem[];
  splitPalete: boolean;
  splitUnidade: boolean;
}

export const splitPalete = ({ items, splitPalete, splitUnidade }: SplitPaleteProps) => {
  const lista: EnrichedPickingMapItem[] = [];

  items.forEach((item) => {
    const originalItem = { ...item, paletes: 0, pesoPallet: 0, quantidade: 0, pesoLiquido: 0 };
    if (splitPalete && item.paletes && item.paletes > 0) {
      item.quantidade = 0;
      item.pesoLiquido = 0;
      item.caixa = 0;
      item.pesoCaixa = 0;
      item.tipo = 'palete';
      lista.push(item);
    }
    if (splitUnidade && item.quantidade && item.quantidade > 0) {
      item.paletes = 0;
      item.pesoPallet = 0;
      item.caixa = 0;
      item.pesoCaixa = 0;
      item.tipo = 'unidade';
      lista.push(item);
    }
    // Só adiciona o originalItem se tiver alguma quantidade
    if (originalItem.quantidade > 0 || (originalItem.caixa ?? 0) > 0 || originalItem.paletes > 0) {
      lista.push(originalItem);
    }
  });
  return lista;
};
