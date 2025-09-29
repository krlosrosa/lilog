// _shared/components/Form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitErrorHandler, useForm, UseFormReturn, type SubmitHandler, type UseFormProps } from 'react-hook-form';

import { z } from 'zod';



// Definimos as props que nosso componente Form irá aceitar
interface FormProps<T extends z.ZodType<any, any>> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onInvalid'> {
  schema: T;
  onSubmit: SubmitHandler<z.infer<T>>;
  children: React.ReactNode;
  onInvalid?: SubmitErrorHandler<z.infer<any>>;
  formOptions?: UseFormProps<z.infer<T>>;
  className?: string;
}

export type FormRef<T extends z.ZodType<any, any>> = UseFormReturn<z.infer<T>>;

export function Form<T extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  onInvalid,
  children,
  formOptions,
  className,
  ...rest
}: FormProps<T>) {
  // 1. O "ritual" do useForm agora vive aqui dentro, uma única vez.
  const methods = useForm({
    ...formOptions, // Permite passar opções extras como defaultValues
    resolver: zodResolver(schema as any),
  });
  

  return (
    // 2. O FormProvider e a tag <form> também são encapsulados.
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
        className={className}
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
}