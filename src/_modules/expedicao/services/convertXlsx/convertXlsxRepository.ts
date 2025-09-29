import * as XLSX from 'xlsx';
import { ProductsPickingMapItem, RoutingPickingMapItem, ShipmentPickingMapItem } from '../../services/types/pickingMap';


export class ConvertXlsx {
  async convertRouting(params: File): Promise<RoutingPickingMapItem[]> {
    if (!params) {
      return [];
    }
    const data: any[] = (await processExcelFile(params)) as any[];

    const convertedData = data.map((item: any) => ({
      empresa: String(item['Empresa'] ?? '').trim(),
      rota: String(item['Rota Gerada no Roteirizador'] ?? '').trim(),
      transportId: String(item['Nº transporte'] ?? '').trim(),
      placa: String(item['Identif.externo 1'] ?? '').trim(),
      remessa: String(item['Fornecimento'] ?? '')
        .trim()
        .replace(/^0+/, ''),
      sequencia: parseInt(item['Seqüência']) || 0,
      codCliente: String(item['Cliente'] ?? '')
        .trim()
        .replace(/^0+/, ''),
      nomeCliente: String(item['Nome'] ?? '').trim(),
      local: String(item['Local'] ?? '').trim(),
      bairro: String(item['Bairro'] ?? '').trim(),
      perfiRoterizado: String(item['Veículo Roteirizado'] ?? '').trim(),
      perfilUtilizado: String(item['Veículo Efetivo'] ?? '').trim(),
      transportadora: String(item['Nome do Transportador'] ?? '').trim(),
      tipoDeCarga: String(item['Tipo de Carga'] ?? '').trim(),
      infoAdicionaisI: String(item['Info Adicionais I'] ?? '').trim(),
      infoAdicionaisII: String(item['Info Adicionais II'] ?? '').trim(),
      prioridade: parseInt(item['Prioridade'] ?? '0'),
    }));

    return convertedData;
  }

  async convertShipment(params: File): Promise<ShipmentPickingMapItem[]> {
    if (!params) {
      return [];
    }
    const data: any[] = (await processExcelFile(params)) as any[];
    const convertedData = data.map((item: any) => ({
      transportId: String(item['Nº transporte(DT)'] ?? '')
        .trim()
        .replace(/^0+/, ''),
      remessa: String(item['Remessa'] ?? '')
        .trim()
        .replace(/^0+/, ''),
      shipmentItem: String(item['Nº item remessa'] ?? '').trim(),
      centro: String(item['Centro'] ?? '').trim(),
      empresa: String(item['Empresa'] ?? '').trim(),
      nomeEmpresa: String(item['Nome Empresa'] ?? '').trim(),
      placa: String(item['Placa'] ?? '').trim(),
      codItem: String(item['Cód. Item'] ?? '').trim(),
      descricao: String(item['Descrição do produto'] ?? '').trim(),
      lote: String(item['Lote'] ?? '').trim(),
      quantidade: parseFloat(item['Total(Unid.Vda.)']),
      unMedida: String(item['Unid.Armaz.'] ?? '').trim(),
      dtFabricacao: new Date(item['Dt.Fabricação']),
      dtVencimento: new Date(item['Dt.Vencimento']),
      codCliente: String(item['Cód. Cliente'] ?? '')
        .trim()
        .replace(/^0+/, ''),
      nomeCliente: String(item['Nome Cliente'] ?? '').trim(),
      pesoBruto: parseFloat(item['Peso Bruto']) ,
      pesoLiquido: parseFloat(item['Peso Líquido']) ,
    }));
    return convertedData;
  }

  async convertProducts(params: File): Promise<ProductsPickingMapItem[]> {
    if (!params) {
      return [];
    }
    const data: any[] = (await processExcelFile(params)) as any[];
    const convertedData = data.map((item: any) => ({
      codItem: String(item['Cod_SKU'] ?? '').trim(),
      descricao: String(item['Descricao_SKU'] ?? '').trim(),
      shelf: parseInt(item['Shelf_Life']) || 0,
      variavel: parseInt(item['Tipo_Peso']) || 0,
      pesoCaixa: parseNumberBr(item['Peso_Liq(cx)']),
      pesoUnidade: parseNumberBr(item['Peso_Liq(un)']),
      unPorCaixa: parseInt(item['Un_Cx']) || 0,
      cxPorPallet: parseInt(item['Cx_Pallet']) || 0,
      segmento: String(item['Linha'] ?? '').trim(),
      vermelho: parseNumberBr(item['Vermelho']),
      laranja: parseNumberBr(item['Laranja']),
      amarelo: parseNumberBr(item['Amarelo']),
      verde: parseNumberBr(item['Verde']),
      pickWay: parseInt(item['PickWay']) || 0,
      endereco: String(item['Endereço'] ?? '').trim(),
      empresa: String(item['Empresa'] ?? '').trim(),
    }));

    return convertedData;
  }
}

export function parseNumberBr(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return Number(value.replace(/\./g, ',').replace(',', '.'));
}

export async function processExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        }) as any[];

        return resolve(jsonData);
      } catch (error) {
        console.error(error);
        reject(new Error('Erro ao processar o arquivo Excel'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };

    reader.readAsArrayBuffer(file);
  });
}
