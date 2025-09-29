import type { EnrichedPickingMapItem } from '../types/pickingMap';

type SortKey = string;

export const classificarPorCampos = (
  lista: EnrichedPickingMapItem[],
  campos: SortKey[],
) => {
  return lista.sort((a, b) => {
    for (const campo of campos) {
      const valorA = getValorProfundo(a, campo);
      const valorB = getValorProfundo(b, campo);

      if (valorA < valorB) return -1;
      if (valorA > valorB) return 1;
      // se forem iguais, continua para o próximo campo
    }
    return 0;
  });
};

function getValorProfundo(obj: any, caminho: string): any {
  return caminho.split('.').reduce((acc, chave) => acc?.[chave], obj) ?? '';
}
