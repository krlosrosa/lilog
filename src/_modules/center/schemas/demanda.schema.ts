// src/schemas/demanda.schema.ts

import { z } from 'zod';

// 1. Definição dos Enums (baseado nos seus imports)
export const TipoProcessoEnum = z.enum(['SEPARACAO', 'CONFERENCIA', 'CARREGAMENTO', 'DESCARGA']);
export const TurnoEnum = z.enum(['MANHA', 'TARDE', 'NOITE']);
export const StatusDemandaEnum = z.enum(['PENDENTE', 'EM_ANDAMENTO', 'PAUSADA', 'FINALIZADA', 'CANCELADA']);
export const StatusPaleteEnum = z.enum(['AGUARDANDO', 'EM_CONFERENCIA', 'CONCLUIDO']);

// 2. Schema para a entidade 'PausaEntity'
export const PausaSchema = z.object({
  id: z.number().optional(),
  motivo: z.string().min(1, "O motivo da pausa é obrigatório."),
  descricao: z.string().optional(),
  inicio: z.coerce.date(), // 'coerce' converte string/number para Date
  fim: z.coerce.date().optional(),
  registradoPorId: z.string(),
});

// 3. Schema para a entidade 'PaleteEntity'
export const PaleteSchema = z.object({
  id: z.string(),
  status: StatusPaleteEnum,
  demandaId: z.number(),
  processo: TipoProcessoEnum,
  caixas: z.number().positive().int(),
  unidades: z.number().positive().int(),
  paletes: z.number().positive().int(),
  empresa: z.string(),
  segmento: z.string(),
  visitas: z.number().int(),
  criadoEm: z.coerce.date(),
  atualizadoEm: z.coerce.date(),
  criadoPorId: z.string(),
  validado: z.boolean(),
  transporteId: z.string(),
});

// 4. Schema principal para 'DemandaEntity'
export const DemandaSchema = z.object({
  id: z.number(),
  processo: TipoProcessoEnum,
  inicio: z.coerce.date(),
  dataRegistro: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD"),
  fim: z.coerce.date().nullable().optional(),
  cadastradoPorId: z.string(),
  turno: TurnoEnum,
  funcionarioId: z.string(),
  funcionario: z.string(),
  centerId: z.string(),
  status: StatusDemandaEnum,
  obs: z.string().nullable().optional(),
  criadoEm: z.coerce.date(),
  // Campos calculados/agregados (getters na sua entidade)
  // que podem ser úteis para as regras
  quantidadeCaixas: z.number().int().describe('Quantidade Total de Caixas'),
  produtividade: z.number().describe('Produtividade (Caixas por Hora)'),
  tempoTrabalhado: z.number().describe('Tempo Trabalhado (em ms)'),
  empresa: z.string().describe('Empresa do Primeiro Palete'),
  segmento: z.string().describe('Segmento do Primeiro Palete'),
  cluster: z.string().describe('Cluster do Centro'),
  
  // Relações (não usadas diretamente na criação de regras, mas bom ter no schema)
  // paletes: z.array(PaleteSchema).optional(),
  // pausas: z.array(PausaSchema).optional(),
});

// 5. Exportar os tipos inferidos para usar no seu código
export type Demanda = z.infer<typeof DemandaSchema>;
export type Palete = z.infer<typeof PaleteSchema>;
export type Pausa = z.infer<typeof PausaSchema>;