import { ConvertXlsx } from "./convertXlsx/convertXlsxRepository";
import { distribuirPaletePorTipo } from "../services/pipeline/07-agruparPaletePorTipo";
import { classificarPorCampos } from "../services/pipeline/08-classificarItens";
import { splitPalete } from "../services/pipeline/09-splitPalete";
import { enriquecerItems } from "../services/pipeline/1-enriquecerItems";
import { gerarMapa } from "../services/pipeline/11-gerarMapa";
import { transformarQuantidadeEmUnidade } from "../services/pipeline/2-transformarQuantidadeEmUnidade";
import { definirFaixaERange } from "../services/pipeline/3-definicaoFaixaShelf";
import { gerarGrupos } from "../services/pipeline/4-gerarGrupos";
import { agruparESomar } from "../services/pipeline/5-agruparESomar";
import { alocarCaixasEPaletes } from "../services/pipeline/6-alocarCaixasEPaletes";
import { ImpressaoMapa } from "../services/types/pickingMap";
import { Groups } from "../services/types/groups.type";
import { separarItensFifo } from "../services/pipeline/11-separarItensFifo";
import { FilesState } from "../_components/0_upload/uploadFiles";
import { ConfiguracaoImpressao } from "./types/configuracaoImpressao.type";


export async function gerarMapaSeparacao(
  input: FilesState,
  config: ConfiguracaoImpressao,
  segregarClientes?: string[],
  agruparClientes?: Groups[],
  agruparTransportes?: Groups[],
  agruparRemessas?: Groups[],
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
    routingPlans,
    products,
  );
  const transformQuantities =
    transformarQuantidadeEmUnidade(enrichedShipments);
  const enrichedShipmentsWithFaixa = definirFaixaERange(
    transformQuantities,
    config.dataMaximaPercentual || 0,
  );
  const enrichedShipmentsWithGrupos = gerarGrupos(
    enrichedShipmentsWithFaixa,
    config.tipoImpressao,
    segregarClientes,
    agruparClientes,
    agruparTransportes,
    agruparRemessas,
  );
  const enrichedShipmentsWithGruposESomar = agruparESomar(
    enrichedShipmentsWithGrupos,
  );

  const enrichedShipmentsWithGruposESomarLog = enrichedShipmentsWithGruposESomar.filter(item => item.codItem === "600089007");
  console.log({enrichedShipmentsWithGruposESomarLog});

  const enrichedShipmentsWithCaixasEPaletes = alocarCaixasEPaletes(
    enrichedShipmentsWithGruposESomar,
  );

const enrichedShipmentsWithCaixasEPaletesLog = enrichedShipmentsWithCaixasEPaletes.filter(item => item.codItem === "600089007");
console.log({enrichedShipmentsWithCaixasEPaletesLog});

  const enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete = splitPalete({ items: enrichedShipmentsWithCaixasEPaletes, splitPalete: config.separarPaleteFull, splitUnidade: config.separarUnidades });

  const enrichedShipmentsWithCaixasEPaletesClassificadoSplitPaleteLog = enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete.filter(item => item.codItem === "600089007");
  console.log({enrichedShipmentsWithCaixasEPaletesClassificadoSplitPaleteLog});


  const enrichedShipmentsWithFifo = separarItensFifo(enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete, config.segregarFifo);

  const enrichedShipmentsWithFifoLog = enrichedShipmentsWithFifo.filter(item => item.codItem === "600089007");
  console.log({enrichedShipmentsWithFifoLog});

  const enrichedShipmentsWithCaixasEPaletesClassificado =
    classificarPorCampos(
      enrichedShipmentsWithFifo,
      ['id', 'produto.segmento', 'tipo', 'produto.pickWay'],
    );

  const enrichedShipmentsWithCaixasEPaletesClassificadoLog = enrichedShipmentsWithCaixasEPaletesClassificado.filter(item => item.codItem === "600089007");
  console.log({enrichedShipmentsWithCaixasEPaletesClassificadoLog});

  const enrichedShipmentsWithDistribuicao = distribuirPaletePorTipo({
    lista: enrichedShipmentsWithCaixasEPaletesClassificado,
    tipo: config.tipoQuebra,
    quantidade: config.valorQuebra ?? 0,
  });

  const enrichedShipmentsWithDistribuicaoLog = enrichedShipmentsWithDistribuicao.filter(item => item.codItem === "600089007");
  console.log({enrichedShipmentsWithDistribuicaoLog});

  const mapas = gerarMapa(enrichedShipmentsWithDistribuicao);

  return mapas;

}