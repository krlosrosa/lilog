import { getSession } from 'next-auth/react';

export const graphqlRequestFetcher = <TData, TVariables extends { [key: string]: any }>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers'],
) => {
  return async (): Promise<TData> => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options, // caso queira passar headers extras
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    // Parse o JSON e retorne apenas os dados
    const json = await response.json();

    // Normalmente, GraphQL retorna { data, errors }, então pegamos apenas data
    if (json.errors) {
      throw new Error(JSON.stringify(json.errors));
    }

    // Pode vir "puro" (ex: { GetOverview: {...} }) ou dentro de { data }
    const data = json.data ?? json;

    return data as TData;
  };
};
