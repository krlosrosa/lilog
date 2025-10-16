// src/config/ruleFields.ts

import { Field } from 'react-querybuilder';
import {
  TipoProcessoEnum,
  TurnoEnum,
  StatusDemandaEnum,
} from '../schemas/demanda.schema';

// --- CAMPOS PARA REGRAS DE NÍVEL DE DEMANDA ---
export const demandaFields: Field[] = [
  // --- Campos Numéricos ---
  {
    name: 'tempoMedioPorVisita',
    label: 'Tempo Médio por Visita (ms)',
    inputType: 'number',
  },
  {
    name: 'quantidadeVisitas',
    label: 'Quantidade de Visitas',
    inputType: 'number',
  },
  {
    name: 'tempoTrabalhado',
    label: 'Tempo Trabalhado (ms)',
    inputType: 'number',
  },
  // ... adicione outros campos da demanda que desejar
];


// ==========================================================
// NOVO: CAMPOS PARA REGRAS DE NÍVEL DE PAUSA
// ==========================================================
export const pausaFields: Field[] = [
  {
    name: 'motivo',
    label: 'Motivo da Pausa',
    valueEditorType: 'select',
    // É uma ótima prática ter os motivos pré-definidos para consistência
    values: [
      { name: 'PAUSA_TERMICA', label: 'Pausa Térmica' },
      { name: 'PAUSA_LANCHE', label: 'Lanche' },
      { name: 'FALTA_PRODUTO', label: 'Falta de Produto' },
      { name: 'NECESSIDADE_PESSOAL', label: 'Necessidade Pessoal' },
      // Adicione outros motivos que existam no seu sistema
    ],
  },
  {
    name: 'intervalo',
    label: 'Duração da Pausa (ms)',
    inputType: 'number',
  },
];