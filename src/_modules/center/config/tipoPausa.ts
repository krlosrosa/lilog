// Adapted from https://en.wikipedia.org/wiki/List_of_musical_instruments
import type { OptionGroup } from 'react-querybuilder/debug';

export const tiposPausa: OptionGroup[] = [
  {
    label: 'Tipos de Pausa',
    instruments: [
      'PAUSA_TERMICA',
      'FALTA_PRODUTO',
      'REFEICAO',
      'TREINAMENTO_FEEDBACK',
    ]
  },
].map(({ label, instruments }) => ({
  label,
  options: instruments.map((s) => ({
    name: s.toLowerCase().replace(/\s+/g, '_'),
    label: s,
  })),
}));

export const tiposStatusDemanda: OptionGroup[] = [
  {
    label: 'Status Demanda',
    instruments: [
      'EM_PROGRESSO',
      'FINALIZADA',
      'PAUSA',
    ]
  },
].map(({ label, instruments }) => ({
  label,
  options: instruments.map((s) => ({
    name: s.toLowerCase().replace(/\s+/g, '_'),
    label: s,
  })),
}));