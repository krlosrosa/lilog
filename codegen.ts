import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  // ⬇️ Aqui ajustei para pegar .graphql em vez de .graph.ts
  documents: 'src/_services/graphql/**/*.ts',
  generates: {
    // Tipos globais do schema
    'src/services/types/types.ts': {
      plugins: ['typescript'],
    },
    // Geração ao lado de cada operação
    'src/services': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.graphql.ts', // ⬅️ saída desejada
        baseTypesPath: 'types/types.ts',
      },
      plugins: [
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: {
          func: '@/_services/http/graphq-request.http#graphqlRequestFetcher',
          isReactHook: false,
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        reactQueryVersion: 5,
      },
    },
  },
};

export default config;
