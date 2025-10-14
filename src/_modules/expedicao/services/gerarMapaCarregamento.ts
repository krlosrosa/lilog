import { ConvertXlsx } from "./convertXlsx/convertXlsxRepository";
import { distribuirPaletePorTipo } from "./pipeline/07-agruparPaletePorTipo";
import { classificarPorCampos } from "./pipeline/08-classificarItens";
import { splitPalete } from "./pipeline/09-splitPalete";
import { enriquecerItems } from "./pipeline/1-enriquecerItems";
import { gerarMapa } from "./pipeline/11-gerarMapa";
import { transformarQuantidadeEmUnidade } from "./pipeline/2-transformarQuantidadeEmUnidade";
import { definirFaixaERange } from "./pipeline/3-definicaoFaixaShelf";
import { gerarGrupos } from "./pipeline/4-gerarGrupos";
import { agruparESomar } from "./pipeline/5-agruparESomar";
import { alocarCaixasEPaletes } from "./pipeline/6-alocarCaixasEPaletes";
import { ImpressaoMapa } from "./types/pickingMap";
import { FilesState } from "../_components/0_upload/uploadFiles";
import { alocarCaixaEUnidade } from "./pipeline/2-AlocarCaixaEUnidade";
import { gerarMapaCarregamentoUm } from "./pipeline/11-gerarMapaCarregamento";
import { agruparESomarCarregamento } from "./pipeline/5-agruparESomarCarregamento";
import { alocarCaixasCarregamento } from "./pipeline/6-alocarCaixasEPaletesCarregamento";


export async function gerarMapaCarregamento(
  input: FilesState,
): Promise<ImpressaoMapa[]> {
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

  const enrichedShipments = enriquecerItems(
    shipments,
    products,
    routingPlans,
  );
  const transformQuantities =
    transformarQuantidadeEmUnidade(enrichedShipments);

  const enrichedShipmentsWithGrupos = gerarGrupos(
    transformQuantities,
    'TRANSPORTE',
  );

  const converterParaCaixa = alocarCaixasCarregamento(
    enrichedShipmentsWithGrupos,
  );


  const enrichedShipmentsWithGruposESomar = agruparESomarCarregamento(
    converterParaCaixa,
  );

  const definirFaixa = definirFaixaERange(enrichedShipmentsWithGruposESomar,0)

  const enrichedShipmentsWithCaixasEPaletesClassificado =
    classificarPorCampos(
      definirFaixa,
      ['id', 'produto.segmento', 'tipo', 'produto.pickWay'],
    );

  const mapas = gerarMapaCarregamentoUm(enrichedShipmentsWithCaixasEPaletesClassificado);

  return mapas;

}