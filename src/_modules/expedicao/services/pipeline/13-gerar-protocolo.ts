import { ConvertXlsx } from "../convertXlsx/convertXlsxRepository";
import { ShipmentPickingMapItem } from "../types/pickingMap";

type Props = {
  shipments: File | null;
}

export type ItemTransporte = {
  pesoLiquido: number
  pesoBruto: number
  transportId: string
}

export async function gerarProtocolo({ shipments }: Props): Promise<ItemTransporte[] | null> {

  const fileConverter = new ConvertXlsx();
  if (shipments) {
    const itens = await fileConverter.convertShipment(shipments)
    return agruparPorTransporte(itens)
  }
  return null
}

function agruparPorTransporte(
  itens: ShipmentPickingMapItem[],
): ItemTransporte[] {
  const agrupado = Object.values(
    itens.reduce((acc, item) => {
      const key = item.transportId;

      if (!acc[key]) {
        acc[key] = {
          transportId: key,
          pesoLiquido: 0,
          pesoBruto: 0,
        };
      }

      acc[key].pesoLiquido += item.pesoLiquido || 0;
      acc[key].pesoBruto += item.pesoBruto || 0;

      return acc;
    }, {} as Record<string, ItemTransporte>),
  );

  return agrupado;
}