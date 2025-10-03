import type { EnrichedPickingMapItem } from '../types/pickingMap';

interface SplitPaleteProps {
  items: EnrichedPickingMapItem[];
  splitPalete: boolean;
  splitUnidade: boolean;
}

export const splitPalete = ({ items, splitPalete, splitUnidade }: SplitPaleteProps) => {
  const lista: EnrichedPickingMapItem[] = [];

  items.forEach((item) => {
    if(item.codItem === "600089007"){
      console.log({
        item: item.codItem,
        paletes: item.paletes,
        quantidade: item.quantidade,
        caixa: item.caixa,
        pesoCaixa: item.pesoCaixa,
        pesoPallet: item.pesoPallet,
        tipo: item.tipo,
      });
    }
    const originalItem = { ...item, paletes: item.paletes ?? 0, pesoPallet: item.pesoPallet ?? 0, quantidade: item.quantidade ?? 0, pesoLiquido: item.pesoLiquido ?? 0, caixa: item.caixa ?? 0, pesoCaixa: item.pesoCaixa ?? 0, tipo: item.tipo ?? 'palete' };
    if (splitPalete && item.paletes && item.paletes > 0) {
      item.quantidade = 0;
      item.pesoLiquido = 0;
      item.caixa = 0;
      item.pesoCaixa = 0;
      item.tipo = 'palete';
      lista.push(item);
    }
    if (splitUnidade && originalItem.quantidade && originalItem.quantidade > 0) {
      item.paletes = 0;
      item.pesoPallet = 0;
      item.caixa = 0;
      item.pesoCaixa = 0;
      item.tipo = 'unidade';
      item.quantidade = originalItem.quantidade;
      lista.push(item);
    } else {
      item.quantidade = originalItem.quantidade;
      item.paletes = originalItem.paletes;
      item.pesoPallet = originalItem.pesoPallet;
      item.caixa = originalItem.caixa;
      item.pesoCaixa = originalItem.pesoCaixa;
      item.tipo = originalItem.tipo;
    }

    // Só adiciona o originalItem se tiver alguma quantidade
    if (originalItem.quantidade > 0 || (originalItem.caixa ?? 0) > 0 || originalItem.paletes > 0) {
      lista.push(originalItem);
    }
  });
  return lista;
};
