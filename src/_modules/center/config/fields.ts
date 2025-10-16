import type { Field, RuleType } from 'react-querybuilder/debug';
import { defaultOperators, toFullOption } from 'react-querybuilder/debug';
import { musicalInstruments } from './musicalInstruments';
import { tiposPausa, tiposStatusDemanda } from './tipoPausa';

export const validator = (r: RuleType) => !!r.value;

export const fields = (
  [
    {
      name: 'motivoPausa',
      label: 'Motivo da Pausa',
      valueEditorType: 'select',
      values: tiposPausa,
      operators: defaultOperators.filter((op) => op.name === '='),
    },
    { name: 'tempo_pausa', label: 'Tempo total de pausa', inputType: 'number', validator },
    { name: 'tempor_por_visita', label: 'Tempo por visita', inputType: 'number', validator },
    { name: 'produtividade', label: 'Produtividade (Cx/H/H)', inputType: 'number', validator },
    { name: 'caixas', label: 'Quantidade de caixas', inputType: 'number', validator },
    { name: 'visitas', label: 'Quantidade de visitas', inputType: 'number', validator },
    { name: 'unidades', label: 'Quantidade de unidades', inputType: 'number', validator },
    { name: 'palete', label: 'Quantidade de Paletes', inputType: 'number', validator },
    { 
      name: 'statusDemanda', 
      label: 'Status da demanda',
      valueEditorType: 'select',
      values: tiposStatusDemanda,
      operators: defaultOperators.filter((op) => op.name === '='),
    },
  ] satisfies Field[]
).map((o) => toFullOption(o));

