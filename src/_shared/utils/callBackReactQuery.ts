import { toast } from 'react-toastify';
import { type UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from "axios";
import { queryClient } from '@/_shared/providers/queryProvider';

// Definimos os argumentos que nossa função irá aceitar
interface CreateMutationOptionsArgs<TData, TError, TVariables> {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: string | ReadonlyArray<string> | string[];
  onSuccessCallback?: (data: TData, variables: TVariables, context: unknown) => void;
  onErrorCallback?: (error: TError, variables: TVariables, context: unknown) => void;
}

/**
 * Cria um objeto de configuração padronizado para hooks de mutação (useMutation)
 * que exibe notificações de sucesso ou erro usando react-toastify.
 * @param args - Mensagens de sucesso/erro e callbacks opcionais.
 * @returns Um objeto para ser usado na opção 'mutation' do hook.
 */
export function callBackReactQuery<
  TData = unknown,
  TError = AxiosError | Error,
  TVariables = void,
>({
  successMessage,
  errorMessage,
  invalidateQueries,
  onSuccessCallback,
  onErrorCallback,
}: CreateMutationOptionsArgs<TData, TError, TVariables>) {
  // Retorna o objeto que você estava repetindo
  const mutationOptions: UseMutationOptions<TData, TError, TVariables> = {
    onSuccess: (data, variables, context) => {
      
      toast.success(successMessage);
      
      // Invalidar queries se fornecidas
      if (invalidateQueries) {
        const queryKeys = Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries];
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      
      // Se um callback extra foi passado, execute-o também
      onSuccessCallback?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (error instanceof AxiosError) {
        const apiMessage =
        (error.response?.data as any)?.message || error.message || errorMessage;
        toast.error(`${apiMessage || errorMessage}`);
      } else {
        console.error('Mutation Error:', error);
        toast.error(`${errorMessage}`);
        // Se um callback extra foi passado, execute-o também
        onErrorCallback?.(error, variables, context);
      }
    },
  
  };
  
  // Seus hooks do Orval esperam um objeto com a chave 'mutation'
  return {
    mutation: mutationOptions
  };
}