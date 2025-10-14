import { v4 as uuidv4 } from 'uuid';
import type {
  EnrichedPickingMapItem,
  ImpressaoMapa,
  ImpressaoMapaItem,
} from '../types/pickingMap';

export function gerarMapaCarregamentoUm(items: EnrichedPickingMapItem[]): ImpressaoMapa[] {
  const mapaPorChave = new Map<string, EnrichedPickingMapItem[]>();

  // Agrupa os itens por chave composta
  for (const item of items) {
    const chave = `${item.id}|${item.tipo}|${item.produto?.segmento}`;
    if (!mapaPorChave.has(chave)) {
      mapaPorChave.set(chave, []);
    }
    mapaPorChave.get(chave)!.push(item);
  }

  const mapas: ImpressaoMapa[] = [];

  for (const [chave, grupo] of mapaPorChave.entries()) {
    const primeiro = grupo[0];
    const rota = primeiro.rota;

    const codClientes = Array.from(new Set(grupo.map((i) => i.codCliente)));
    const nomeClientes = Array.from(new Set(grupo.map((i) => i.nomeCliente)));

    let caixas = 0,
      paletes = 0,
      unidades = 0;
    let pesoCaixa = 0,
      pesoPalete = 0,
      pesoUnidade = 0;

    const itens = grupo.map((item): ImpressaoMapaItem => {
      caixas += item.caixa ?? 0;
      paletes += item.paletes ?? 0;
      unidades += item.quantidade;

      pesoCaixa += item.pesoCaixa ?? 0;
      pesoPalete += item.pesoPallet ?? 0;
      pesoUnidade += item.pesoLiquido;

      return {
        sku: item.codItem,
        descricao: item.descricao,
        quantidade: item.quantidade,
        pesoLiquido: item.pesoLiquido,
        pesoPalete: item.pesoPallet ?? 0,
        pesoCaixa: item.pesoCaixa ?? 0,
        quantidadeCaixas: item.caixa ?? 0,
        quantidadePaletes: item.paletes ?? 0,
        lote: item.lote,
        dtFabricacao: item.dtFabricacao,
        percentualPallete: item.percentualPallete ?? 0,
        dtMaxima: item.dataMaxima
          ? new Date(item.dataMaxima)
          : item.dtVencimento,
        endereco: item.produto?.endereco ?? '',
        segmento: item.produto?.segmento ?? '',
        pickWay: item.produto?.pickWay ?? 0,
        faixa: item.faixa ?? 'verde',
      };
    });

    mapas.push({
      local: rota?.local,
      id: primeiro.id ?? '',
      paleteId: uuidv4(),
      linhasVisitadas: itens.length,
      empresa: primeiro.produto?.empresa ?? '',
      rota: rota?.rota ?? '',
      transportId: primeiro.transportId,
      placa: primeiro.placa,
      remessa: primeiro.remessa,
      sequencia: rota?.sequencia ?? 0 ,
      transportadora: rota?.transportadora ?? '',
      perfilUtilizado: rota?.perfilUtilizado ?? '',
      prioridade: rota?.prioridade ?? 0,
      infoAdicionaisI: rota?.infoAdicionaisI ?? '',
      infoAdicionaisII: rota?.infoAdicionaisII ?? '',
      segmento: primeiro.produto?.segmento ?? '',
      codClientes,
      nomeClientes,
      caixas,
      paletes,
      unidades,
      pesoCaixa,
      pesoPalete,
      pesoUnidade,
      tipo: primeiro.tipo,
      itens,
      processo: 'CONFERENCIA',
    });
  }

  return mapas;
}
