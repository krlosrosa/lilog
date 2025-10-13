// axios-instance.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

export const AXIOS_INSTANCE = axios.create({
  baseURL: '/api/proxy/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// cliente compatível com a assinatura do customInstance
export const axiosFetcher = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const source = axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cancelToken: source.token,
  }).then(({ data }) => data as T);

  // permite cancelar (igual ao customInstance)
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// Tipos extras para compatibilidade
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
