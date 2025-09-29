import { gql } from 'graphql-request';

export const BUSCAR_PRODUTIVIDADE = gql`
query GetOverView(
    $inputProdutividade: InputProdutividadeModelGraph!, 
  $inputOverview: InputOverViewModelGraph!
) {
  produtividade(buscarProdutividadeCommand: $inputProdutividade) {
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
  },
  overViewProdutividade(overViewProdutividadeCommand: $inputOverview){
    processos
    emAndamento
    concluidos
    totalCaixas
    totalUnidades
    produtividade
  }
}
`;
