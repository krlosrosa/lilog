import { ConvertXlsx } from "./convertXlsx/convertXlsxRepository";
import { removeDuplicadosPorId } from "../utils/removerDuplicadas";

interface FilesState {
  shipments: File | null;
  routes?: File | null;
  transportes: string[];
}

export async function listarTransportesNaoCadastrados(input: FilesState) {
  const fileConverter = new ConvertXlsx();
  const [shipments, routes] = await Promise.all([
    input.shipments
      ? fileConverter.convertShipment(input.shipments)
      : Promise.resolve([]),
    input.routes
      ? fileConverter.convertRouting(input.routes)
      : Promise.resolve([]),
  ]);

  const removerDuplicados = removeDuplicadosPorId(shipments);

  const listarTransportesIds = removerDuplicados.map(
    (shipment) => shipment.transportId,
  );

  return listarTransportesIds;
}