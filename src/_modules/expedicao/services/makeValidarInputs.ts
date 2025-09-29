import { ConvertXlsx } from './convertXlsx/convertXlsxRepository';
import type {
  ErrorField,
  ErrorFiles,
  ProdutoNaoEncontrado,
} from './types/errorsFile';
import { ShipmentPickingMapItem } from './types/pickingMap';
import {
  entregaSchema,
  produtoSchema,
  rotaSchema,
} from './schemas/inputFiles.schema'; 

export interface FilesState {
  shipments: File | null;
  products: File | null;
  routes?: File | null;
}


export async function ValidarInputs(input: FilesState): Promise<ErrorFiles> {
  const fileConverter = new ConvertXlsx();
  const [shipments, products, routes] = await Promise.all([
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

  if (!shipments || !products || !routes) {
    throw new Error('Não foi possível enriquecer os itens');
  }

  const shipmentsSchema = entregaSchema.array().safeParse(shipments, {
    error: () => 'Contextual error'
  }).error;
  const productsSchema = produtoSchema.array().safeParse(products).error;
  const routesSchema = rotaSchema.array().safeParse(routes).error;

  const errors: ErrorField[] = [];
  const produtosNaoEncontrados: ProdutoNaoEncontrado[] = [];

  const vistos = new Set<string>();
  const unicos = shipments.filter((shipment: ShipmentPickingMapItem) => {
    if (vistos.has(shipment.codItem)) {
      return false;
    }
    vistos.add(shipment.codItem);
    return true;
  });

  unicos.forEach((shipment) => {
    const produto = products.find(
      (product) => product.codItem === shipment.codItem,
    );
    if (!produto) {
      produtosNaoEncontrados.push({
        id: shipment.codItem,
        descricao: shipment.descricao,
      });
    }
  });

  const mapErros = {
    too_big: 'número de caracteres excedido',
    invalid_type: 'tipo inválido',
    required: 'campo obrigatório',
    min: 'valor mínimo',
    max: 'valor máximo',
  }

  if (shipmentsSchema) {
    shipmentsSchema.issues.forEach((issue) => {
      errors.push({
        arquivo: 'remessas',
        message: issue.message,
        codigo: mapErros[issue.code as keyof typeof mapErros],
        linha: (issue.path[0] as number) + 2,
        campo: issue.path[1] as string,
      });
    });
  }

  if (productsSchema) {
    productsSchema.issues.forEach((issue) => {
      errors.push({
        arquivo: 'produtos',
        message: issue.message,
        codigo: mapErros[issue.code as keyof typeof mapErros],
        linha: (issue.path[0] as number) + 2,
        campo: issue.path[1] as string,
      });
    });
  }

  if (routesSchema) {
    routesSchema.issues.forEach((issue) => {
      errors.push({
        arquivo: 'rotas',
        message: issue.message,
        codigo: mapErros[issue.code as keyof typeof mapErros],
        linha: (issue.path[0] as number) + 2,
        campo: issue.path[1] as string,
      });
    });
  }

  const isError = errors.length > 0;
  const validateFiles = shipments && products;

  return {
    error: isError || !validateFiles || produtosNaoEncontrados.length > 0,
    errors,
    produtosNaoEncontrados,
  };
}
