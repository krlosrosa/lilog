import { ConvertXlsx } from "./convertXlsx/convertXlsxRepository";
import { ShipmentPickingMapItem } from "../services/types/pickingMap";
import { removeDuplicadosPorId } from "../utils/removerDuplicadas";  

export async function listarTransportes(shipments: File): Promise<string[]> {
  const fileConverter = new ConvertXlsx();
  const shipmentsConverted = await fileConverter.convertShipment(shipments);
  const transportes = removeDuplicadosPorId(shipmentsConverted);
  const transportesIds = transportes.map((transporte) => transporte.transportId);
  return transportesIds ;
}
