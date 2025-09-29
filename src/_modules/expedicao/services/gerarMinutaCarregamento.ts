import { ConvertXlsx } from "./convertXlsx/convertXlsxRepository";
import { FilesState } from "../_components/0_upload/uploadFiles";
import { ImpressaoMinutaCarregamento } from "../services/types/pickingMap";
import { enriquecerItems } from "./pipeline/1-enriquecerItems";
import { transformarQuantidadeEmUnidade } from "../services/pipeline/2-transformarQuantidadeEmUnidade";
import { gerarGrupos } from "./pipeline/4-gerarGrupos";
import { agruparESomar } from "./pipeline/5-agruparESomar";
import { alocarCaixasEPaletes } from "./pipeline/6-alocarCaixasEPaletes";
import { agruparESomarMinuta } from "../services/pipeline/5-agruparESomarMinuta";
import { gerarMinuta } from "../services/pipeline/12-gerarMinuta";

  export async function gerarMinutaCarregamento(input: FilesState): Promise<ImpressaoMinutaCarregamento[]> {
    const fileConverter = new ConvertXlsx();
    const [shipments, products, routingPlans] = await Promise.all([
      input.shipments
        ? fileConverter.convertShipment(input.shipments)
        : Promise.resolve([]),
      input.products
        ? fileConverter.convertProducts(input.products)
        : Promise.resolve([]),
      input.routes
        ? fileConverter.convertRouting(input.routes)
        : Promise.resolve([]),
    ]);

    if (!shipments) {
      throw new Error('Não foi possível enriquecer os itens');
    }

    // Enriquecer itens
    const enrichedShipments = enriquecerItems(
      shipments,
      routingPlans,
      products,
    );
    // Transformar quantidades em Unidade
    const transformQuantities =
      transformarQuantidadeEmUnidade(enrichedShipments);
    // Definir faixa e range
    const enrichedShipmentsWithGrupos = gerarGrupos(
      transformQuantities,
      'TRANSPORTE',
    );
    // Agrupar e somar
    const enrichedShipmentsWithGruposESomar = agruparESomar(
      enrichedShipmentsWithGrupos,
    );
    // Alocar caixas e paletes
    const enrichedShipmentsWithCaixasEPaletes = alocarCaixasEPaletes(
      enrichedShipmentsWithGruposESomar,
    );
    // Agrupar e somar minuta
    const enrichedShipmentsWithGruposESomarMinuta = agruparESomarMinuta(
      enrichedShipmentsWithCaixasEPaletes,
    );
    // Gerar mapas
    const mapas = gerarMinuta(enrichedShipmentsWithGruposESomarMinuta);

    return mapas;
  }