import type {
  EnrichedPickingMapItem,
  ProductsPickingMapItem,
  RoutingPickingMapItem,
  ShipmentPickingMapItem,
} from '../../services/types/pickingMap';

export function enriquecerItems(
  shipments: ShipmentPickingMapItem[],
  products: ProductsPickingMapItem[],
  routingPlans?: RoutingPickingMapItem[],
): EnrichedPickingMapItem[] {
  return shipments.map((shipment) => {
    const rota =
      routingPlans?.find((route) => route.codCliente === shipment.codCliente) ||
      routingPlans?.find(
        (route) => route.transportId === shipment.transportId,
      ) ||
      null;
    const produto = products.find(
      (product) => product.codItem === shipment.codItem,
    );

    return {
      tipo: 'picking',
      ...shipment,
      visitas: 1,
      rota,
      produto: produto as ProductsPickingMapItem,
    };
  });
}
