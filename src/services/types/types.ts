export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthorizationModel = {
  __typename?: 'AuthorizationModel';
  processo: Scalars['String']['output'];
  role: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type AuthorizationModelInput = {
  centerId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateTesteInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type InfoDemandaModel = {
  __typename?: 'InfoDemandaModel';
  cadastradoPorId: Scalars['String']['output'];
  centerId: Scalars['String']['output'];
  criadoEm: Scalars['String']['output'];
  fim?: Maybe<Scalars['String']['output']>;
  funcionario: Scalars['String']['output'];
  funcionarioId: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  inicio: Scalars['String']['output'];
  obs?: Maybe<Scalars['String']['output']>;
  paletes: Array<PaleteModel>;
  pausas: Array<PausaModel>;
  processo: Scalars['String']['output'];
  produtividade: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  tempoPausas: Scalars['Float']['output'];
  tempoTotal: Scalars['Float']['output'];
  tempoTrabalhado: Scalars['Float']['output'];
  turno: Scalars['String']['output'];
};

export type InputOverViewModelGraph = {
  centerId: Scalars['String']['input'];
  data: Scalars['String']['input'];
  processo: Scalars['String']['input'];
  segmento: Scalars['String']['input'];
};

export type InputProdutividadeModelGraph = {
  centerId: Scalars['String']['input'];
  data: Scalars['String']['input'];
  empresa?: InputMaybe<Scalars['String']['input']>;
  paginacao?: InputMaybe<PaginacaoGraph>;
  pesquisa?: InputMaybe<Scalars['String']['input']>;
  processo: Scalars['String']['input'];
  segmento: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type InputTransporteModel = {
  centerId: Scalars['String']['input'];
  data: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTeste: Teste;
  removeTeste: Teste;
  updateTeste: Teste;
};


export type MutationCreateTesteArgs = {
  createTesteInput: CreateTesteInput;
};


export type MutationRemoveTesteArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateTesteArgs = {
  updateTesteInput: UpdateTesteInput;
};

export type OutputTransporteModel = {
  __typename?: 'OutputTransporteModel';
  carregamentoConcluido: Scalars['Float']['output'];
  emCarregamento: Scalars['Float']['output'];
  emConferencia: Scalars['Float']['output'];
  emSeparacao: Scalars['Float']['output'];
  faturado: Scalars['Float']['output'];
  naoIniciado: Scalars['Float']['output'];
};

export type OverViewModel = {
  __typename?: 'OverViewModel';
  concluidos: Scalars['Float']['output'];
  emAndamento: Scalars['Float']['output'];
  processos: Scalars['Float']['output'];
  produtividade: Scalars['Float']['output'];
  totalCaixas: Scalars['Float']['output'];
  totalUnidades: Scalars['Float']['output'];
};

export type PaginacaoGraph = {
  limit?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
};

export type PaleteModel = {
  __typename?: 'PaleteModel';
  atualizadoEm: Scalars['String']['output'];
  criadoEm: Scalars['String']['output'];
  criadoPorId: Scalars['String']['output'];
  empresa: Scalars['String']['output'];
  enderecoVisitado: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  quantidadeCaixas: Scalars['Float']['output'];
  quantidadePaletes: Scalars['Float']['output'];
  quantidadeUnidades: Scalars['Float']['output'];
  segmento: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tipoProcesso: Scalars['String']['output'];
  transporteId: Scalars['String']['output'];
  validado: Scalars['Boolean']['output'];
};

export type PausaModel = {
  __typename?: 'PausaModel';
  descricao: Scalars['String']['output'];
  fim?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  inicio: Scalars['String']['output'];
  motivo: Scalars['String']['output'];
  pausaGeralId?: Maybe<Scalars['String']['output']>;
  registradoPorId: Scalars['String']['output'];
};

export type ProdutividadeModel = {
  __typename?: 'ProdutividadeModel';
  cadastradoPorId: Scalars['String']['output'];
  caixas: Scalars['Float']['output'];
  centerId: Scalars['String']['output'];
  empresa: Scalars['String']['output'];
  fim?: Maybe<Scalars['String']['output']>;
  funcionarioId: Scalars['String']['output'];
  idDemanda: Scalars['Float']['output'];
  inicio: Scalars['String']['output'];
  nomeFuncionario: Scalars['String']['output'];
  paletes: Scalars['Float']['output'];
  pausas: Scalars['Float']['output'];
  processo: Scalars['String']['output'];
  produtividade: Scalars['Float']['output'];
  segmento: Scalars['String']['output'];
  statusDemanda: Scalars['String']['output'];
  tempoPausas: Scalars['Float']['output'];
  tempoTotal: Scalars['Float']['output'];
  tempoTrabalhado: Scalars['Float']['output'];
  turno: Scalars['String']['output'];
  unidades: Scalars['Float']['output'];
  visitas: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  infoDemanda: InfoDemandaModel;
  listarPermissoesParaCasl: Array<AuthorizationModel>;
  overViewProdutividade: OverViewModel;
  produtividade: Array<ProdutividadeModel>;
  statusPorTransporte: OutputTransporteModel;
  teste: Teste;
};


export type QueryInfoDemandaArgs = {
  paleteId: Scalars['String']['input'];
};


export type QueryListarPermissoesParaCaslArgs = {
  authorizationModelInput: AuthorizationModelInput;
};


export type QueryOverViewProdutividadeArgs = {
  overViewProdutividadeCommand: InputOverViewModelGraph;
};


export type QueryProdutividadeArgs = {
  buscarProdutividadeCommand: InputProdutividadeModelGraph;
};


export type QueryStatusPorTransporteArgs = {
  statusPorTransporteCommand: InputTransporteModel;
};


export type QueryTesteArgs = {
  id: Scalars['Int']['input'];
};

export type Teste = {
  __typename?: 'Teste';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type UpdateTesteInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};
