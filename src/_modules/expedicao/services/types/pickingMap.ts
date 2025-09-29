
export interface EnrichedPickingMapItem extends ShipmentPickingMapItem {
  tipo: 'picking' | 'unidade' | 'palete' | 'fifo';
  faixa?: 'verde' | 'laranja' | 'amarelo' | 'vermelho';
  visitas: number;
  dataMaxima?: string;
  caixa?: number;
  pesoCaixa?: number;
  paletes?: number;
  pesoPallet?: number;
  rota: RoutingPickingMapItem | null;
  produto: ProductsPickingMapItem | null;
  percentualPallete?: number;
}

export interface RoutingPickingMapItem {
  empresa: string;
  rota: string;
  transportId: string;
  placa: string;
  remessa: string;
  sequencia: number;
  codCliente: string;
  nomeCliente: string;
  local: string;
  bairro: string;
  perfiRoterizado: string;
  perfilUtilizado: string;
  transportadora: string;
  tipoDeCarga: string;
  prioridade?: number;
  infoAdicionaisI?: string;
  infoAdicionaisII?: string;
}

export interface ShipmentPickingMapItem {
  id?: string;
  transportId: string;
  remessa: string;
  shipmentItem: string;
  centro: string;
  empresa: string;
  nomeEmpresa: string;
  placa: string;
  codItem: string;
  descricao: string;
  lote: string;
  quantidade: number;
  unMedida: string;
  dtFabricacao: Date;
  dtVencimento: Date;
  codCliente: string;
  nomeCliente: string;
  pesoBruto: number;
  pesoLiquido: number;
}

export interface ProductsPickingMapItem {
  codItem: string;
  descricao: string;
  shelf: number;
  variavel: number;
  pesoCaixa: number;
  pesoUnidade: number;
  unPorCaixa: number;
  cxPorPallet: number;
  segmento: string;
  vermelho: number;
  laranja: number;
  amarelo: number;
  verde: number;
  pickWay: number;
  endereco: string;
  empresa: string;
}

export interface ImpressaoMinutaCarregamento extends ImpressaoMapaHeader {
  itens: ItemMinutaCarregamento[];
}

export interface ImpressaoMapa extends ImpressaoMapaHeader {
  itens: ImpressaoMapaItem[];
}

export interface ItemMinutaCarregamento {
  id: string;
  empresa: string;
  seguimento: string;
  quantidade: number;
  quantidadeCaixas: number;
  quantidadePaletes: number;
  visitas: number;
}

export interface ImpressaoMapaHeader {
  local?: string;
  paleteId: string;
  id: string;
  empresa: string;
  rota: string;
  transportId: string;
  placa: string;
  remessa: string;
  sequencia: number;
  transportadora: string;
  perfilUtilizado: string;
  prioridade: number;
  infoAdicionaisI: string;
  infoAdicionaisII: string;
  segmento: string;
  codClientes: string[];
  nomeClientes: string[];
  caixas: number;
  paletes: number;
  unidades: number;
  pesoUnidade: number;
  pesoPalete: number;
  pesoCaixa: number;
  linhasVisitadas: number;
  tipo: 'picking' | 'unidade' | 'palete' | 'fifo';
  processo: string;
}

export interface ImpressaoMapaItem {
  sku: string;
  descricao: string;
  quantidade: number;
  pesoLiquido: number;
  pesoPalete: number;
  pesoCaixa: number;
  quantidadeCaixas: number;
  quantidadePaletes: number;
  lote: string;
  dtFabricacao: Date;
  dtMaxima: Date;
  endereco: string;
  segmento: string;
  pickWay: number;
  faixa: 'verde' | 'laranja' | 'amarelo' | 'vermelho';
  percentualPallete: number;
}
