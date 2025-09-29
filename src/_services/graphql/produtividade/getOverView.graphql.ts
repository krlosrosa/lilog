import * as Types from '../../../services/types/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { graphqlRequestFetcher } from '@/_services/http/graphq-request.http';
export type GetOverViewQueryVariables = Types.Exact<{
  inputProdutividade: Types.InputProdutividadeModelGraph;
  inputOverview: Types.InputOverViewModelGraph;
}>;


export type GetOverViewQuery = { __typename?: 'Query', produtividade: Array<{ __typename?: 'ProdutividadeModel', produtividade: number, tempoTotal: number, tempoPausas: number, tempoTrabalhado: number, pausas: number, visitas: number, paletes: number, unidades: number, caixas: number, statusDemanda: string, turno: string, funcionarioId: string, nomeFuncionario: string, centerId: string, inicio: string, fim?: string | null, processo: string, cadastradoPorId: string, idDemanda: number, empresa: string, segmento: string }>, overViewProdutividade: { __typename?: 'OverViewModel', processos: number, emAndamento: number, concluidos: number, totalCaixas: number, totalUnidades: number, produtividade: number } };



export const GetOverViewDocument = `
    query GetOverView($inputProdutividade: InputProdutividadeModelGraph!, $inputOverview: InputOverViewModelGraph!) {
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
  }
  overViewProdutividade(overViewProdutividadeCommand: $inputOverview) {
    processos
    emAndamento
    concluidos
    totalCaixas
    totalUnidades
    produtividade
  }
}
    `;

export const useGetOverViewQuery = <
      TData = GetOverViewQuery,
      TError = unknown
    >(
      variables: GetOverViewQueryVariables,
      options?: Omit<UseQueryOptions<GetOverViewQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetOverViewQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetOverViewQuery, TError, TData>(
      {
    queryKey: ['GetOverView', variables],
    queryFn: graphqlRequestFetcher<GetOverViewQuery, GetOverViewQueryVariables>(GetOverViewDocument, variables),
    ...options
  }
    )};

useGetOverViewQuery.getKey = (variables: GetOverViewQueryVariables) => ['GetOverView', variables];


useGetOverViewQuery.fetcher = (variables: GetOverViewQueryVariables, options?: RequestInit['headers']) => graphqlRequestFetcher<GetOverViewQuery, GetOverViewQueryVariables>(GetOverViewDocument, variables, options);
