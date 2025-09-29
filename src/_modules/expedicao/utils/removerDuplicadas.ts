import { ShipmentPickingMapItem } from "../services/types/pickingMap";

export function removeDuplicadosPorId(
  arr: ShipmentPickingMapItem[],
): ShipmentPickingMapItem[] {
  const map = new Map();
  arr.forEach((item) => {
    if (!map.has(item.transportId)) {
      map.set(item.transportId, item);
    }
  });
  return Array.from(map.values());
}