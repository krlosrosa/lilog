import * as Types from '../../../services/types/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { graphqlRequestFetcher } from '@/_services/http/graphq-request.http';
export type StatusPorTransporteQueryVariables = Types.Exact<{
  statusPorTransporteCommand: Types.InputTransporteModel;
}>;


export type StatusPorTransporteQuery = { __typename?: 'Query', statusPorTransporte: { __typename?: 'OutputTransporteModel', naoIniciado: number, emSeparacao: number, emConferencia: number, emCarregamento: number, carregamentoConcluido: number, faturado: number } };



export const StatusPorTransporteDocument = `
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

export const useStatusPorTransporteQuery = <
      TData = StatusPorTransporteQuery,
      TError = unknown
    >(
      variables: StatusPorTransporteQueryVariables,
      options?: Omit<UseQueryOptions<StatusPorTransporteQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<StatusPorTransporteQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<StatusPorTransporteQuery, TError, TData>(
      {
    queryKey: ['StatusPorTransporte', variables],
    queryFn: graphqlRequestFetcher<StatusPorTransporteQuery, StatusPorTransporteQueryVariables>(StatusPorTransporteDocument, variables),
    ...options
  }
    )};

useStatusPorTransporteQuery.getKey = (variables: StatusPorTransporteQueryVariables) => ['StatusPorTransporte', variables];


useStatusPorTransporteQuery.fetcher = (variables: StatusPorTransporteQueryVariables, options?: RequestInit['headers']) => graphqlRequestFetcher<StatusPorTransporteQuery, StatusPorTransporteQueryVariables>(StatusPorTransporteDocument, variables, options);
