import { v4 as uuidv4 } from 'uuid';
import type {
  EnrichedPickingMapItem,
  ImpressaoMinutaCarregamento,
  ItemMinutaCarregamento,
} from '../types/pickingMap';

export function gerarMinuta(
  items: EnrichedPickingMapItem[],
): ImpressaoMinutaCarregamento[] {
  const mapaPorChave = new Map<string, EnrichedPickingMapItem[]>();
  // Agrupa os itens por chave composta
  for (const item of items) {
    if (!item.rota) continue;

    const chave = `${item.id}`;
    if (!mapaPorChave.has(chave)) {
      mapaPorChave.set(chave, []);
    }
    mapaPorChave.get(chave)!.push(item);
  }

  const mapas: ImpressaoMinutaCarregamento[] = [];

  for (const [chave, grupo] of mapaPorChave.entries()) {
    const primeiro = grupo[0];
    const rota = primeiro.rota!;

    const codClientes = Array.from(new Set(grupo.map((i) => i.codCliente)));
    const nomeClientes = Array.from(new Set(grupo.map((i) => i.nomeCliente)));

    let caixas = 0,
      paletes = 0,
      unidades = 0;
    let pesoCaixa = 0,
      pesoPalete = 0,
      pesoUnidade = 0;

    const itens = grupo.map((item): ItemMinutaCarregamento => {
      caixas += item.caixa ?? 0;
      paletes += item.paletes ?? 0;
      unidades += item.quantidade;

      pesoCaixa += item.pesoCaixa ?? 0;
      pesoPalete += item.pesoPallet ?? 0;
      pesoUnidade += item.pesoLiquido;

      return {
        empresa: item.produto?.empresa ?? '',
        seguimento: item.produto?.segmento ?? '',
        quantidade: item.quantidade,
        quantidadeCaixas: item.caixa ?? 0,
        quantidadePaletes: item.paletes ?? 0,
        id: item.id ?? '',
        visitas: item.visitas,
      };
    });

    mapas.push({
      paleteId: uuidv4(),
      id: primeiro.id ?? '',
      linhasVisitadas: itens.reduce((acc, item) => acc + item.visitas, 0),
      empresa: primeiro.produto?.empresa ?? '',
      rota: rota.rota,
      transportId: primeiro.transportId,
      placa: primeiro.placa,
      remessa: primeiro.remessa,
      sequencia: rota.sequencia,
      transportadora: rota.transportadora,
      perfilUtilizado: rota.perfilUtilizado,
      prioridade: rota.prioridade ?? 0,
      infoAdicionaisI: rota.infoAdicionaisI ?? '',
      infoAdicionaisII: rota.infoAdicionaisII ?? '',
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
      processo: 'CARREGAMENTO',
    });
  }

  return mapas;
}
