import { getSession } from 'next-auth/react';
import axios, { AxiosRequestHeaders } from 'axios';

export const graphqlRequestFetcher = <
  TData,
  TVariables extends { [key: string]: any }
>(
  query: string,
  variables?: TVariables,
  options?: AxiosRequestHeaders,
) => {
  return async (): Promise<TData> => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    try {
      const response = await axios.post(
        '/api/graphql',
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options, // headers extras
          },
        },
      );

      return response.data;

    } catch (error: any) {
      // axios já lança erro em status >= 400
      throw new Error(error?.message || 'Erro na requisição GraphQL');
    }
  };
};