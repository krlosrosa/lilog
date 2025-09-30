import type { EnrichedPickingMapItem } from '../../services/types/pickingMap';
import { Groups } from '../../services/types/groups.type';

export function gerarGrupos(
  shipments: EnrichedPickingMapItem[],
  tipo: string,
  segregarClientes: string[] = [""],
  clientesAgrupar: Groups[] = [],
  transportesAgrupar: Groups[] = [],
  remessasAgrupar: Groups[] = [],
): EnrichedPickingMapItem[] {
  return shipments.map(shipment => {
    let groupKey = ""
    if (
      segregarClientes.includes(shipment.codCliente) &&
      tipo === "TRANSPORTE"
    ) {
      groupKey = `${shipment.codCliente}`
    }

    const transporteGroup = transportesAgrupar.find(g =>
      g.items.includes(shipment.transportId),
    )
    if (transporteGroup && tipo === "TRANSPORTE") {
      groupKey = transporteGroup.name
    }

    const remessaGroup = remessasAgrupar.find(g =>
      g.items.includes(shipment.remessa),
    )
    if (remessaGroup && tipo === "TRANSPORTE") {
      groupKey = remessaGroup.name
    }

    // Procura pelo grupo que contém o código do cliente
    const clienteGroup = clientesAgrupar.find(cliente =>
      cliente.items.includes(shipment.codCliente),
    )

    // Se um grupo for encontrado e o tipo for 'CLIENTE', usa o nome do grupo
    if (clienteGroup && tipo === "CLIENTE") {
      groupKey = clienteGroup.name
    }

    if (tipo === "TRANSPORTE") {
      groupKey =
      groupKey === ''
      ? `${shipment.transportId}`
      : `${shipment.transportId}-[${shipment.codCliente}]`;
    }
    console.log({groupKey});

    if (tipo === 'CLIENTE') {
      groupKey =
        groupKey === ''
          ? `${shipment.transportId}-[${shipment.codCliente}]`
          : clienteGroup ? `${shipment.transportId}-${groupKey}` : `${shipment.transportId}-[${shipment.codCliente}]`;
    }

    return {
      id: groupKey,
      ...shipment,
    };
  });
}
