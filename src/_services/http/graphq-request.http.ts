// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/react';

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql');

/**
 * Fetcher para o CLIENTE (react-query hooks).
 * Esta função recebe a query/variables e RETORNA uma função async.
 * Este é o padrão que seu graphql-codegen está esperando.
 */
export const graphqlRequestFetcher = <TData, TVariables extends { [key: string]: any }>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers'],
) => {
  // Retorna a função que o react-query irá de fato executar
  return async (): Promise<TData> => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    client.setHeader('Authorization', `Bearer ${token}`);

    return client.request({
      document: query,
      variables,
      // Usando o spread condicional que já havíamos corrigido
      ...options,
    });
  };
};