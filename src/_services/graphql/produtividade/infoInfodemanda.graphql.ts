import * as Types from '../../../services/types/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { graphqlRequestFetcher } from '@/_services/http/graphq-request.http';
export type BuscarInfoQueryVariables = Types.Exact<{
  input: Types.Scalars['String']['input'];
}>;


export type BuscarInfoQuery = { __typename?: 'Query', infoDemanda: { __typename?: 'InfoDemandaModel', processo: string, id: number, inicio: string, fim?: string | null, funcionario: string, cadastradoPorId: string, status: string, turno: string, criadoEm: string, centerId: string, obs?: string | null, tempoTrabalhado: number, tempoPausas: number, tempoTotal: number, produtividade: number, paletes: Array<{ __typename?: 'PaleteModel', id: string, empresa: string, quantidadeCaixas: number, quantidadeUnidades: number, quantidadePaletes: number, enderecoVisitado: number, segmento: string, transporteId: string, tipoProcesso: string, criadoEm: string, atualizadoEm: string, status: string, validado: boolean, criadoPorId: string }>, pausas: Array<{ __typename?: 'PausaModel', id: number, inicio: string, fim?: string | null, motivo: string, descricao: string, registradoPorId: string, pausaGeralId?: string | null }> } };



export const BuscarInfoDocument = `
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

export const useBuscarInfoQuery = <
      TData = BuscarInfoQuery,
      TError = unknown
    >(
      variables: BuscarInfoQueryVariables,
      options?: Omit<UseQueryOptions<BuscarInfoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<BuscarInfoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<BuscarInfoQuery, TError, TData>(
      {
    queryKey: ['BuscarInfo', variables],
    queryFn: graphqlRequestFetcher<BuscarInfoQuery, BuscarInfoQueryVariables>(BuscarInfoDocument, variables),
    ...options
  }
    )};

useBuscarInfoQuery.getKey = (variables: BuscarInfoQueryVariables) => ['BuscarInfo', variables];


useBuscarInfoQuery.fetcher = (variables: BuscarInfoQueryVariables, options?: RequestInit['headers']) => graphqlRequestFetcher<BuscarInfoQuery, BuscarInfoQueryVariables>(BuscarInfoDocument, variables, options);
