import { z } from 'zod';

const empresasValidas = ['LACTALIS', 'ITAMBE', 'DPA'];
const categoriasValidas = ['SECA', 'REFR', 'QUEIJO'];

export const produtoSchema = z.object({
  codItem: z.string().length(9, 'Código do item deve ter 9 caracteres'),
  descricao: z.string(),
  shelf: z.number().min(20, 'Shelf deve ser maior que 20'),
  variavel: z.number(),
  pesoCaixa: z.number(),
  pesoUnidade: z.number(),
  unPorCaixa: z.number().min(1, 'Unidades por caixa deve ser maior que 0'),
  cxPorPallet: z.number().min(1, 'Caixas por pallet deve ser maior que 0'),
  segmento: z.string().refine((value) => categoriasValidas.includes(value), { message: 'Categoria deve ser SECO, REFR ou QUEIJO' }),
  vermelho: z.number(),
  laranja: z.number(),
  amarelo: z.number(),
  verde: z.number(),
  pickWay: z.number(),
  endereco: z.string(),
  empresa: z.string().refine((value) => empresasValidas.includes(value), { message: 'Empresa deve ser LACTALIS, ITAMBE ou DPA' }),
});

export type ProdutoSchema = z.infer<typeof produtoSchema>;


export const entregaSchema = z.object({
  id: z.string().optional(),
  transportId: z.string().length(8, 'ID do transporte deve ter 10 caracteres'),
  remessa: z.string(),
  shipmentItem: z.string(),
  centro: z.string(),
  empresa: z.string(),
  nomeEmpresa: z.string(),
  placa: z.string(),
  codItem: z.string().length(9, 'Código do item deve ter 9 caracteres'),
  descricao: z.string(),
  lote: z.string(),
  quantidade: z.number({  error: (issue) => {
    if (issue.code === 'invalid_type') {
      return 'Tipo invalido'
    }
  },}),
  unMedida: z.string(),
  dtFabricacao: z.date(),
  dtVencimento: z.date(),
  codCliente: z.string(),
  nomeCliente: z.string(),
  pesoBruto: z.number(),
  pesoLiquido: z.number(),
});

export type EntregaSchema = z.infer<typeof entregaSchema>;

export const rotaSchema = z.object({  
  empresa: z.string(),
  rota: z.string(),
  transportId: z.string(),
  placa: z.string(),
  remessa: z.string(),
  sequencia: z.number(),
  codCliente: z.string(),
  nomeCliente: z.string(),
  local: z.string(),
  bairro: z.string(),
  perfiRoterizado: z.string(),
  perfilUtilizado: z.string(),
  transportadora: z.string(),
  tipoDeCarga: z.string(),
  prioridade: z.number().optional(),
  infoAdicionaisI: z.string().optional(),
  infoAdicionaisII: z.string().optional(),
});
export type RotaSchema = z.infer<typeof rotaSchema>;
