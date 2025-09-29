import { gql } from 'graphql-request';

export const STATUS_POR_TRANSPORTE = gql`
query StatusPorTransporte($statusPorTransporteCommand: InputTransporteModel!) {
  statusPorTransporte(statusPorTransporteCommand: $statusPorTransporteCommand) {
    naoIniciado
    emSeparacao
    emConferencia
    emCarregamento
    carregamentoConcluido
    faturado
  }
}
`;