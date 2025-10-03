import type { EnrichedPickingMapItem } from '../types/pickingMap';

interface SplitPaleteProps {
  items: EnrichedPickingMapItem[];
  splitPalete: boolean;
  splitUnidade: boolean;
}

export const splitPalete = ({ items, splitPalete, splitUnidade }: SplitPaleteProps) => {
  const lista: EnrichedPickingMapItem[] = [];

  items.forEach((item) => {
    // const originalItem = { ...item, paletes: item.paletes ?? 0, pesoPallet: item.pesoPallet ?? 0, quantidade: item.quantidade ?? 0, pesoLiquido: item.pesoLiquido ?? 0, caixa: item.caixa ?? 0, pesoCaixa: item.pesoCaixa ?? 0, tipo: item.tipo ?? 'palete' };
    if (splitPalete && splitUnidade) {
      const paleteInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: 0,
        pesoLiquido: 0,
        caixa: 0,
        pesoCaixa: 0,
        tipo: 'palete',
        paletes: item.paletes ?? 0,
        pesoPallet: item.pesoPallet ?? 0,
      }
      const unidadeInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: item.quantidade ?? 0,
        pesoLiquido: item.pesoLiquido ?? 0,
        caixa: 0,
        pesoCaixa: 0,
        paletes: 0,
        pesoPallet: 0,
        tipo: 'unidade',
      }
      const caixaInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: 0,
        pesoLiquido: 0,
        caixa: item.caixa ?? 0,
        pesoCaixa: item.pesoCaixa ?? 0,
        paletes: 0,
        pesoPallet: 0,
        tipo: 'picking',
      }
      if(item.paletes && item.paletes > 0) {
        lista.push(paleteInput);
      }
      if(item.quantidade && item.quantidade > 0){
        lista.push(unidadeInput);
      }

      if(item.caixa && item.caixa > 0) {
        lista.push(caixaInput);
      }
      return;
    }
    if(splitUnidade && item.quantidade && item.quantidade > 0) {
      const unidadeInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: item.quantidade ?? 0,
        pesoLiquido: item.pesoLiquido ?? 0,
        caixa: 0,
        pesoCaixa: 0,
        paletes: 0,
        pesoPallet: 0,
        tipo: 'unidade',
      }
      const restanteInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: 0,
        pesoLiquido: 0,
        caixa: item.caixa ?? 0,
        pesoCaixa: item.pesoCaixa ?? 0,
        paletes: item.paletes ?? 0,
        pesoPallet: item.pesoPallet ?? 0,
        tipo: 'picking',
      }
      lista.push(unidadeInput);
      if((item.caixa && item.caixa > 0) || (item.paletes && item.paletes > 0)){
        lista.push(restanteInput);
      }
      return;
    }

    if(splitPalete && item.paletes && item.paletes > 0) {
      const paleteInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: 0,
        pesoLiquido: 0,
        caixa: 0,
        pesoCaixa: 0,
        paletes: item.paletes ?? 0,
        pesoPallet: item.pesoPallet ?? 0,
        tipo: 'palete',
      }
      const restanteInput: EnrichedPickingMapItem = {
        ...item,
        quantidade: item.quantidade ?? 0,
        pesoLiquido: item.pesoLiquido ?? 0,
        caixa: item.caixa ?? 0,
        pesoCaixa: item.pesoCaixa ?? 0,
        paletes: 0,
        pesoPallet: 0,
        tipo: 'picking',
      }
      lista.push(paleteInput);
      if((item.caixa && item.caixa > 0) || (item.quantidade && item.quantidade > 0)){
        lista.push(restanteInput);
      }
      return;
    }

    lista.push(item)
    
  });
  return lista;
};
