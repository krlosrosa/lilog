import { TransportInfoZodDto } from "@/_services/api/model";
import { ConvertXlsx } from "./convertXlsx/convertXlsxRepository";
import { removeDuplicadosPorId } from "../utils/removerDuplicadas";

interface FilesState {
  shipments: File | null;
  routes?: File | null;
  transportes: string[];
}

export async function ajustarInputDados(input: FilesState): Promise<TransportInfoZodDto> {  
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

  return input.transportes.map((transporte) => {
    const findItem = shipments.find((item) => item.transportId === transporte);
    const findRoute = routes.find((item) => item.transportId === transporte);
    return {
      numeroTransporte: transporte,
      nomeRota: findRoute?.rota ?? '',
      nomeTransportadora: findRoute?.transportadora ?? '',
      placa: findRoute?.placa ?? findItem?.placa ?? '',
      prioridade: findRoute?.prioridade ?? 10,
      obs: findRoute?.infoAdicionaisI ?? '',
    }
  })

}