import { gql } from 'graphql-request';

export const BUSCAR_INFO_DEMANDA = gql`

query BuscarInfo($input: String!) {
  infoDemanda(paleteId: $input) {
    processo
    id
    inicio
    fim
    funcionario
    cadastradoPorId
    status
    turno
    criadoEm
    centerId
    obs
    tempoTrabalhado
    tempoPausas
    tempoTotal
    produtividade
    paletes {
       id
      empresa
      quantidadeCaixas
      quantidadeUnidades
      quantidadePaletes
      enderecoVisitado
      segmento
      transporteId
      tipoProcesso
      criadoEm
      atualizadoEm
      status
      validado
      criadoPorId
    }
    pausas {
      id
      inicio
      fim
      motivo
      descricao
      descricao
      registradoPorId
      pausaGeralId
    }
  }
}
`;