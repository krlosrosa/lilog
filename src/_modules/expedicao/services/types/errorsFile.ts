export type ErrorFiles = {
  error: boolean;
  errors: ErrorField[];
  produtosNaoEncontrados: ProdutoNaoEncontrado[];
};

export type ErrorField = {
  arquivo: string;
  message: string;
  codigo: string;
  linha: number;
  campo: string;
};

export type ProdutoNaoEncontrado = {
  id: string;
  descricao: string;
};