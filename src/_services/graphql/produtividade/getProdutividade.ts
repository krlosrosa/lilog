import { gql } from 'graphql-request';

export const BUSCAR_PRODUTIVIDADE = gql`
query BuscarProdutividade($input: InputProdutividadeModelGraph!) {
  produtividade(buscarProdutividadeCommand: $input) {
    produtividade
    tempoTotal
    tempoPausas
    tempoTrabalhado
    pausas
    visitas
    paletes
    unidades
    caixas
    statusDemanda
    turno
    funcionarioId
    nomeFuncionario
    centerId
    inicio
    fim
    processo
    cadastradoPorId
    funcionarioId
    idDemanda
    empresa
    processo
    segmento
  }
}
`;
