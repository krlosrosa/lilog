import * as Types from '../../../services/types/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { graphqlRequestFetcher } from '@/_services/http/graphq-request.http';
export type BuscarProdutividadeQueryVariables = Types.Exact<{
  input: Types.InputProdutividadeModelGraph;
}>;


export type BuscarProdutividadeQuery = { __typename?: 'Query', produtividade: Array<{ __typename?: 'ProdutividadeModel', produtividade: number, tempoTotal: number, tempoPausas: number, tempoTrabalhado: number, pausas: number, visitas: number, paletes: number, unidades: number, caixas: number, statusDemanda: string, turno: string, funcionarioId: string, nomeFuncionario: string, centerId: string, inicio: string, fim?: string | null, processo: string, cadastradoPorId: string, idDemanda: number, empresa: string, segmento: string }> };



export const BuscarProdutividadeDocument = `
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

export const useBuscarProdutividadeQuery = <
      TData = BuscarProdutividadeQuery,
      TError = unknown
    >(
      variables: BuscarProdutividadeQueryVariables,
      options?: Omit<UseQueryOptions<BuscarProdutividadeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<BuscarProdutividadeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<BuscarProdutividadeQuery, TError, TData>(
      {
    queryKey: ['BuscarProdutividade', variables],
    queryFn: graphqlRequestFetcher<BuscarProdutividadeQuery, BuscarProdutividadeQueryVariables>(BuscarProdutividadeDocument, variables),
    ...options
  }
    )};

useBuscarProdutividadeQuery.getKey = (variables: BuscarProdutividadeQueryVariables) => ['BuscarProdutividade', variables];


useBuscarProdutividadeQuery.fetcher = (variables: BuscarProdutividadeQueryVariables, options?: RequestInit['headers']) => graphqlRequestFetcher<BuscarProdutividadeQuery, BuscarProdutividadeQueryVariables>(BuscarProdutividadeDocument, variables, options);
